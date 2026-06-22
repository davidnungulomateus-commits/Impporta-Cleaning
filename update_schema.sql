-- Run this in the Supabase SQL Editor to ensure all required columns exist for the Admin Calendar

ALTER TABLE public.bookings
ADD COLUMN IF NOT EXISTS service_date text,
ADD COLUMN IF NOT EXISTS service_time text,
ADD COLUMN IF NOT EXISTS address text,
ADD COLUMN IF NOT EXISTS city text,
ADD COLUMN IF NOT EXISTS postal_code text,
ADD COLUMN IF NOT EXISTS property_type text,
ADD COLUMN IF NOT EXISTS contact_phone text,
ADD COLUMN IF NOT EXISTS customer_email text,
ADD COLUMN IF NOT EXISTS mbway_phone text;

-- In case there are old columns you want to map, you can keep them. 
-- The above columns will ensure your new Drag & Drop and Appointment Creation works perfectly.
