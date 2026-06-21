const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://ebwqunnqjwofqtqwbkkq.supabase.co';
const supabaseAnonKey = 'sb_publishable_QGW7-ptfJFGcKxF12vvs8w_SCNQa0G6';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function inspect() {
  const { data, error } = await supabase.from('bookings').select('*').limit(1);
  if (error) console.error("Error:", error);
  else if (data.length === 0) {
    // If empty, we can still get the columns by forcing an error or using options
    // Let's insert a dummy row with just an ID to see the error or just read from the table definition
    const { data: cols, error: err } = await supabase.rpc('get_columns'); // might not exist
    console.log("No data found, but request succeeded. Let's try to insert a generic row to see what fails.");
  } else {
    console.log("Columns:", Object.keys(data[0]));
  }
}
inspect();
