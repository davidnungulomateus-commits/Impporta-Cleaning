const supabaseUrl = 'https://ebwqunnqjwofqtqwbkkq.supabase.co';
const supabaseAnonKey = 'sb_publishable_QGW7-ptfJFGcKxF12vvs8w_SCNQa0G6';

async function fetchColumns() {
  const res = await fetch(`${supabaseUrl}/rest/v1/bookings`, {
    method: 'OPTIONS',
    headers: {
      'apikey': supabaseAnonKey
    }
  });
  
  // The OPTIONS request to PostgREST returns OpenAPI definition for the table in the response body or swagger.
  // Actually, PostgREST OPTIONS returns nothing in body, but headers tell us allowed methods.
  // We can query a single row as JSON to get the keys. If empty, we can force an error on a dummy column.
  
  console.log("Checking columns by fetching a row...");
  
  const { createClient } = require('@supabase/supabase-js');
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  
  const { data, error } = await supabase.from('bookings').select('*').limit(1);
  if (error) {
    console.log("Select error:", error);
  } else if (data && data.length > 0) {
    console.log("Columns from data:", Object.keys(data[0]));
  } else {
    console.log("No data found. Checking Supabase SQL query if possible.");
    
    // We can't easily get columns if empty and no admin key. Let's just try to insert an empty object.
    const { error } = await supabase.from('bookings').insert([{}]).select();
    console.log("Insert empty error:", error);
  }
}
fetchColumns();
