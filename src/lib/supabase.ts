import { createClient } from '@supabase/supabase-js'

const SB_URL = 'https://vtrpbvjckliwyuccbhvm.supabase.co'
const SB_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0cnBidmpja2xpd3l1Y2NiaHZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2ODM3MjUsImV4cCI6MjA4OTI1OTcyNX0.yvyUfF5q2G1yabH6NFG8Tk5DqVH-wCJpct4iTzF90Fg'
const SB_SERVICE = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0cnBidmpja2xpd3l1Y2NiaHZtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzY4MzcyNSwiZXhwIjoyMDg5MjU5NzI1fQ.CksMt8WrbDlM8kluS0roRcsCw5zF7uccoy0yHaM8KLk'

export function supabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || SB_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || SB_ANON
  )
}

export function supabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || SB_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || SB_SERVICE
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
