import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

const MAX = 6

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get('date')
  const month = req.nextUrl.searchParams.get('month') // YYYY-MM

  const db = supabaseAdmin()

  if (month) {
    const from = `${month}-01`
    const year = parseInt(month.split('-')[0])
    const mon = parseInt(month.split('-')[1])
    const lastDay = new Date(year, mon, 0).getDate()
    const to = `${month}-${String(lastDay).padStart(2, '0')}`

    const { data, error } = await db
      .from('canal_cruise_bookings')
      .select('booking_date, group_size, adults_count, kids_count, is_exclusive')
      .gte('booking_date', from)
      .lte('booking_date', to)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
  }

  if (!date) return NextResponse.json({ error: 'date or month required' }, { status: 400 })

  const { data, error } = await db
    .from('canal_cruise_bookings')
    .select('*')
    .eq('booking_date', date)
    .order('created_at', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  try {
    const { date, adults, kids, name } = await req.json()
    if (!date) return NextResponse.json({ error: 'Datum fehlt' }, { status: 400 })

    const adults_count = Math.max(0, parseInt(adults) || 0)
    const kids_count = Math.max(0, parseInt(kids) || 0)
    const group_size = adults_count + kids_count

    if (group_size < 1) return NextResponse.json({ error: 'Mindestens 1 Person' }, { status: 400 })

    const db = supabaseAdmin()

    const { data: existing } = await db
      .from('canal_cruise_bookings')
      .select('group_size')
      .eq('booking_date', date)

    const alreadyBooked = (existing || []).reduce((s: number, r: { group_size: number }) => s + r.group_size, 0)
    const available = MAX - alreadyBooked

    if (group_size > available) {
      return NextResponse.json({ error: `Nur noch ${available} ${available === 1 ? 'Platz' : 'Plätze'} verfügbar` }, { status: 409 })
    }

    const { data, error } = await db
      .from('canal_cruise_bookings')
      .insert({
        booking_date: date,
        group_size,
        contact_name: name || 'Vor-Ort',
        email: null,
        adults_count,
        kids_count,
        liability_accepted: true,
        is_exclusive: false,
      })
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true, booking: data }, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json()
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  const db = supabaseAdmin()
  const { error } = await db.from('canal_cruise_bookings').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
