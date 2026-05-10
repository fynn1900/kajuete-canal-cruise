import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

const MAX_CAPACITY = 6
const N8N_URL = process.env.N8N_BOOKING_WEBHOOK || 'https://fynn723.app.n8n.cloud/webhook/kajuete_booking'

async function notifyN8n(payload: {
  contact_name: string
  email: string | null
  booking_date: string
  group_size: number
  adults_count: number | null
  kids_count: number | null
}) {
  const body = JSON.stringify(payload)
  const attempts = 3

  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(N8N_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
        signal: AbortSignal.timeout(8000),
      })
      if (res.ok) {
        console.log('n8n notified successfully on attempt', i + 1)
        return
      }
      console.warn('n8n attempt', i + 1, 'failed with status', res.status)
    } catch (err) {
      console.warn('n8n attempt', i + 1, 'error:', err)
    }
    // Wait 1s before retry (except after last attempt)
    if (i < attempts - 1) await new Promise(r => setTimeout(r, 1000))
  }
  console.error('n8n notification failed after', attempts, 'attempts for booking:', payload.contact_name, payload.booking_date)
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

    // Await n8n with retries — booking is saved, notification must go through
    await notifyN8n({ contact_name, email: email || null, booking_date, group_size, adults_count: adults_count || null, kids_count: kids_count || null })

    return NextResponse.json({ success: true, booking: data }, { status: 201 })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('Booking route error:', msg)
    return NextResponse.json({ error: 'Serverfehler: ' + msg }, { status: 500 })
  }
}
