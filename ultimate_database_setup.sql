-- ultimate_database_setup.sql
-- WARNING: This will drop your existing tables to ensure a completely fresh and perfect start.
-- Run this in your Supabase SQL Editor.

-- 1. Drop existing tables to start completely fresh
DROP TABLE IF EXISTS public.bookings CASCADE;
DROP TABLE IF EXISTS public.support_stats CASCADE;

-- 2. Create support_stats table
CREATE TABLE public.support_stats (
  id bigint primary key generated always as identity,
  count integer not null default 0,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS and create policies for support_stats
ALTER TABLE public.support_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" 
  ON public.support_stats 
  FOR SELECT 
  USING (true);

-- Function to safely increment the support count
CREATE OR REPLACE FUNCTION public.increment_support_count()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.support_stats
  SET count = count + 1,
      updated_at = timezone('utc'::text, now())
  WHERE id = 1;
END;
$$;

-- Initialize the first row for support_stats
INSERT INTO public.support_stats (id, count)
OVERRIDING SYSTEM VALUE
VALUES (1, 0)
ON CONFLICT (id) DO NOTHING;

-- 3. Create bookings table with ALL required columns
CREATE TABLE public.bookings (
  id bigint primary key generated always as identity,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  customer_name text not null,
  customer_email text,
  contact_phone text not null,
  service_date text not null,
  service_time text not null,
  total_price numeric not null,
  window_count integer not null,
  address text not null,
  city text,
  postal_code text not null,
  property_type text,
  payment_method text,
  mbway_phone text,
  status text not null default 'pending',
  auth_id uuid -- Optional reference if users ever log in
);

-- Enable RLS and create policies for bookings
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public inserts"
  ON public.bookings
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow users to read own bookings"
  ON public.bookings
  FOR SELECT
  USING (auth.uid() = auth_id);

CREATE POLICY "Allow public updates for pending bookings"
  ON public.bookings
  FOR UPDATE
  USING (status = 'pending');

-- 4. Reload the schema cache so the API recognizes the new tables immediately
NOTIFY pgrst, 'reload schema';
