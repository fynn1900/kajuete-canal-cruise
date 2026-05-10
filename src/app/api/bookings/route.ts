import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

const MAX_CAPACITY = 6

async function notifyN8n(booking: {
  contact_name: string
  email: string | null
  booking_date: string
  group_size: number
  adults_count: number | null
  kids_count: number | null
}) {
  const webhookUrl = process.env.N8N_BOOKING_WEBHOOK || 'https://fynn723.app.n8n.cloud/webhook/kajuete_booking'
  await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(booking),
  })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { booking_date, group_size, contact_name, email, adults_count, kids_count } = body

    if (!booking_date || !group_size || !contact_name) {
      return NextResponse.json({ error: 'Fehlende Pflichtfelder' }, { status: 400 })
    }
    if (group_size < 1 || group_size > MAX_CAPACITY) {
      return NextResponse.json({ error: 'Ungültige Gruppengröße' }, { status: 400 })
    }

    const db = supabaseAdmin()

    const { data: existing, error: fetchError } = await db
      .from('canal_cruise_bookings')
      .select('group_size')
      .eq('booking_date', booking_date)

    if (fetchError) return NextResponse.json({ error: 'Datenbankfehler: ' + fetchError.message }, { status: 500 })

    const alreadyBooked = (existing || []).reduce((s, r) => s + r.group_size, 0)

    // Minimum 2 persons total — solo booking only allowed if someone else already booked
    if (alreadyBooked + group_size < 2) {
      return NextResponse.json({ error: 'Mindestens 2 Personen müssen insgesamt gebucht haben.' }, { status: 400 })
    }

    if (group_size > MAX_CAPACITY - alreadyBooked) {
      return NextResponse.json({ error: `Nur noch ${MAX_CAPACITY - alreadyBooked} Plätze verfügbar` }, { status: 409 })
    }

    const { data: blockedDay } = await db
      .from('blocked_dates')
      .select('id')
      .eq('blocked_date', booking_date)
      .maybeSingle()
    if (blockedDay) return NextResponse.json({ error: 'Dieser Tag ist gesperrt' }, { status: 409 })

    const { data, error: insertError } = await db
      .from('canal_cruise_bookings')
      .insert({ booking_date, group_size, contact_name, email: email || null, adults_count: adults_count || null, kids_count: kids_count || null })
      .select()
      .single()

    if (insertError) return NextResponse.json({ error: 'Buchung fehlgeschlagen: ' + insertError.message }, { status: 500 })

    // Fire & forget — n8n sends confirmation to admin AND guest
    notifyN8n({ contact_name, email, booking_date, group_size, adults_count, kids_count }).catch(console.error)

    return NextResponse.json({ success: true, booking: data }, { status: 201 })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('Booking route error:', msg)
    return NextResponse.json({ error: 'Serverfehler: ' + msg }, { status: 500 })
  }
}
