import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

const MAX_CAPACITY = 6

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { booking_date, group_size, contact_name, email, phone } = body

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

  if (fetchError) {
    return NextResponse.json({ error: 'Datenbankfehler' }, { status: 500 })
  }

  const alreadyBooked = (existing || []).reduce((sum, row) => sum + row.group_size, 0)
  const available = MAX_CAPACITY - alreadyBooked

  if (group_size > available) {
    return NextResponse.json(
      { error: `Nur noch ${available} Plätze verfügbar` },
      { status: 409 }
    )
  }

  const { data, error: insertError } = await db
    .from('canal_cruise_bookings')
    .insert({ booking_date, group_size, contact_name, email: email || null, phone: phone || null })
    .select()
    .single()

  if (insertError) {
    return NextResponse.json({ error: 'Buchung fehlgeschlagen' }, { status: 500 })
  }

  return NextResponse.json({ success: true, booking: data }, { status: 201 })
}
