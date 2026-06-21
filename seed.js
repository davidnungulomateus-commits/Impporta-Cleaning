const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://ebwqunnqjwofqtqwbkkq.supabase.co';
const supabaseAnonKey = 'sb_publishable_QGW7-ptfJFGcKxF12vvs8w_SCNQa0G6';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function seedBookings() {
  const today = new Date();
  const formatYMD = (date) => date.toISOString().split('T')[0];

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const dayAfter = new Date(today);
  dayAfter.setDate(dayAfter.getDate() + 2);

  const dummyData = [
    {
      customer_name: "João Silva",
      email: "joao.silva@example.com",
      customer_phone: "912345678",
      street_address: "Rua Augusta 123",
      postal_code: "1100-048",
      window_count: 6,
      booking_date: formatYMD(today),
      time_slot: "10:00",
      total_price: 45.00,
      payment_method: "MBWay",
      status: "confirmed"
    },
    {
      customer_name: "Maria Santos",
      email: "maria.santos@example.com",
      customer_phone: "934567890",
      street_address: "Avenida da Boavista 456",
      postal_code: "4100-123",
      window_count: 12,
      booking_date: formatYMD(today),
      time_slot: "14:30",
      total_price: 90.00,
      payment_method: "Cartão",
      status: "confirmed"
    },
    {
      customer_name: "Carlos Ferreira",
      email: "carlos.f@example.com",
      customer_phone: "967890123",
      street_address: "Rua do Comércio 78",
      postal_code: "8000-000",
      window_count: 4,
      booking_date: formatYMD(tomorrow),
      time_slot: "09:00",
      total_price: 30.00,
      payment_method: "Numerário",
      status: "pending"
    },
    {
      customer_name: "Ana Oliveira",
      email: "ana.oliveira@example.com",
      customer_phone: "921234567",
      street_address: "Largo do Chiado 9",
      postal_code: "1200-108",
      window_count: 8,
      booking_date: formatYMD(dayAfter),
      time_slot: "16:00",
      total_price: 60.00,
      payment_method: "MBWay",
      status: "confirmed"
    }
  ];

  console.log("Seeding dummy bookings to Supabase...");
  const { data, error } = await supabase.from('bookings').insert(dummyData).select();
  if (error) {
    console.error("Error inserting data:", error);
  } else {
    console.log("Successfully inserted dummy data!", data.length, "records added.");
  }
}

seedBookings();
