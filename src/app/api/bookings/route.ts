import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { Resend } from 'resend'

const MAX_CAPACITY = 6

function formatDE(dateStr: string) {
  const [y, m, d] = dateStr.split('-')
  return `${d}.${m}.${y}`
}

async function sendNotification(booking: {
  contact_name: string
  email: string | null
  booking_date: string
  group_size: number
  adults_count: number | null
  kids_count: number | null
}) {
  if (!process.env.RESEND_API_KEY) return
  const resend = new Resend(process.env.RESEND_API_KEY)
  const to = process.env.ADMIN_EMAIL || 'fynn@optriq-automations.org'
  const adults = booking.adults_count ?? '–'
  const kids = booking.kids_count ?? '–'
  await resend.emails.send({
    from: 'Kajüte Booking <onboarding@resend.dev>',
    to,
    subject: `⚓ Neue Buchung – ${formatDE(booking.booking_date)}`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;padding:24px;background:#0A1628;color:#F5EDD8;border-radius:12px;">
        <h2 style="color:#D4A843;margin-top:0">Neue Buchung eingegangen</h2>
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:6px 0;color:#aaa">Name</td><td style="padding:6px 0;font-weight:600">${booking.contact_name}</td></tr>
          <tr><td style="padding:6px 0;color:#aaa">E-Mail</td><td style="padding:6px 0">${booking.email || '–'}</td></tr>
          <tr><td style="padding:6px 0;color:#aaa">Datum</td><td style="padding:6px 0;font-weight:600">${formatDE(booking.booking_date)} · 19:00 Uhr</td></tr>
          <tr><td style="padding:6px 0;color:#aaa">Personen</td><td style="padding:6px 0">${booking.group_size} gesamt (${adults} Erw. · ${kids} Kids)</td></tr>
        </table>
        <p style="margin-top:16px;color:#888;font-size:12px">Kajüte Daily Canal Cruise · Friedrichstadt</p>
      </div>
    `,
  })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { booking_date, group_size, contact_name, email, adults_count, kids_count } = body

  if (!booking_date || !group_size || !contact_name) {
    return NextResponse.json({ error: 'Fehlende Pflichtfelder' }, { status: 400 })
  }
  if (group_size < 1 || group_size > MAX_CAPACITY) {
    return NextResponse.json({ error: 'Ungültige Gruppengröße' }, { status: 400 })
  }

  const db = supabaseAdmin()

  // Check capacity
  const { data: existing, error: fetchError } = await db
    .from('canal_cruise_bookings')
    .select('group_size')
    .eq('booking_date', booking_date)

  if (fetchError) return NextResponse.json({ error: 'Datenbankfehler' }, { status: 500 })

  const alreadyBooked = (existing || []).reduce((s, r) => s + r.group_size, 0)
  if (group_size > MAX_CAPACITY - alreadyBooked) {
    return NextResponse.json({ error: `Nur noch ${MAX_CAPACITY - alreadyBooked} Plätze verfügbar` }, { status: 409 })
  }

  // Check blocked
  const { data: blocked } = await db
    .from('blocked_dates')
    .select('id')
    .eq('blocked_date', booking_date)
    .maybeSingle()
  if (blocked) return NextResponse.json({ error: 'Dieser Tag ist gesperrt' }, { status: 409 })

  const { data, error: insertError } = await db
    .from('canal_cruise_bookings')
    .insert({ booking_date, group_size, contact_name, email: email || null, adults_count: adults_count || null, kids_count: kids_count || null })
    .select()
    .single()

  if (insertError) return NextResponse.json({ error: 'Buchung fehlgeschlagen' }, { status: 500 })

  // Send email (fire & forget — don't block response)
  sendNotification({ contact_name, email, booking_date, group_size, adults_count, kids_count }).catch(console.error)

  return NextResponse.json({ success: true, booking: data }, { status: 201 })
}
