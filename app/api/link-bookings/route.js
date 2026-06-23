import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request) {
  try {
    const { userId, email } = await request.json();

    if (!userId || !email) {
      return NextResponse.json({ success: false, error: 'Missing userId or email' }, { status: 400 });
    }

    // Use service role key if available to bypass RLS for this system operation
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Link all bookings with matching email that don't have a user_id yet
    const { error } = await supabase
      .from('bookings')
      .update({ user_id: userId })
      .eq('customer_email', email)
      .is('user_id', null);

    if (error) {
      console.error('Error linking bookings:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in link-bookings API:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
