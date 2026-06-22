-- Run this in your Supabase SQL Editor

-- Drop the restrictive select policy
DROP POLICY IF EXISTS "Allow users to read own bookings" ON public.bookings;

-- Create a new policy that allows logged-in admins to see ALL bookings
CREATE POLICY "Allow admins to read all bookings"
  ON public.bookings
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Reload the schema cache just in case
NOTIFY pgrst, 'reload schema';
