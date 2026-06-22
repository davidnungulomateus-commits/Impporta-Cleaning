'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import Link from 'next/link';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import AdminCheckoutForm from '../../components/AdminCheckoutForm';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function AdminCalendarPage() {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newBookingData, setNewBookingData] = useState({});
  const [draggedBooking, setDraggedBooking] = useState(null);

  // Payment states
  const [paymentAction, setPaymentAction] = useState(null);
  const [adminClientSecret, setAdminClientSecret] = useState('');
  const [adminPaymentLink, setAdminPaymentLink] = useState('');
  const [isGeneratingPayment, setIsGeneratingPayment] = useState(false);

  useEffect(() => {
    const fetchAdminData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      // If not logged in or not admin email, redirect
      if (!session || session.user.email !== 'david.nungulo.mateus@gmail.com') {
        window.location.href = '/';
        return;
      }
      
      setUser(session.user);

      // Fetch all bookings
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('service_date', { ascending: true })
        .order('service_time', { ascending: true });

      if (!error && data && data.length > 0) {
        setBookings(data);
      } else {
        // Fallback to dummy data if database is empty so we can see the UI
        const today = new Date();
        const formatYMD = (date) => date.toISOString().split('T')[0];
        const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);
        const dayAfter = new Date(today); dayAfter.setDate(dayAfter.getDate() + 2);
        
        setBookings([
          {
            id: 1,
            customer_name: "João Silva",
            customer_email: "joao.silva@example.com",
            contact_phone: "912345678",
            address: "Rua Augusta 123",
            postal_code: "1100-048",
            city: "Lisboa",
            property_type: "apartamento",
            window_count: 6,
            service_date: formatYMD(today),
            service_time: "10:00",
            total_price: 45.00,
            payment_method: "MBWay",
            status: "confirmed"
          },
          {
            id: 2,
            customer_name: "Maria Santos",
            customer_email: "maria.santos@example.com",
            contact_phone: "934567890",
            address: "Avenida da Boavista 456",
            postal_code: "4100-123",
            city: "Porto",
            property_type: "moradia",
            window_count: 12,
            service_date: formatYMD(today),
            service_time: "14:30",
            total_price: 90.00,
            payment_method: "Cartão",
            status: "confirmed"
          },
          {
            id: 3,
            customer_name: "Carlos Ferreira",
            customer_email: "carlos.f@example.com",
            contact_phone: "967890123",
            address: "Rua do Comércio 78",
            postal_code: "8000-000",
            city: "Faro",
            property_type: "apartamento",
            window_count: 4,
            service_date: formatYMD(tomorrow),
            service_time: "09:00",
            total_price: 30.00,
            payment_method: "Numerário",
            status: "pending"
          },
          {
            id: 4,
            customer_name: "Ana Oliveira",
            customer_email: "ana.oliveira@example.com",
            contact_phone: "921234567",
            address: "Largo do Chiado 9",
            postal_code: "1200-108",
            city: "Lisboa",
            property_type: "escritorio",
            window_count: 8,
            service_date: formatYMD(dayAfter),
            service_time: "16:00",
            total_price: 60.00,
            payment_method: "MBWay",
            status: "confirmed"
          }
        ]);
      }
      setLoading(false);
    };

    fetchAdminData();
  }, []);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: days }, (_, i) => new Date(year, month, i + 1));
  };

  const isSameDay = (date1, date2) => {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  };

  // Filter bookings for the currently selected day
  const dailyBookings = bookings.filter(b => {
    if (!b.service_date || b.status === 'cancelled') return false;
    const bDate = new Date(b.service_date);
    return isSameDay(bDate, currentDate);
  });

  const cancelledBookings = bookings.filter(b => b.status === 'cancelled');

  const handleCancelBooking = async (id) => {
    const { error } = await supabase.from('bookings').update({ status: 'cancelled' }).eq('id', id);
    if (!error) {
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'cancelled' } : b));
      if (selectedBooking && selectedBooking.id === id) {
        setSelectedBooking(prev => ({ ...prev, status: 'cancelled' }));
      }
    }
  };

  const handleRestoreBooking = async (id) => {
    const { error } = await supabase.from('bookings').update({ status: 'pending' }).eq('id', id);
    if (!error) {
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'pending' } : b));
      if (selectedBooking && selectedBooking.id === id) {
        setSelectedBooking(prev => ({ ...prev, status: 'pending' }));
      }
    }
  };

  const handleUpdateBooking = async (id, field, value) => {
    const { error } = await supabase.from('bookings').update({ [field]: value }).eq('id', id);
    if (!error) {
      setBookings(prev => prev.map(b => b.id === id ? { ...b, [field]: value } : b));
      if (selectedBooking && selectedBooking.id === id) {
        setSelectedBooking(prev => ({ ...prev, [field]: value }));
      }
    }
  };

  const handleGeneratePayment = async (type) => {
    setIsGeneratingPayment(true);
    setPaymentAction(type);
    setAdminClientSecret('');
    setAdminPaymentLink('');

    try {
      const response = await fetch('/api/admin-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: type === 'mbway' ? 'create_intent' : 'generate_link',
          amount: selectedBooking.total_price,
          booking_id: selectedBooking.id,
          name: selectedBooking.customer_name,
          email: selectedBooking.customer_email,
          phone: selectedBooking.contact_phone
        })
      });
      const data = await response.json();
      
      if (type === 'mbway') {
        setAdminClientSecret(data.clientSecret);
      } else {
        setAdminPaymentLink(data.url);
      }
    } catch (err) {
      console.error("Payment error:", err);
      alert("Erro ao gerar pagamento.");
      setPaymentAction(null);
    }
    setIsGeneratingPayment(false);
  };

  const handleDayClick = (date) => {
    setCurrentDate(date);
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleWhatsApp = (booking) => {
    if (!booking) return;
    const phone = booking.contact_phone ? booking.contact_phone.replace(/\D/g, '') : '';
    const message = encodeURIComponent(`Olá ${booking.customer_name}, sou da Impporta Limpezas. Estou a contactar sobre o seu agendamento para o dia ${new Date(booking.service_date).toLocaleDateString('pt-PT')}.`);
    const link = `https://wa.me/351${phone}?text=${message}`;
    window.open(link, '_blank');
  };

  if (loading) {
    return <main className="admin-loading">A carregar Painel Admin...</main>;
  }

  const daysInMonth = getDaysInMonth(currentDate);
  const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

  // Define hours for the timeline (e.g. 5h to 22h)
  const hours = Array.from({ length: 18 }, (_, i) => i + 5);

  return (
    <main className="admin-wrapper bg-alt">
      <style dangerouslySetInnerHTML={{ __html: `
        .navbar, footer { display: none !important; }
        body { margin: 0; padding: 0; }
      `}} />
      
      {/* Top Navbar for Admin */}
      <nav className="admin-navbar">
        <div className="admin-logo">
          <Link href="/"><img src="/logo.svg" alt="Impporta" style={{ height: '32px' }} /></Link>
          <span className="admin-badge">Admin Workspace</span>
        </div>
        <div className="admin-nav-actions">
          <span className="admin-user">{user?.email}</span>
          <Link href="/dashboard" className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>Voltar ao Dashboard</Link>
        </div>
      </nav>

      <div className="admin-container">
        
        {/* Left Sidebar */}
        <aside className="admin-sidebar">
          {/* Mini Calendar */}
          <div className="admin-widget mini-calendar-widget">
            <div className="widget-header">
              <h3>{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h3>
              <div className="widget-nav">
                <button onClick={handlePrevMonth}>&lt;</button>
                <button onClick={handleNextMonth}>&gt;</button>
              </div>
            </div>
            <div className="mini-calendar-grid">
              <div className="mc-day-name">D</div><div className="mc-day-name">S</div><div className="mc-day-name">T</div>
              <div className="mc-day-name">Q</div><div className="mc-day-name">Q</div><div className="mc-day-name">S</div><div className="mc-day-name">S</div>
              
              {/* Padding for first day of month */}
              {Array.from({ length: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay() }).map((_, i) => (
                <div key={`pad-${i}`} className="mc-day empty"></div>
              ))}
              
              {/* Days */}
              {daysInMonth.map(date => {
                const isSelected = isSameDay(date, currentDate);
                const hasBooking = bookings.some(b => b.service_date && isSameDay(new Date(b.service_date), date));
                
                return (
                  <button 
                    key={date.toISOString()} 
                    className={`mc-day ${isSelected ? 'selected' : ''} ${hasBooking ? 'has-event' : ''}`}
                    onClick={() => handleDayClick(date)}
                  >
                    {date.getDate()}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Today Summary */}
          <div className="admin-widget summary-widget">
            <h3>Meu Calendário</h3>
            <p className="summary-date">{currentDate.toLocaleDateString('pt-PT', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
            <div className="summary-stats">
              <div className="stat-pill">
                <span className="stat-num">{dailyBookings.length}</span>
                <span className="stat-desc">Limpezas Hoje</span>
              </div>
            </div>
            <ul className="summary-list">
              {dailyBookings.map(b => (
                <li key={`sum-${b.id}`} onClick={() => setSelectedBooking(b)}>
                  <div className="sum-time">{b.service_time}</div>
                  <div className="sum-details">
                    <span className="sum-name">{b.customer_name}</span>
                    <span className="sum-loc">{b.city}</span>
                  </div>
                </li>
              ))}
              {dailyBookings.length === 0 && <li className="empty-li">Sem agendamentos.</li>}
            </ul>
          </div>

          {/* Cancelled Bookings Widget */}
          <div className="admin-widget summary-widget" style={{ marginTop: '24px' }}>
            <h3 style={{ color: '#ef4444' }}>Agendamentos Cancelados</h3>
            <ul className="summary-list">
              {cancelledBookings.map(b => (
                <li key={`canc-${b.id}`} onClick={() => setSelectedBooking(b)}>
                  <div className="sum-time">{new Date(b.service_date).toLocaleDateString('pt-PT')}</div>
                  <div className="sum-details">
                    <span className="sum-name" style={{ color: '#ef4444', textDecoration: 'line-through' }}>{b.customer_name}</span>
                    <span className="sum-loc">{b.city}</span>
                  </div>
                </li>
              ))}
              {cancelledBookings.length === 0 && <li className="empty-li">Nenhum cancelamento.</li>}
            </ul>
          </div>
        </aside>

        {/* Main Timeline View */}
        <section className="admin-main">
          <div className="timeline-header">
            <h2>{currentDate.toLocaleDateString('pt-PT', { day: 'numeric', month: 'long', year: 'numeric' })}</h2>
            <div className="timeline-view-toggles">
              <button className="view-toggle active">Dia</button>
            </div>
          </div>

          <div className="timeline-board">
            <div className="timeline-grid">
              {/* Hour Lines */}
              <div className="hour-column">
                {hours.map(hour => (
                  <div key={`hc-${hour}`} className="hour-label">
                    {hour.toString().padStart(2, '0')}:00
                  </div>
                ))}
              </div>
              
              <div 
                className="events-column"
                onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; }}
                onDrop={async (e) => {
                  e.preventDefault();
                  if (!draggedBooking) return;
                  
                  const rect = e.currentTarget.getBoundingClientRect();
                  const y = e.clientY - rect.top;
                  
                  // 80px per hour, 20px per 15 mins
                  const slots = Math.floor(y / 20);
                  const hoursToAdd = Math.floor(slots / 4);
                  const minutesToAdd = (slots % 4) * 15;
                  
                  const droppedHour = Math.max(5, Math.min(22, 5 + hoursToAdd));
                  const newTime = `${droppedHour.toString().padStart(2, '0')}:${minutesToAdd.toString().padStart(2, '0')}`;
                  
                  if (draggedBooking.service_time !== newTime) {
                    setBookings(prev => prev.map(b => b.id === draggedBooking.id ? { ...b, service_time: newTime } : b));
                    const { error } = await supabase.from('bookings').update({ service_time: newTime }).eq('id', draggedBooking.id);
                    if (error) console.error("Error updating time:", error);
                  }
                  setDraggedBooking(null);
                }}
              >
                {hours.map(hour => (
                  <div 
                    key={`bg-${hour}`} 
                    className="hour-grid-line"
                    onClick={() => {
                      setNewBookingData({ service_date: currentDate.toISOString().split('T')[0], service_time: `${hour.toString().padStart(2, '0')}:00`, payment_method: 'multibanco' });
                      setIsCreating(true);
                    }}
                    style={{ cursor: 'pointer' }}
                    title={`Criar agendamento às ${hour}h`}
                  ></div>
                ))}

                {/* Event Blocks */}
                {dailyBookings.map((booking, idx) => {
                  // Calculate position based on service_time (e.g. "14:00")
                  const [bHour, bMin] = (booking.service_time || "09:00").split(':').map(Number);
                  const startHour = Math.max(5, bHour); // Clamp to 5am
                  const topPercentage = ((startHour - 5) + (bMin / 60)) * 80; // 80px per hour
                  
                  // Duration logic: assume 30 mins base + window_count * 2 mins
                  const durationMins = 30 + (booking.window_count || 4) * 2; 
                  const heightPx = (durationMins / 60) * 80;

                  // Cycle colors for aesthetics
                  const colors = ['#E0E7FF', '#FEF08A', '#D1FAE5', '#FCE7F3'];
                  const borderColors = ['#818CF8', '#FACC15', '#34D399', '#F472B6'];
                  const colorIdx = idx % colors.length;

                  return (
                    <div 
                      key={`ev-${booking.id}`} 
                      className={`event-block shadow-sm ${draggedBooking?.id === booking.id ? 'dragging' : ''}`}
                      draggable
                      onDragStart={(e) => {
                        setDraggedBooking(booking);
                        e.dataTransfer.effectAllowed = 'move';
                      }}
                      onDragEnd={() => setDraggedBooking(null)}
                      style={{ 
                        top: `${topPercentage}px`, 
                        height: `${heightPx}px`, 
                        minHeight: '45px',
                        backgroundColor: colors[colorIdx],
                        borderLeft: `4px solid ${borderColors[colorIdx]}`,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        overflow: 'hidden'
                      }}
                      onClick={() => setSelectedBooking(booking)}
                    >
                      <div style={{ flexShrink: 0 }}>
                        <div className="event-title">{booking.customer_name}</div>
                        <div className="event-time" style={{ fontSize: '0.75rem', opacity: 0.8 }}>{booking.time_slot || booking.service_time} ({durationMins} min)</div>
                      </div>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 'auto', flexShrink: 0 }}>
                        <div className="event-meta" style={{ fontSize: '0.7rem' }}>📍 {booking.postal_code || booking.city}</div>
                        
                        {/* Payment Method Badge */}
                        <div style={{ 
                          fontSize: '0.65rem', 
                          fontWeight: '700', 
                          padding: '2px 4px', 
                          borderRadius: '4px',
                          backgroundColor: 'rgba(0,0,0,0.05)',
                          color: borderColors[colorIdx],
                          whiteSpace: 'nowrap'
                        }}>
                          {booking.payment_method || 'A Confirmar'}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="admin-modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setSelectedBooking(null) }}>
          <div className="admin-modal fade-up visible">
            <div className="modal-header">
              <h2>Detalhes do Agendamento</h2>
              <button className="close-btn" onClick={() => setSelectedBooking(null)}>✕</button>
            </div>
            <div className="modal-body" style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Client Info Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'rgba(0, 112, 243, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontSize: '1.5rem', fontWeight: 'bold' }}>
                  {selectedBooking.customer_name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 style={{ margin: '0 0 6px 0', fontSize: '1.25rem', color: '#0f172a', fontWeight: '700' }}>{selectedBooking.customer_name}</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.85rem', color: '#64748b' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg> {selectedBooking.customer_email}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg> {selectedBooking.contact_phone}</span>
                  </div>
                </div>
              </div>

              {/* Location Card */}
              <div style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Local do Serviço</div>
                <div style={{ fontSize: '1rem', color: '#1e293b', fontWeight: '500', marginBottom: '4px' }}>{selectedBooking.address}</div>
                <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '16px' }}>{selectedBooking.postal_code}, {selectedBooking.city}</div>
                
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button 
                    className="btn" 
                    style={{ flex: 1, backgroundColor: '#fff', border: '1px solid #cbd5e1', color: '#334155', padding: '10px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', borderRadius: '8px', fontWeight: '600', transition: 'all 0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
                    onClick={() => {
                      const query = encodeURIComponent(`${selectedBooking.address}, ${selectedBooking.postal_code}, ${selectedBooking.city}, Portugal`);
                      window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
                    }}
                  >
                    📍 Google Maps
                  </button>
                  <button 
                    className="btn" 
                    style={{ flex: 1, backgroundColor: '#fff', border: '1px solid #cbd5e1', color: '#334155', padding: '10px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', borderRadius: '8px', fontWeight: '600', transition: 'all 0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
                    onClick={() => {
                      const query = encodeURIComponent(`${selectedBooking.address}, ${selectedBooking.postal_code}, ${selectedBooking.city}, Portugal`);
                      window.open(`https://waze.com/ul?q=${query}`, '_blank');
                    }}
                  >
                    🚗 Waze
                  </button>
                </div>
              </div>

              {/* Service Details Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ padding: '16px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Agendamento</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <input 
                        type="date" 
                        style={{ width: '100%', padding: '8px 12px', fontSize: '0.9rem', border: '1px solid #cbd5e1', borderRadius: '6px', backgroundColor: '#f8fafc', color: '#334155', outline: 'none' }} 
                        value={selectedBooking.service_date || ''} 
                        onChange={(e) => handleUpdateBooking(selectedBooking.id, 'service_date', e.target.value)}
                      />
                      <select 
                        style={{ width: '100%', padding: '8px 12px', fontSize: '0.9rem', border: '1px solid #cbd5e1', borderRadius: '6px', backgroundColor: '#f8fafc', color: '#334155', outline: 'none' }} 
                        value={selectedBooking.service_time || ''} 
                        onChange={(e) => handleUpdateBooking(selectedBooking.id, 'service_time', e.target.value)}
                      >
                        <option value="">Hora</option>
                        {Array.from({ length: 18 }, (_, i) => `${(i + 5).toString().padStart(2, '0')}:00`).map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                
                <div style={{ padding: '16px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Serviço</div>
                    <div style={{ fontSize: '1.1rem', color: '#1e293b', fontWeight: '600' }}>{selectedBooking.window_count} Janelas</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Preço Final</div>
                    <div style={{ fontSize: '1.5rem', color: 'var(--primary)', fontWeight: '800' }}>€{selectedBooking.total_price}</div>
                  </div>
                </div>
              </div>
              
              {/* Status Banner */}
              <div style={{ padding: '12px 16px', backgroundColor: selectedBooking.status === 'paid' ? '#f0fdf4' : '#fffbeb', borderRadius: '8px', border: `1px solid ${selectedBooking.status === 'paid' ? '#bbf7d0' : '#fde68a'}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '0.85rem', color: '#64748b', marginRight: '6px' }}>Método:</span>
                  <strong style={{ textTransform: 'capitalize', color: '#1e293b', fontSize: '0.9rem' }}>{selectedBooking.payment_method || 'A Confirmar'}</strong>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: '700', color: selectedBooking.status === 'paid' ? '#16a34a' : '#d97706' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: selectedBooking.status === 'paid' ? '#16a34a' : '#d97706' }}></div>
                  {selectedBooking.status === 'paid' ? 'Pago' : 'Pendente'}
                </div>
              </div>

              <div className="modal-actions" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              
              {selectedBooking.status !== 'paid' && !paymentAction && selectedBooking.status !== 'cancelled' && (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    className="btn btn-primary" 
                    style={{ flex: 1, backgroundColor: '#0070f3', borderColor: '#0070f3', fontSize: '0.85rem', padding: '10px', borderRadius: '8px', fontWeight: '600', boxShadow: '0 4px 14px 0 rgba(0,118,255,0.39)' }}
                    onClick={() => handleGeneratePayment('link')}
                    disabled={isGeneratingPayment}
                  >
                    {isGeneratingPayment ? '...' : 'Cobrar (Link)'}
                  </button>
                  <button 
                    className="btn btn-primary" 
                    style={{ flex: 1, backgroundColor: '#ea4c89', borderColor: '#ea4c89', fontSize: '0.85rem', padding: '10px', borderRadius: '8px', fontWeight: '600', boxShadow: '0 4px 14px 0 rgba(234,76,137,0.39)' }}
                    onClick={() => handleGeneratePayment('mbway')}
                    disabled={isGeneratingPayment}
                  >
                    {isGeneratingPayment ? '...' : 'Cobrar (MB Way)'}
                  </button>
                </div>
              )}

              {paymentAction === 'mbway' && adminClientSecret && (
                <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <h4 style={{ margin: '0 0 12px 0', fontSize: '1rem' }}>Cobrar via MB Way</h4>
                  <Elements stripe={stripePromise} options={{ clientSecret: adminClientSecret }}>
                    <AdminCheckoutForm 
                      amount={selectedBooking.total_price} 
                      onCancel={() => setPaymentAction(null)}
                      onSuccess={() => {
                        handleUpdateBooking(selectedBooking.id, 'status', 'paid');
                        setPaymentAction(null);
                        alert("Pagamento concluído com sucesso!");
                      }} 
                    />
                  </Elements>
                </div>
              )}

              {paymentAction === 'link' && paymentLinkUrl && (
                <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <h4 style={{ margin: '0', fontSize: '1rem' }}>Link de Pagamento Gerado</h4>
                  <p style={{ margin: '0', fontSize: '0.85rem', color: '#64748b' }}>Copie o link abaixo e envie ao cliente:</p>
                  <input 
                    type="text" 
                    value={paymentLinkUrl} 
                    readOnly 
                    style={{ width: '100%', padding: '8px', fontSize: '0.85rem', border: '1px solid #cbd5e1', borderRadius: '4px', backgroundColor: '#fff' }} 
                    onClick={(e) => { e.target.select(); navigator.clipboard.writeText(e.target.value); alert('Link copiado!'); }}
                  />
                  <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                    <button 
                      className="btn" 
                      style={{ flex: 1, backgroundColor: '#25D366', color: '#fff', fontSize: '0.85rem', padding: '8px' }}
                      onClick={() => {
                        const message = encodeURIComponent(`Olá ${selectedBooking.customer_name}, o link para o pagamento do seu agendamento (Valor: €${selectedBooking.total_price}) é: ${paymentLinkUrl}`);
                        window.open(`https://wa.me/351${selectedBooking.contact_phone.replace(/\D/g, '')}?text=${message}`, '_blank');
                      }}
                    >
                      Enviar WhatsApp
                    </button>
                    <button 
                      className="btn btn-outline" 
                      style={{ flex: 1, fontSize: '0.85rem', padding: '8px' }}
                      onClick={() => {
                        const subject = encodeURIComponent('Link de Pagamento - Impporta Limpezas');
                        const body = encodeURIComponent(`Olá ${selectedBooking.customer_name},\n\nO link para o pagamento do seu agendamento (Valor: €${selectedBooking.total_price}) é:\n${paymentLinkUrl}\n\nObrigado,\nImpporta Limpezas`);
                        window.open(`mailto:${selectedBooking.customer_email}?subject=${subject}&body=${body}`, '_blank');
                      }}
                    >
                      Enviar Email
                    </button>
                  </div>
                  <button className="btn btn-outline" style={{ width: '100%', marginTop: '4px', fontSize: '0.85rem', padding: '8px' }} onClick={() => setPaymentAction(null)}>
                    Voltar
                  </button>
                </div>
              )}

              {!paymentAction && (
                <button 
                  className="btn btn-primary" 
                  style={{ backgroundColor: '#25D366', borderColor: '#25D366', width: '100%', fontSize: '0.9rem', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', borderRadius: '8px', fontWeight: '600', color: 'white', boxShadow: '0 4px 14px 0 rgba(37,211,102,0.39)' }}
                  onClick={() => handleWhatsApp(selectedBooking)}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                  Conversar no WhatsApp
                </button>
              )}

              {!paymentAction && selectedBooking.status !== 'cancelled' ? (
                <button 
                  className="btn btn-outline" 
                  style={{ width: '100%', borderColor: '#ef4444', color: '#ef4444' }}
                  onClick={() => handleCancelBooking(selectedBooking.id)}
                >
                  Cancelar Agendamento
                </button>
              ) : !paymentAction && selectedBooking.status === 'cancelled' && (
                <button 
                  className="btn btn-primary" 
                  style={{ width: '100%' }}
                  onClick={() => handleRestoreBooking(selectedBooking.id)}
                >
                  Restaurar Agendamento
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Create Booking Modal */}
      {isCreating && (
        <div className="admin-modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setIsCreating(false) }}>
          <div className="admin-modal fade-up visible">
            <div className="modal-header">
              <h2>Novo Agendamento</h2>
              <button className="close-btn" onClick={() => setIsCreating(false)}>✕</button>
            </div>
            <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
              <div className="detail-group">
                <label>Nome do Cliente</label>
                <input type="text" className="form-input" style={{ width: '100%', padding: '8px' }} onChange={e => setNewBookingData({...newBookingData, customer_name: e.target.value})} />
              </div>
              <div className="detail-grid">
                <div className="detail-group">
                  <label>Telefone</label>
                  <input type="text" className="form-input" style={{ width: '100%', padding: '8px' }} onChange={e => setNewBookingData({...newBookingData, contact_phone: e.target.value})} />
                </div>
                <div className="detail-group">
                  <label>Email</label>
                  <input type="email" className="form-input" style={{ width: '100%', padding: '8px' }} onChange={e => setNewBookingData({...newBookingData, customer_email: e.target.value})} />
                </div>
              </div>
              <div className="detail-grid">
                <div className="detail-group">
                  <label>Morada</label>
                  <input type="text" className="form-input" style={{ width: '100%', padding: '8px' }} onChange={e => setNewBookingData({...newBookingData, address: e.target.value})} />
                </div>
                <div className="detail-group">
                  <label>Cód. Postal</label>
                  <input type="text" className="form-input" style={{ width: '100%', padding: '8px' }} onChange={e => setNewBookingData({...newBookingData, postal_code: e.target.value})} />
                </div>
              </div>
              <div className="detail-grid">
                <div className="detail-group">
                  <label>Imóvel</label>
                  <select className="form-input" style={{ width: '100%', padding: '8px' }} onChange={e => setNewBookingData({...newBookingData, property_type: e.target.value})}>
                    <option value="">Selecione...</option>
                    <option value="apartamento">Apartamento</option>
                    <option value="moradia">Moradia</option>
                    <option value="escritorio">Escritório</option>
                  </select>
                </div>
                <div className="detail-group">
                  <label>Janelas</label>
                  <input type="number" className="form-input" style={{ width: '100%', padding: '8px' }} onChange={e => setNewBookingData({...newBookingData, window_count: parseInt(e.target.value)})} />
                </div>
              </div>
              <div className="detail-grid">
                <div className="detail-group">
                  <label>Data</label>
                  <input type="date" className="form-input" style={{ width: '100%', padding: '8px' }} value={newBookingData.service_date || ''} onChange={e => setNewBookingData({...newBookingData, service_date: e.target.value})} />
                </div>
                <div className="detail-group">
                  <label>Hora</label>
                  <input type="time" className="form-input" style={{ width: '100%', padding: '8px' }} value={newBookingData.service_time || ''} onChange={e => setNewBookingData({...newBookingData, service_time: e.target.value})} />
                </div>
              </div>
              <div className="detail-grid">
                <div className="detail-group">
                  <label>Preço Total (€)</label>
                  <input type="number" className="form-input" style={{ width: '100%', padding: '8px' }} onChange={e => setNewBookingData({...newBookingData, total_price: parseFloat(e.target.value)})} />
                </div>
                <div className="detail-group">
                  <label>Método de Pagamento</label>
                  <select className="form-input" style={{ width: '100%', padding: '8px' }} value={newBookingData.payment_method || 'multibanco'} onChange={e => setNewBookingData({...newBookingData, payment_method: e.target.value})}>
                    <option value="multibanco">Multibanco</option>
                    <option value="mbway">MBWay</option>
                    <option value="numerário">No Local (Numerário)</option>
                  </select>
                </div>
              </div>

              {newBookingData.payment_method === 'mbway' && (
                <div className="detail-group" style={{ backgroundColor: '#f0fdf4', padding: '12px', borderRadius: '8px', border: '1px solid #bbf7d0', marginTop: '12px' }}>
                  <label style={{ color: '#166534', marginBottom: '8px', display: 'block' }}>Número MBWay para Cobrança</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input type="text" className="form-input" placeholder="Ex: 912345678" style={{ flex: 1, padding: '8px' }} onChange={e => setNewBookingData({...newBookingData, mbway_phone: e.target.value})} />
                    <button className="btn" style={{ backgroundColor: '#22c55e', color: 'white', padding: '8px 12px' }} onClick={() => alert('Pedido MBWay será enviado para: ' + (newBookingData.mbway_phone || '...'))}>Gerar Pedido</button>
                  </div>
                </div>
              )}

              <div className="modal-actions" style={{ marginTop: '24px' }}>
                <button 
                  className="btn" 
                  style={{ width: '100%', padding: '12px' }}
                  onClick={async () => {
                    const bookingToSave = { ...newBookingData, status: 'confirmed' };
                    if (!bookingToSave.customer_name) bookingToSave.customer_name = "Novo Cliente";
                    if (!bookingToSave.total_price) bookingToSave.total_price = 0;
                    
                    const { data, error } = await supabase.from('bookings').insert([bookingToSave]).select();
                    if (!error && data) {
                      setBookings([...bookings, data[0]]);
                    } else {
                      setBookings([...bookings, { ...bookingToSave, id: Date.now() }]);
                    }
                    setIsCreating(false);
                  }}
                >
                  Salvar Agendamento
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
