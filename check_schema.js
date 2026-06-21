const supabaseUrl = 'https://ebwqunnqjwofqtqwbkkq.supabase.co';
const supabaseAnonKey = 'sb_publishable_QGW7-ptfJFGcKxF12vvs8w_SCNQa0G6';

async function check() {
  const res = await fetch(`${supabaseUrl}/rest/v1/?apikey=${supabaseAnonKey}`);
  const spec = await res.json();
  const bookings = spec.definitions.bookings;
  console.log("Bookings columns:");
  console.log(Object.keys(bookings.properties));
}
check();
