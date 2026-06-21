-- supabase_schema.sql
-- Run this in your Supabase SQL Editor to set up the support counter database structure.

-- Create table to store support stats
create table if not exists public.support_stats (
  id bigint primary key generated always as identity,
  count integer not null default 0,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.support_stats enable row level security;

-- Create policy to allow public read access
create policy "Allow public read access" 
  on public.support_stats 
  for select 
  using (true);

-- Create function to safely increment the support count
create or replace function public.increment_support_count()
returns void
language plpgsql
security definer
as $$
begin
  update public.support_stats
  set count = count + 1,
      updated_at = timezone('utc'::text, now())
  where id = 1;
end;
$$;

-- Initialize the first row if it does not exist
insert into public.support_stats (id, count)
values (1, 0)
on conflict (id) do nothing;

-- Create table to store bookings
create table if not exists public.bookings (
  id bigint primary key generated always as identity,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  window_count integer not null,
  total_price numeric not null,
  booking_date date not null,
  time_slot text not null,
  customer_name text not null,
  email text,
  auth_id uuid, -- Reference to auth.users if logged in
  customer_phone text not null,
  street_address text not null,
  postal_code text not null,
  apartment_suite text,
  payment_method text, -- Nullable because it is chosen after draft creation
  status text not null default 'pending'
);

-- Enable RLS for bookings table
alter table public.bookings enable row level security;

-- Create policy to allow public inserts (for client-side bookings creation)
create policy "Allow public inserts"
  on public.bookings
  for insert
  with check (true);

-- Create policy to allow users to read their own bookings
create policy "Allow users to read own bookings"
  on public.bookings
  for select
  using (auth.uid() = auth_id);

-- Create policy to allow public updates to complete payment (simplified for now)
create policy "Allow public updates for pending bookings"
  on public.bookings
  for update
  using (status = 'pending');

