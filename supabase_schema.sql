-- Run this in your Supabase SQL editor (Dashboard → SQL Editor → New Query)

CREATE TABLE canal_cruise_bookings (
  id             uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_date   date        NOT NULL,
  group_size     integer     NOT NULL CHECK (group_size >= 1 AND group_size <= 6),
  contact_name   text        NOT NULL,
  email          text,
  phone          text,
  created_at     timestamptz DEFAULT now()
);

-- Fast availability lookups by date
CREATE INDEX idx_canal_cruise_bookings_date ON canal_cruise_bookings(booking_date);

-- Row Level Security: public read for availability, server-only writes
ALTER TABLE canal_cruise_bookings ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read (needed for availability check via anon key)
CREATE POLICY "Public availability read"
  ON canal_cruise_bookings FOR SELECT
  USING (true);

-- Only service role (server-side API) can insert
CREATE POLICY "Service role insert"
  ON canal_cruise_bookings FOR INSERT
  WITH CHECK (auth.role() = 'service_role');
