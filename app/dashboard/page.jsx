'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import BookingWidget from '../../components/BookingWidget';

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        window.location.href = '/auth';
        return;
      }
      
      setUser(session.user);

      // Link any existing guest bookings matching this user's email to their account
      try {
        await fetch('/api/link-bookings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: session.user.id, email: session.user.email })
        });
      } catch (err) {
        console.error("Error linking guest bookings:", err);
      }

      // Fetch bookings
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        setBookings(data);
      } else {
        setBookings([]);
      }
      setLoading(false);
    };

    fetchDashboardData();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const d = new Date(dateString);
    return d.toLocaleDateString('pt-PT');
  };

  const getStatusBadge = (status) => {
    status = status || 'pending';
    switch(status) {
      case 'confirmed': return <span className="status-badge status-confirmed">Confirmado</span>;
      case 'completed': return <span className="status-badge status-completed">Concluído</span>;
      case 'cancelled': return <span className="status-badge status-cancelled">Cancelado</span>;
      default: return <span className="status-badge status-pending">Pendente</span>;
    }
  };

  if (loading) {
    return <main style={{ paddingTop: '100px', textAlign: 'center' }}>Carregando painel...</main>;
  }

  return (
    <main style={{ paddingTop: '100px', paddingBottom: '100px', minHeight: '80vh' }} className="bg-alt">
      <div className="container fade-up visible">
        <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1>O Meu Painel</h1>
            <p>Bem-vindo de volta, {user?.user_metadata?.full_name || user?.email}</p>
          </div>
          <button onClick={async () => { await supabase.auth.signOut(); window.location.href = '/'; }} className="btn btn-outline">
            Sair da Conta
          </button>
        </div>

        <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
          <div className="dashboard-card" style={{ background: 'var(--surface)', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '24px', paddingBottom: '12px', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
              Os Meus Agendamentos
            </h2>
            
            <div className="bookings-list">
              {bookings.length === 0 ? (
                <div className="empty-state" style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                  <p>Ainda não tem agendamentos.</p>
                  <a href="/#calculator" className="btn btn-primary" style={{ marginTop: '16px' }}>Fazer Novo Agendamento</a>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {bookings.map(booking => (
                    <div key={booking.id} style={{ border: '1px solid var(--border-color)', borderRadius: '12px', padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Data do Serviço</div>
                        <div style={{ fontWeight: '600' }}>{formatDate(booking.service_date)} às {booking.service_time}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Serviço</div>
                        <div>{booking.service_name || (booking.property_type ? booking.property_type.charAt(0).toUpperCase() + booking.property_type.slice(1) + ` (${booking.window_count} janelas)` : 'Serviço Personalizado')}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Morada</div>
                        <div style={{ fontSize: '0.9rem' }}>{booking.address}, {booking.city}</div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontWeight: '700', color: 'var(--primary)', fontSize: '1.1rem' }}>€{booking.total_price}</div>
                        <div>{getStatusBadge(booking.status)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div style={{ marginTop: '64px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '32px' }}>Novo Agendamento</h2>
          <BookingWidget />
        </div>
      </div>
    </main>
  );
}
