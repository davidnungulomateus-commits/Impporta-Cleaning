'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import Link from 'next/link';

export default function AdminCalendarPage() {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newBookingData, setNewBookingData] = useState({});
  const [draggedBooking, setDraggedBooking] = useState(null);

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
    if (!b.service_date) return false;
    const bDate = new Date(b.service_date);
    return isSameDay(bDate, currentDate);
  });

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

  // Define hours for the timeline (e.g. 8h to 20h)
  const hours = Array.from({ length: 13 }, (_, i) => i + 8);

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
                  
                  // 80px per hour, 40px per 30 mins
                  const slots = Math.floor(y / 40);
                  const hoursToAdd = Math.floor(slots / 2);
                  const minutesToAdd = (slots % 2) * 30;
                  
                  const droppedHour = Math.max(8, Math.min(20, 8 + hoursToAdd));
                  const newTime = `${droppedHour.toString().padStart(2, '0')}:${minutesToAdd === 0 ? '00' : '30'}`;
                  
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
                  const startHour = Math.max(8, bHour); // Clamp to 8am
                  const topPercentage = ((startHour - 8) + (bMin / 60)) * 80; // 80px per hour
                  
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
            <div className="modal-body">
              
              <div className="detail-group">
                <label>Cliente</label>
                <div className="detail-val">{selectedBooking.customer_name}</div>
                <div className="detail-subval">{selectedBooking.customer_email}</div>
              </div>

              <div className="detail-group">
                <label>Contacto Telefónico</label>
                <div className="detail-val">{selectedBooking.contact_phone}</div>
              </div>

              <div className="detail-group">
                <label>Morada do Serviço</label>
                <div className="detail-val">{selectedBooking.address}</div>
                <div className="detail-subval">{selectedBooking.postal_code}, {selectedBooking.city}</div>
                
                <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                  <button 
                    className="btn btn-outline" 
                    style={{ flex: 1, padding: '6px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                    onClick={() => {
                      const query = encodeURIComponent(`${selectedBooking.address}, ${selectedBooking.postal_code}, ${selectedBooking.city}, Portugal`);
                      window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
                    }}
                  >
                    📍 Google Maps
                  </button>
                  <button 
                    className="btn btn-outline" 
                    style={{ flex: 1, padding: '6px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                    onClick={() => {
                      const query = encodeURIComponent(`${selectedBooking.address}, ${selectedBooking.postal_code}, ${selectedBooking.city}, Portugal`);
                      window.open(`https://waze.com/ul?q=${query}`, '_blank');
                    }}
                  >
                    🚗 Waze
                  </button>
                </div>
              </div>

              <div className="detail-grid">
                <div className="detail-group">
                  <label>Data & Hora</label>
                  <div className="detail-val">{new Date(selectedBooking.service_date).toLocaleDateString('pt-PT')}</div>
                  <div className="detail-subval">{selectedBooking.service_time}</div>
                </div>
                <div className="detail-group">
                  <label>Imóvel & Vidros</label>
                  <div className="detail-val">{selectedBooking.window_count} janelas</div>
                  <div className="detail-subval">{selectedBooking.property_type}</div>
                </div>
                <div className="detail-group">
                  <label>Preço Total</label>
                  <div className="detail-val" style={{ color: 'var(--primary)', fontWeight: '700' }}>€{selectedBooking.total_price}</div>
                </div>
                <div className="detail-group">
                  <label>Método de Pagamento</label>
                  <div className="detail-val" style={{ textTransform: 'capitalize' }}>{selectedBooking.payment_method || 'A Confirmar'}</div>
                  <div className="detail-subval">Status: {selectedBooking.status}</div>
                </div>
              </div>

              <div className="modal-actions" style={{ marginTop: '32px' }}>
                <button 
                  className="btn" 
                  style={{ width: '100%', backgroundColor: '#25D366', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                  onClick={() => handleWhatsApp(selectedBooking)}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                  </svg>
                  Conversar no WhatsApp
                </button>
              </div>
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
