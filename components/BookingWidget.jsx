'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

// Pricing constants — single source of truth
const SERVICES = {
  t1: {
    name: 'Apartamento T1',
    subtitle: 'Interior + exterior, até 8 janelas',
    firstVisitPrice: 36,
    regularPrice: 45,
    durationMinutes: 60,
  },
  t2: {
    name: 'Apartamento T2',
    subtitle: 'Interior + exterior, até 12 janelas',
    firstVisitPrice: 48,
    regularPrice: 60,
    durationMinutes: 75,
  },
  t3: {
    name: 'Apartamento T3 / Moradia',
    subtitle: 'Interior + exterior, superfície maior',
    firstVisitPrice: 68,
    regularPrice: 85,
    durationMinutes: 105,
  },
  montra: {
    name: 'Montra / Vidros de Loja',
    subtitle: 'Contrato semanal recorrente, por visita',
    firstVisitPrice: 16,
    regularPrice: 20,
    durationMinutes: 30,
    isRange: true,
    firstVisitPriceMax: 24,
    regularPriceMax: 30,
  },
};

export default function BookingWidget() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState('t2');
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [paymentMethod, setPaymentMethod] = useState('online');
  const [existingBookings, setExistingBookings] = useState([]);
  const [user, setUser] = useState(null);
  const [showAuthBlock, setShowAuthBlock] = useState(false);
  const [isFirstVisit, setIsFirstVisit] = useState(true);

  // Customer Form Data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    street: '',
    postal: '',
    suite: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const showError = (msg) => {
    setErrorMessage(msg);
    setTimeout(() => setErrorMessage(''), 6000);
  };

  // Derive price from selected service
  const service = SERVICES[selectedService];
  const totalPrice = isFirstVisit ? service.firstVisitPrice : service.regularPrice;

  useEffect(() => {
    if (step === 3 && (paymentMethod === 'online' || paymentMethod === 'mbway') && totalPrice > 0) {
      setClientSecret('');
      fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          amount: totalPrice,
          paymentMethodType: paymentMethod === 'online' ? 'card' : 'mb_way',
          name: formData.name,
          email: formData.email,
          phone: formData.phone
        }),
      })
        .then((res) => res.json())
        .then((data) => setClientSecret(data.clientSecret))
        .catch((err) => console.error("Error fetching intent:", err));
    }
  }, [step, paymentMethod, totalPrice, formData.name, formData.email, formData.phone]);

  useEffect(() => {
    setMounted(true);
    
    // Restore state if coming back from Google Auth
    const restoreState = () => {
      const savedState = sessionStorage.getItem('impporta_booking_state');
      if (savedState) {
        try {
          const parsed = JSON.parse(savedState);
          if (parsed.selectedService) setSelectedService(parsed.selectedService);
          if (parsed.selectedTimeSlot) setSelectedTimeSlot(parsed.selectedTimeSlot);
          if (parsed.selectedDate) setSelectedDate(new Date(parsed.selectedDate));
          if (parsed.step) setStep(parsed.step);
          
          // Scroll to calendar section
          setTimeout(() => {
            document.getElementById('calendar')?.scrollIntoView({ behavior: 'smooth' });
          }, 500);
        } catch (e) {
          console.error("Error restoring state", e);
        }
        sessionStorage.removeItem('impporta_booking_state');
      }
    };
    restoreState();

    // Listen to hash changes for pricing card clicks
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#calculator-')) {
        const serviceId = hash.replace('#calculator-', '');
        if (SERVICES[serviceId]) {
          setSelectedService(serviceId);
          setTimeout(() => {
            document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }
      }
    };

    handleHashChange(); // Run on mount in case they loaded with a hash
    window.addEventListener('hashchange', handleHashChange);

    const fetchSessionForAutofill = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session && session.user) {
        setUser(session.user);
        setFormData(prev => ({
          ...prev,
          name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || prev.name,
          email: session.user.email || prev.email,
          phone: session.user.user_metadata?.phone || session.user.phone || prev.phone
        }));

        // Check if first visit
        try {
          const res = await fetch(`/api/check-first-visit?user_id=${session.user.id}`);
          const data = await res.json();
          setIsFirstVisit(data.isFirstVisit);
        } catch {
          setIsFirstVisit(true); // Default to first visit if check fails
        }
      }
    };
    fetchSessionForAutofill();
  }, []);

  useEffect(() => {
    if (!selectedDate) return;
    
    // Convert to local YYYY-MM-DD
    const localDateStr = new Date(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000).toISOString().split('T')[0];
    
    const fetchBookings = async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select('service_time, window_count')
        .eq('service_date', localDateStr)
        .neq('status', 'cancelled');
        
      if (!error && data) {
        setExistingBookings(data);
      } else {
        setExistingBookings([]);
      }
    };
    fetchBookings();
  }, [selectedDate]);

  const timeToMinutes = (timeStr) => {
    if (!timeStr) return 0;
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id.replace('cust-', '')]: value }));
  };

  const handleFinalizeBooking = async (e, overrideStatus = null) => {
    if (!selectedDate || !selectedTimeSlot) {
      showError("Por favor, selecione uma data e horário no Passo 1.");
      setStep(1);
      return;
    }
    
    setIsSubmitting(true);
    
    // Convert selectedDate to local YYYY-MM-DD to avoid timezone shift issues
    const localDateStr = new Date(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000).toISOString().split('T')[0];

    // Create booking in Supabase
    const { error } = await supabase.from('bookings').insert([{
      customer_name: formData.name,
      customer_email: formData.email,
      contact_phone: formData.phone,
      service_date: localDateStr,
      service_time: selectedTimeSlot,
      total_price: totalPrice,
      service_type: selectedService,
      service_name: service.name,
      address: `${formData.street}${formData.suite ? ', ' + formData.suite : ''}`,
      city: formData.postal,
      postal_code: formData.postal,
      payment_method: paymentMethod,
      status: overrideStatus || 'pending',
      user_id: user?.id || null
    }]);

    setIsSubmitting(false);

    if (error) {
      console.error('Error creating booking:', error);
      showError(error.message || 'Houve um erro ao agendar. Verifique os dados e tente novamente.');
      return;
    }

    const queryParams = new URLSearchParams({
      name: formData.name,
      date: localDateStr,
      time: selectedTimeSlot,
      service: service.name,
      price: totalPrice.toString(),
      address: `${formData.street}${formData.suite ? ', ' + formData.suite : ''}`
    }).toString();

    router.push(`/success?${queryParams}`);
  };

  const handleContinueToStep2 = () => {
    if (!selectedDate || !selectedTimeSlot) {
      showError("Por favor, selecione um horário disponível antes de continuar.");
      return;
    }
    setStep(2);
  };

  const handleGoogleLogin = async () => {
    // Save state before redirecting
    sessionStorage.setItem('impporta_booking_state', JSON.stringify({
      selectedService,
      selectedTimeSlot,
      selectedDate: selectedDate?.getTime(),
      step: 2
    }));

    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/#calendar'
      }
    });
  };

  // Window icon SVG for the selector buttons
  const WindowIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="12" y1="3" x2="12" y2="21"/><line x1="3" y1="12" x2="21" y2="12"/></svg>
  );

  const StoreIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
  );

  if (!mounted) return null;

  return (
    <>
      {errorMessage && (
        <div style={{ position: 'fixed', top: '24px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#EF4444', color: 'white', padding: '16px 24px', borderRadius: '8px', zIndex: 9999, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '12px', animation: 'fadeUp 0.3s ease-out' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          {errorMessage}
        </div>
      )}
      
      {/* Simulator Section */}
      <section id="calculator" className="calculator-section fade-up visible">
        <div className="container">
          <div className="section-header">
            <h2>Simulador de Preço</h2>
            <p>Escolha o tipo de imóvel e veja instantaneamente o preço da sua limpeza de vidros.</p>
          </div>

          <div className="calculator-box">
            <div className="service-selector">
              {Object.entries(SERVICES).map(([key, svc]) => (
                <button
                  key={key}
                  type="button"
                  className={`service-selector-btn ${selectedService === key ? 'active' : ''}`}
                  onClick={() => setSelectedService(key)}
                >
                  <div className="selector-icon">
                    {key === 'montra' ? <StoreIcon /> : <WindowIcon />}
                  </div>
                  <div>
                    <div>{svc.name}</div>
                    <div className="selector-label">{svc.subtitle}</div>
                  </div>
                </button>
              ))}
            </div>

            <div className="simulator-result">
              <span className="pricing-badge">1ª Visita</span>
              <div className="simulator-result-price">
                {service.isRange ? `€${service.firstVisitPrice}–${service.firstVisitPriceMax}` : `€${service.firstVisitPrice}`}
              </div>
              <p className="simulator-result-regular">
                {service.isRange
                  ? `Depois: €${service.regularPrice}–${service.regularPriceMax} / visita`
                  : `Depois: €${service.regularPrice} / visita`
                }
              </p>
              <p className="simulator-result-description">
                {service.isRange
                  ? `Para uma ${service.name.toLowerCase()}, a primeira visita custa a partir de €${service.firstVisitPrice}. As visitas seguintes custam a partir de €${service.regularPrice}.`
                  : `Para um ${service.name}, a primeira visita custa €${service.firstVisitPrice}. As visitas seguintes custam €${service.regularPrice}.`
                }
              </p>
              <a href="#calendar" className="btn btn-primary">Agendar agora</a>

              {(selectedService === 't3' || selectedService === 'montra') && (
                <p className="simulator-result-note">
                  Para propriedades maiores ou condomínios, podemos preparar um orçamento personalizado gratuito.{' '}
                  <a href="https://wa.me/351927322095" target="_blank" rel="noopener noreferrer">💬 Contactar via WhatsApp</a>
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Calendar Section */}
      <section id="calendar" className="calendar-section fade-up visible">
        <div className="container">
          <div className="calendar-box">
            <div className="calendar-header">
              <h2>Agendamento Online</h2>
              <p>Reserve o seu horário de forma rápida e 100% online.</p>
            </div>
            
            <div className="booking-progress">
              <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>1. Data e Hora</div>
              <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>2. Detalhes e Morada</div>
              <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>3. Pagamento</div>
              <div className={`progress-step ${step >= 4 ? 'active' : ''}`}>4. Confirmação</div>
            </div>

            <div className="booking-steps-container">
              {step === 1 && (
                <div className="booking-step-content active">
                  <div className="calendar-flex">
                    <div className="calendar-widget">
                      <div className="calendar-month-header">
                        <button type="button" className="btn-icon" onClick={() => setCurrentMonthDate(new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() - 1, 1))}>&lt;</button>
                        <span style={{ textTransform: 'capitalize' }}>{currentMonthDate.toLocaleDateString('pt-PT', { month: 'long', year: 'numeric' })}</span>
                        <button type="button" className="btn-icon" onClick={() => setCurrentMonthDate(new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + 1, 1))}>&gt;</button>
                      </div>
                      <div className="calendar-weekdays">
                        <div>Dom</div><div>Seg</div><div>Ter</div><div>Qua</div><div>Qui</div><div>Sex</div><div>Sáb</div>
                      </div>
                      <div className="calendar-days-grid">
                        {Array.from({ length: new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth(), 1).getDay() }).map((_, i) => (
                          <div key={`pad-${i}`} className="calendar-day-cell" style={{ visibility: 'hidden' }}></div>
                        ))}
                        {Array.from({ length: new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + 1, 0).getDate() }).map((_, i) => {
                          const date = new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth(), i + 1);
                          const isPast = date < today;
                          const isSelected = selectedDate && selectedDate.getTime() === date.getTime();
                          return (
                            <div 
                              key={`day-${i}`} 
                              className={`calendar-day-cell ${isPast ? 'disabled' : ''} ${isSelected ? 'selected' : ''}`}
                              onClick={() => { if (!isPast) setSelectedDate(date); }}
                            >
                              {i + 1}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div className="time-slots-widget">
                      <h3>Horários Disponíveis</h3>
                      <div className="time-slots-grid" style={{ maxHeight: '300px', overflowY: 'auto', paddingRight: '10px' }}>
                        {Array.from({ length: 35 }, (_, i) => {
                          const hour = Math.floor(i / 2) + 5;
                          const min = i % 2 === 0 ? '00' : '30';
                          return `${hour.toString().padStart(2, '0')}:${min}`;
                        }).map(time => {
                          const newDuration = service.durationMinutes;
                          const newStart = timeToMinutes(time);
                          const newEnd = newStart + newDuration;
                          
                          const isConflict = existingBookings.some(b => {
                            const bStart = timeToMinutes(b.service_time);
                            const bDuration = 30 + (b.window_count || 4) * 2;
                            const bEnd = bStart + bDuration;
                            return (newStart < bEnd) && (newEnd > bStart);
                          });

                          return (
                            <button 
                              key={time} 
                              type="button" 
                              disabled={isConflict}
                              className={`time-slot-btn ${selectedTimeSlot === time ? 'selected' : ''}`}
                              onClick={() => setSelectedTimeSlot(time)}
                              style={{
                                backgroundColor: selectedTimeSlot === time ? 'var(--primary)' : (isConflict ? '#f1f5f9' : ''),
                                color: selectedTimeSlot === time ? '#fff' : (isConflict ? '#94a3b8' : ''),
                                borderColor: selectedTimeSlot === time ? 'var(--primary)' : (isConflict ? '#e2e8f0' : ''),
                                cursor: isConflict ? 'not-allowed' : 'pointer',
                                opacity: isConflict ? 0.6 : 1,
                                textDecoration: isConflict ? 'line-through' : 'none'
                              }}
                            >
                              {time}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="step-actions" style={{ marginTop: '32px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '16px' }}>
                    <button type="button" className="btn btn-primary" onClick={handleContinueToStep2}>Continuar</button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="booking-step-content active">
                  <form className="details-form" style={{ marginTop: '24px' }}>
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="cust-name">Nome Completo *</label>
                        <input type="text" id="cust-name" required placeholder="Ex: João Silva" className="form-input-field" value={formData.name} onChange={handleInputChange} />
                      </div>
                      <div className="form-group">
                        <label htmlFor="cust-email">Email</label>
                        <input type="email" id="cust-email" placeholder="Ex: joao@email.com" className="form-input-field" value={formData.email} onChange={handleInputChange} />
                      </div>
                    </div>
                    <div className="form-group" style={{ marginTop: '16px' }}>
                      <label htmlFor="cust-phone">Telemóvel / Contacto *</label>
                      <input type="tel" id="cust-phone" required placeholder="Ex: 912 345 678" className="form-input-field" value={formData.phone} onChange={handleInputChange} />
                    </div>
                    <div className="form-group" style={{ marginTop: '16px' }}>
                      <label htmlFor="cust-street">Rua e Número da Porta *</label>
                      <input type="text" id="cust-street" required placeholder="Ex: Rua das Flores, nº 15" className="form-input-field" value={formData.street} onChange={handleInputChange} />
                    </div>
                    <div className="form-row" style={{ marginTop: '16px' }}>
                      <div className="form-group">
                        <label htmlFor="cust-postal">Código Postal *</label>
                        <input type="text" id="cust-postal" required placeholder="Ex: 4000-000" className="form-input-field" value={formData.postal} onChange={handleInputChange} />
                      </div>
                      <div className="form-group">
                        <label htmlFor="cust-suite">Andar / Apartamento (opcional)</label>
                        <input type="text" id="cust-suite" placeholder="Ex: 3º Esquerdo" className="form-input-field" value={formData.suite} onChange={handleInputChange} />
                      </div>
                    </div>
                    <p className="form-warning-note" style={{ marginTop: '24px', color: 'var(--primary)', fontWeight: '600' }}>⚠️ Importante: Certifique-se de que estará em casa no dia e horário agendados para receber o nosso profissional.</p>
                  </form>
                  <div className="step-actions" style={{ marginTop: '32px', display: 'flex', justifyContent: 'space-between' }}>
                    <button type="button" className="btn btn-outline" onClick={() => setStep(1)}>Voltar</button>
                    <button type="button" className="btn btn-primary" onClick={() => setStep(3)}>Prosseguir para Pagamento</button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="booking-step-content active">
                  <div className="payment-widget" style={{ marginTop: '24px' }}>
                    <div className="booking-summary-preview">
                      <h3>Resumo do Serviço</h3>
                      <p>Serviço: <strong>{service.name}</strong></p>
                      <p>Data/Hora: <strong>{selectedDate ? selectedDate.toLocaleDateString('pt-PT') : ''} às {selectedTimeSlot || '?'}</strong></p>
                      <p>Duração estimada: <strong>{service.durationMinutes} min</strong></p>
                      <p className="total-preview-cost">Total: <strong>€{totalPrice}</strong></p>
                    </div>

                    <div className="payment-methods" style={{ marginTop: '24px' }}>
                      <h3>Método de Pagamento</h3>
                      <div className="payment-method-options" style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
                        <label className={`pm-option ${paymentMethod === 'online' ? 'active' : ''}`}>
                          <input type="radio" name="payment-method" value="online" checked={paymentMethod === 'online'} onChange={(e) => setPaymentMethod(e.target.value)} />
                          <div className="pm-info">
                            <span className="pm-title">💳 Cartão de Crédito / Débito (Online)</span>
                            <p>Pague online de forma 100% segura.</p>
                          </div>
                        </label>
                        <label className={`pm-option ${paymentMethod === 'mbway' ? 'active' : ''}`}>
                          <input type="radio" name="payment-method" value="mbway" checked={paymentMethod === 'mbway'} onChange={(e) => setPaymentMethod(e.target.value)} />
                          <div className="pm-info">
                            <span className="pm-title" style={{ display: 'flex', alignItems: 'center' }}>
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ marginRight: '8px', flexShrink: 0 }}>
                                <path d="M4 7 v-2 a2 2 0 0 1 2 -2 h12 a2 2 0 0 1 2 2 v2" stroke="#E31837" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M4 17 v2 a2 2 0 0 0 2 2 h12 a2 2 0 0 0 2 -2 v-2" stroke="#E31837" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                <text x="12" y="16.5" fill="#000" fontSize="13" fontWeight="900" fontFamily="Arial, sans-serif" textAnchor="middle">MB</text>
                              </svg>
                              MB Way
                            </span>
                            <p>Receba a notificação de pagamento diretamente no telemóvel.</p>
                          </div>
                        </label>
                        <label className={`pm-option ${paymentMethod === 'cash' ? 'active' : ''}`}>
                          <input type="radio" name="payment-method" value="cash" checked={paymentMethod === 'cash'} onChange={(e) => setPaymentMethod(e.target.value)} />
                          <div className="pm-info">
                            <span className="pm-title">💵 Pagamento em mãos (Dinheiro / Cartão)</span>
                            <p>Efetue o pagamento diretamente ao profissional no dia da limpeza.</p>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>

                  {(paymentMethod === 'online' || paymentMethod === 'mbway') ? (
                    clientSecret ? (
                      <Elements stripe={stripePromise} options={{ clientSecret }}>
                        <CheckoutForm 
                          amount={totalPrice} 
                          onBack={() => setStep(2)} 
                          onSuccess={() => handleFinalizeBooking(null, 'paid')} 
                        />
                      </Elements>
                    ) : (
                      <div style={{ marginTop: '24px', textAlign: 'center' }}>A carregar sistema de pagamento seguro...</div>
                    )
                  ) : (
                    <div className="step-actions" style={{ marginTop: '32px', display: 'flex', justifyContent: 'space-between' }}>
                      <button type="button" className="btn btn-outline" onClick={() => setStep(2)}>Voltar</button>
                      <button type="button" className="btn btn-primary" onClick={() => handleFinalizeBooking(null, 'pending')} disabled={isSubmitting}>
                        {isSubmitting ? 'A processar...' : 'Confirmar e Finalizar'}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
