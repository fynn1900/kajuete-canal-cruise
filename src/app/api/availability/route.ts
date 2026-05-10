import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

const MAX_CAPACITY = 6

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get('date')

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: 'Invalid date' }, { status: 400 })
  }

  const db = supabaseAdmin()

  const bookingsRes = await db
    .from('canal_cruise_bookings')
    .select('group_size')
    .eq('booking_date', date)

  if (bookingsRes.error) {
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }

  // blocked_dates is optional — ignore if table doesn't exist yet
  const blockedRes = await db
    .from('blocked_dates')
    .select('id')
    .eq('blocked_date', date)
    .maybeSingle()

  if (!blockedRes.error && blockedRes.data) {
    return NextResponse.json({ booked: MAX_CAPACITY, available: 0, blocked: true, capacity: MAX_CAPACITY })
  }

  const booked = (bookingsRes.data || []).reduce((sum, row) => sum + row.group_size, 0)
  const available = Math.max(0, MAX_CAPACITY - booked)

  return NextResponse.json({ booked, available, blocked: false, capacity: MAX_CAPACITY })
}
