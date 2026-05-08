import { createClient } from '@supabase/supabase-js'

export function supabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export function supabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export type Booking = {
  id: string
  booking_date: string
  group_size: number
  contact_name: string
  email: string | null
  phone: string | null
  created_at: string
}
