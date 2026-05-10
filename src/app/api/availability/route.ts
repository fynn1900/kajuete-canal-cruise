import { NextRequest, NextResponse } from 'next/server'
import { supabase, supabaseAdmin } from '@/lib/supabase'

const MAX_CAPACITY = 6

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get('date')

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: 'Invalid date' }, { status: 400 })
  }

  // Use anon key for public reads — no service role needed
  const db = supabase()

  const [bookingsRes, blockedRes] = await Promise.all([
    db.from('canal_cruise_bookings').select('group_size').eq('booking_date', date),
    db.from('blocked_dates').select('id').eq('blocked_date', date).maybeSingle(),
  ])

  if (bookingsRes.error) {
    console.error('bookings error:', bookingsRes.error)
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }

  if (!blockedRes.error && blockedRes.data) {
    return NextResponse.json({ booked: MAX_CAPACITY, available: 0, blocked: true, capacity: MAX_CAPACITY })
  }

  const booked = (bookingsRes.data || []).reduce((sum, row) => sum + row.group_size, 0)
  const available = Math.max(0, MAX_CAPACITY - booked)

  return NextResponse.json({ booked, available, blocked: false, capacity: MAX_CAPACITY })
}
