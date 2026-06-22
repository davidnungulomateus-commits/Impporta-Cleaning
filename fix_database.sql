-- Run this in your Supabase SQL Editor to guarantee all columns exist for your bookings table

CREATE TABLE IF NOT EXISTS public.bookings (
  id bigint primary key generated always as identity,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add all the core columns that might be missing
ALTER TABLE public.bookings
ADD COLUMN IF NOT EXISTS customer_name text,
ADD COLUMN IF NOT EXISTS customer_email text,
ADD COLUMN IF NOT EXISTS contact_phone text,
ADD COLUMN IF NOT EXISTS service_date text,
ADD COLUMN IF NOT EXISTS service_time text,
ADD COLUMN IF NOT EXISTS total_price numeric,
ADD COLUMN IF NOT EXISTS window_count integer,
ADD COLUMN IF NOT EXISTS address text,
ADD COLUMN IF NOT EXISTS city text,
ADD COLUMN IF NOT EXISTS postal_code text,
ADD COLUMN IF NOT EXISTS property_type text,
ADD COLUMN IF NOT EXISTS payment_method text,
ADD COLUMN IF NOT EXISTS mbway_phone text,
ADD COLUMN IF NOT EXISTS status text default 'pending';

-- Make sure RLS is enabled and public inserts are allowed
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public inserts" ON public.bookings;
CREATE POLICY "Allow public inserts"
  ON public.bookings
  FOR INSERT
  WITH CHECK (true);

-- Reload the schema cache just in case
NOTIFY pgrst, reload schema;
