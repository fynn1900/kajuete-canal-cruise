import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    const db = supabaseAdmin()
    const { data, error } = await db
      .from('blocked_dates')
      .select('*')
      .order('blocked_date', { ascending: true })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { date, reason } = await req.json()
    if (!date) return NextResponse.json({ error: 'Datum fehlt' }, { status: 400 })
    const db = supabaseAdmin()
    const { data, error } = await db
      .from('blocked_dates')
      .insert({ blocked_date: date, reason: reason || null })
      .select()
      .single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json()
    if (!id) return NextResponse.json({ error: 'ID fehlt' }, { status: 400 })
    const db = supabaseAdmin()
    const { error } = await db.from('blocked_dates').delete().eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
