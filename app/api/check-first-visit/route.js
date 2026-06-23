import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');

    if (!userId) {
      return NextResponse.json({ isFirstVisit: true });
    }

    // Use service role key if available for server-side queries, otherwise anon key
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check if user has any completed bookings
    const { data, error } = await supabase
      .from('bookings')
      .select('id')
      .eq('user_id', userId)
      .eq('status', 'completed')
      .limit(1);

    if (error) {
      console.error('Error checking first visit:', error);
      return NextResponse.json({ isFirstVisit: true }); // Default to first visit on error
    }

    return NextResponse.json({
      isFirstVisit: !data || data.length === 0
    });
  } catch (error) {
    console.error('Error in check-first-visit:', error);
    return NextResponse.json({ isFirstVisit: true }, { status: 500 });
  }
}
