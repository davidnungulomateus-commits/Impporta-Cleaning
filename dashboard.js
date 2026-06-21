// Initialize Supabase Client
const supabaseUrl = 'https://ebwqunnqjwofqtqwbkkq.supabase.co'; // Replace with your actual URL
const supabaseAnonKey = 'sb_publishable_QGW7-ptfJFGcKxF12vvs8w_SCNQa0G6'; // Replace with your actual Anon Key
let supabaseClient = null;

try {
  if (window.supabase) {
    supabaseClient = window.supabase.createClient(supabaseUrl, supabaseAnonKey);
  }
} catch (e) {
  console.error('Supabase init failed:', e);
}

document.addEventListener("DOMContentLoaded", async () => {
  if (!supabaseClient) return;

  // Verify Session
  const { data: { user } } = await supabaseClient.auth.getUser();
  if (!user) {
    window.location.href = './auth.html';
    return;
  }

  // Set User Name
  const userNameEl = document.getElementById('user-name');
  if (user.user_metadata && user.user_metadata.full_name) {
    userNameEl.textContent = user.user_metadata.full_name.split(' ')[0];
  } else {
    userNameEl.textContent = user.email.split('@')[0];
  }

  // Logout Handler
  document.getElementById('logout-btn').addEventListener('click', async () => {
    await supabaseClient.auth.signOut();
    window.location.href = './index.html';
  });

  // Fetch Bookings
  await fetchBookings(user.id);
});

async function fetchBookings(userId) {
  const upcomingContainer = document.getElementById('upcoming-bookings');
  const pastContainer = document.getElementById('past-bookings');

  upcomingContainer.innerHTML = '<p class="text-muted">A carregar...</p>';
  pastContainer.innerHTML = '<p class="text-muted">A carregar...</p>';

  try {
    const { data: bookings, error } = await supabaseClient
      .from('bookings')
      .select('*')
      .eq('auth_id', userId)
      .order('booking_date', { ascending: false });

    if (error) throw error;

    upcomingContainer.innerHTML = '';
    pastContainer.innerHTML = '';

    const now = new Date();
    // Normalize "now" to start of day for comparison
    now.setHours(0, 0, 0, 0);

    const upcoming = [];
    const past = [];

    (bookings || []).forEach(booking => {
      // Assuming booking_date is YYYY-MM-DD
      const bDate = new Date(booking.booking_date);
      // Adjust timezone issue
      bDate.setMinutes(bDate.getMinutes() + bDate.getTimezoneOffset());
      
      if (bDate >= now) {
        upcoming.push(booking);
      } else {
        past.push(booking);
      }
    });

    // Sort upcoming ascending (soonest first)
    upcoming.sort((a, b) => new Date(a.booking_date) - new Date(b.booking_date));

    renderBookings(upcoming, upcomingContainer, "Ainda não tem limpezas agendadas para o futuro.");
    renderBookings(past, pastContainer, "Não tem histórico de limpezas.");

  } catch (err) {
    console.error('Error fetching bookings:', err);
    upcomingContainer.innerHTML = '<p class="text-muted">Erro ao carregar agendamentos.</p>';
    pastContainer.innerHTML = '<p class="text-muted">Erro ao carregar agendamentos.</p>';
  }
}

function renderBookings(bookings, container, emptyMessage) {
  if (bookings.length === 0) {
    container.innerHTML = `<div class="empty-state">${emptyMessage}</div>`;
    return;
  }

  bookings.forEach(booking => {
    const card = document.createElement('div');
    card.className = 'booking-card';

    // Format date beautifully
    const d = new Date(booking.booking_date);
    d.setMinutes(d.getMinutes() + d.getTimezoneOffset());
    const dateStr = d.toLocaleDateString('pt-PT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    const capitalizedDate = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);

    // Default status if not present
    let statusText = 'Pendente';
    let statusClass = 'status-pending';
    let statusIcon = '<circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>';
    
    if (booking.status === 'confirmed') {
      statusText = 'Confirmado';
      statusClass = 'status-confirmed';
      statusIcon = '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>';
    } else if (booking.status === 'completed') {
      statusText = 'Concluído';
      statusClass = 'status-completed';
      statusIcon = '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>';
    }

    card.innerHTML = `
      <div class="booking-date-badge">${capitalizedDate}</div>
      
      <div class="booking-detail">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
        <span>${booking.booking_time}</span>
      </div>
      
      <div class="booking-detail">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
        <span>€${booking.price.toFixed(2)} (${booking.frequency})</span>
      </div>
      
      <div class="booking-detail">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
        <span>${booking.address || 'Morada não especificada'}</span>
      </div>

      <div class="booking-status ${statusClass}">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          ${statusIcon}
        </svg>
        ${statusText}
      </div>
    `;

    container.appendChild(card);
  });
}
