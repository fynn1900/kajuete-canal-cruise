import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get('date')
  const month = req.nextUrl.searchParams.get('month') // YYYY-MM

  const db = supabaseAdmin()

  if (month) {
    // Return all bookings for the month
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

export async function DELETE(req: NextRequest) {
  const { id } = await req.json()
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  const db = supabaseAdmin()
  const { error } = await db.from('canal_cruise_bookings').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
