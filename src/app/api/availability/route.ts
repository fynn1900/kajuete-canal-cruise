import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

const MAX_CAPACITY = 6

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get('date')

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: 'Invalid date' }, { status: 400 })
  }

  const db = supabaseAdmin()
  const { data, error } = await db
    .from('canal_cruise_bookings')
    .select('group_size')
    .eq('booking_date', date)

  if (error) {
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }

  const booked = (data || []).reduce((sum, row) => sum + row.group_size, 0)
  const available = Math.max(0, MAX_CAPACITY - booked)

  return NextResponse.json({ booked, available, capacity: MAX_CAPACITY })
}
