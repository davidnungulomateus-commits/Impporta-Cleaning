'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(1);
  const [windowCount, setWindowCount] = useState(4);
  const [totalPrice, setTotalPrice] = useState(16);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [paymentMethod, setPaymentMethod] = useState('online');

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

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id.replace('cust-', '')]: value }));
  };

  const handleFinalizeBooking = async () => {
    if (!selectedDate || !selectedTimeSlot) {
      alert("Por favor, selecione uma data e horário no Passo 1.");
      setStep(1);
      return;
    }
    
    setIsSubmitting(true);
    
    // Convert selectedDate to local YYYY-MM-DD to avoid timezone shift issues
    const localDateStr = new Date(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000).toISOString().split('T')[0];

    // Create booking in Supabase
    const { error } = await supabase.from('bookings').insert([{
      customer_name: formData.name,
      email: formData.email,
      customer_phone: formData.phone,
      booking_date: localDateStr,
      time_slot: selectedTimeSlot,
      total_price: totalPrice,
      window_count: windowCount,
      street_address: `${formData.street}${formData.suite ? ', ' + formData.suite : ''}`,
      postal_code: formData.postal,
      payment_method: paymentMethod,
      status: 'pending'
    }]);

    setIsSubmitting(false);

    if (error) {
      console.error('Error creating booking:', error);
      alert('Houve um erro ao agendar. Por favor, tente novamente.');
      return;
    }

    setStep(4);
  };

  const handleWindowChange = (e) => {
    const val = parseInt(e.target.value) || 1;
    setWindowCount(val);
    setTotalPrice(val * 4);
  };

  if (!mounted) return null;

  return (
    <main>
      {/* Hero */}
      <section id="hero" className="hero fade-up visible">
        <div className="container">
          <h1>Limpeza <span className="text-secondary">personalizada</span> de vidros e janelas</h1>
          <p>Sinta a diferença com a Impporta — onde a transparência, o brilho e a sua tranquilidade vêm em primeiro lugar. Garantimos vidros impecáveis e seguros para o seu ambiente.</p>
          <div className="hero-buttons">
            <a href="#calculator" className="btn btn-primary">Agendar Já</a>
            <button className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
              </svg>
              Apoiar a Impporta
            </button>
          </div>
          
          <div className="stats">
            <div className="stat-item fade-up visible" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '650px', margin: '0 auto' }}>
              <div className="counter-container" style={{ position: 'relative', display: 'inline-block' }}>
                <h3><span>0</span><span className="text-secondary">+</span></h3>
              </div>
              <p className="stat-label">Clientes que nos apoiam</p>
              <p className="stat-dream-quote">"Somos uma equipa nova e jovem, mas carregamos o grande sonho de nos tornarmos a empresa número um em limpeza de vidros e janelas. A nossa dedicação e vontade de trabalhar são honestas e infinitas!"</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="services">
        <div className="container">
          <div className="section-header fade-up visible">
            <h2>O Que Fazemos</h2>
            <p>Somos especializados exclusivamente em limpeza de vidros e janelas. Garantimos máxima transparência, brilho e segurança para diferentes tipos de ambientes.</p>
          </div>
          
          <div className="services-grid">
            <div className="service-card fade-up visible">
              <div className="service-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
              </div>
              <h3>Limpeza de Vidros Residencial</h3>
              <p>Deixamos as janelas e sacadas da sua casa ou apartamento perfeitamente limpas e sem marcas, trazendo mais luz e harmonia para o seu lar.</p>
            </div>
            <div className="service-card fade-up visible" style={{ transitionDelay: '0.1s' }}>
              <div className="service-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
              </div>
              <h3>Limpeza de Vidros para Escritórios</h3>
              <p>Mantenha a fachada e as divisórias de vidro da sua empresa impecáveis, garantindo uma imagem profissional e um ambiente de trabalho produtivo.</p>
            </div>
            <div className="service-card fade-up visible" style={{ transitionDelay: '0.2s' }}>
              <div className="service-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
              </div>
              <h3>Limpeza de Vidros para Supermercados e Shoppings</h3>
              <p>Garantimos vidros extremamente limpos em montras de shoppings, balcões refrigerados e portas de entrada de supermercados, valorizando a apresentação e visibilidade dos seus produtos.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section id="process" className="process">
        <div className="container">
          <div className="section-header fade-up visible">
            <span style={{ textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--primary)', fontWeight: '600', marginBottom: '8px', display: 'block' }}>Como Funciona</span>
            <h2>O Nosso Processo Simples para Vidros Impecáveis</h2>
            <p>Acreditamos que contratar um serviço profissional de limpeza de janelas deve ser rápido e descomplicado. Veja os nossos passos simples:</p>
          </div>

          <div className="process-steps">
            <div className="process-step fade-up visible">
              <div className="process-image step-1"></div>
              <div className="process-content">
                <div className="step-number">1</div>
                <h3>Insira o Número de Janelas</h3>
                <p>Informe a quantidade de vidros e janelas que deseja limpar no nosso simulador abaixo para ver instantaneamente a sua poupança e preços.</p>
                <a href="#calculator" className="btn btn-outline">Simular Agora</a>
              </div>
            </div>
            <div className="process-step fade-up visible">
              <div className="process-image step-2"></div>
              <div className="process-content">
                <div className="step-number">2</div>
                <h3>Escolha e Agende</h3>
                <p>Selecione o tipo de ambiente (residência, escritório, supermercado ou shopping) e reserve o horário ideal. Certifique-se de estar em casa no dia agendado para receber o profissional.</p>
                <a href="#calendar" className="btn btn-outline">Ir para o Calendário</a>
              </div>
            </div>
            <div className="process-step fade-up visible">
              <div className="process-image step-3"></div>
              <div className="process-content">
                <div className="step-number">3</div>
                <h3>Pagamento Flexível</h3>
                <p>Realize o pagamento de forma simples e 100% segura pelo nosso sistema online ou, se preferir, efetue o pagamento diretamente em mãos ao nosso profissional no dia da limpeza.</p>
              </div>
            </div>
            <div className="process-step fade-up visible">
              <div className="process-image step-4"></div>
              <div className="process-content">
                <div className="step-number">4</div>
                <h3>Vidros Brilhantes</h3>
                <p>A nossa equipa desloca-se até si e realiza a limpeza de vidros no dia marcado. Não precisa de se preocupar com nada!</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section id="calculator" className="calculator-section fade-up visible">
        <div className="container">
          <div className="section-header">
            <h2>Simulador de Preço</h2>
            <p>Insira a quantidade de janelas/vidros e veja em tempo real quanto economiza ao escolher o nosso serviço especializado!</p>
          </div>

          <div className="calculator-box">
            <div className="calculator-inputs">
              <div className="input-group">
                <label htmlFor="window-range" className="input-label-highlight" style={{ fontSize: '1.35rem', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                  👉 Insira aqui o número de janelas a limpar: 
                  <span className="highlight-val" style={{ fontSize: '1.5rem', padding: '6px 18px' }}>{windowCount}</span>
                </label>
                <div className="slider-wrapper" style={{ marginTop: '16px' }}>
                  <input type="range" min="1" max="100" value={windowCount} onChange={handleWindowChange} className="window-slider" />
                  <input type="number" min="1" max="100" value={windowCount} onChange={handleWindowChange} className="window-number-input" />
                </div>
                
                <div className="window-counting-info" style={{ marginTop: '20px', backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '16px', fontSize: '0.9rem', textAlign: 'left', boxShadow: 'var(--shadow-sm)' }}>
                  <strong style={{ color: 'var(--text-main)', display: 'flex', marginBottom: '10px', fontSize: '0.95rem', alignItems: 'center', gap: '6px' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--primary)' }}><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                    Como contamos as janelas?
                  </strong>
                  <p style={{ color: 'var(--text-muted)', lineHeight: '1.5', margin: '0 0 10px 0' }}>
                    Cobramos por <strong>janela/estrutura completa</strong> e não por painéis ou divisórias internas. Veja como deve contar:
                  </p>
                  <ul style={{ color: 'var(--text-muted)', margin: '0', paddingLeft: '20px', lineHeight: '1.6' }}>
                    <li style={{ marginBottom: '8px' }}><strong>Moldura única com divisões:</strong> Se a sua janela ou porta possui vários vidros separados por divisórias (de metal ou madeira), mas está toda contida em <strong>uma única moldura principal</strong>, conta como apenas <strong>1 janela</strong>.</li>
                    <li style={{ marginBottom: '8px' }}><strong>Janelas de duas partes (guilhotina ou correr):</strong> Se possui uma janela dividida em duas partes estruturais independentes (ex: uma parte móvel que abre/desliza e uma parte fixa, ou uma parte superior e outra inferior), cada parte conta como <strong>1 janela</strong> (total de 2).</li>
                    <li style={{ marginBottom: '0' }}><strong>Montras ou Paredes de Vidro:</strong> Em fachadas comerciais ou paredes cobertas de vidro, cada painel individual delimitado pela sua própria estrutura/caixilho conta como <strong>1 janela</strong>.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="chart-wrapper-vertical">
              <div className="chart-column competitor">
                <div className="column-track">
                  <div className="column-fill" style={{ height: '70%' }}><span>€{windowCount * 10}</span></div>
                </div>
                <div className="column-label">Média Concorrência<br />(€10/janela)</div>
              </div>

              <div className="chart-column regular">
                <div className="column-track">
                  <div className="column-fill" style={{ height: '50%' }}><span>€{windowCount * 7}</span></div>
                </div>
                <div className="column-label">Preço Regular<br />(€7/janela)</div>
              </div>

              <div className="chart-column discount">
                <div className="column-track">
                  <div className="column-fill" style={{ height: '30%' }}><span>€{totalPrice}</span></div>
                </div>
                <div className="column-label">O Seu Preço (Oferta!)<br />(€4/janela)</div>
              </div>
            </div>

            <div className="savings-callout">
              <h3>Total a Pagar: <span className="text-secondary">€{totalPrice}</span></h3>
              <p>Você economiza <strong style={{ color: 'var(--secondary)' }}>€{windowCount * 6}</strong> em relação à concorrência ao aproveitar a oferta da primeira limpeza!</p>
            </div>
            
            <div style={{ textAlign: 'center', marginTop: '32px' }}>
              <a href="#calendar" className="btn btn-primary">Avançar para Agendamento</a>
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
                          <div key={`pad-${i}`} className="calendar-day empty"></div>
                        ))}
                        {Array.from({ length: new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + 1, 0).getDate() }).map((_, i) => {
                          const date = new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth(), i + 1);
                          const isPast = date < today;
                          const isSelected = selectedDate && selectedDate.getTime() === date.getTime();
                          return (
                            <div 
                              key={`day-${i}`} 
                              className={`calendar-day ${isPast ? 'past' : 'available'} ${isSelected ? 'today selected' : ''}`}
                              onClick={() => { if (!isPast) setSelectedDate(date); }}
                              style={{ 
                                cursor: isPast ? 'not-allowed' : 'pointer',
                                backgroundColor: isSelected ? 'var(--primary)' : '',
                                color: isSelected ? '#fff' : ''
                              }}
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
                        }).map(time => (
                          <button 
                            key={time} 
                            type="button" 
                            className={`time-slot-btn ${selectedTimeSlot === time ? 'selected' : ''}`}
                            onClick={() => setSelectedTimeSlot(time)}
                            style={{
                              backgroundColor: selectedTimeSlot === time ? 'var(--primary)' : '',
                              color: selectedTimeSlot === time ? '#fff' : '',
                              borderColor: selectedTimeSlot === time ? 'var(--primary)' : ''
                            }}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                      <div className="slot-summary-box" style={{ display: 'none' }}>
                        <p>Duração estimada: <strong>8 minutos</strong></p>
                        <p>Horário: <strong>14:00 às 14:08</strong></p>
                      </div>
                    </div>
                  </div>
                  <div className="step-actions" style={{ marginTop: '32px', display: 'flex', justifyContent: 'flex-end' }}>
                    <button type="button" className="btn btn-primary" onClick={() => setStep(2)}>Continuar</button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="booking-step-content active">
                  <div className="google-auth-container" style={{ marginTop: '24px', textAlign: 'center', paddingBottom: '24px', borderBottom: '1px solid var(--border)' }}>
                    <button type="button" className="btn btn-outline" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontWeight: '600' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                      Preencher rapidamente com Google
                    </button>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '10px' }}>(Opcional) A forma mais rápida de preencher os seus dados.</p>
                  </div>

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
                      <p>Serviço: <strong>Limpeza de Vidros Impporta</strong></p>
                      <p>Janelas: <strong>{windowCount} janelas</strong></p>
                      <p>Data/Hora: <strong>{selectedDate ? selectedDate.toLocaleDateString('pt-PT') : ''} às {selectedTimeSlot || '?'}</strong></p>
                      <p>Duração estimada: <strong>{30 + windowCount * 2} min</strong></p>
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
                            <span className="pm-title">📱 MB Way</span>
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

                      {paymentMethod === 'online' && (
                        <div className="card-details-fields" style={{ marginTop: '20px' }}>
                          <div className="form-group">
                            <label htmlFor="card-num">Número do Cartão</label>
                            <input type="text" id="card-num" placeholder="0000 0000 0000 0000" className="form-input-field" />
                          </div>
                          <div className="form-row" style={{ marginTop: '12px' }}>
                            <div className="form-group">
                              <label htmlFor="card-expiry">Validade</label>
                              <input type="text" id="card-expiry" placeholder="MM/AA" className="form-input-field" />
                            </div>
                            <div className="form-group">
                              <label htmlFor="card-cvc">CVC</label>
                              <input type="text" id="card-cvc" placeholder="000" className="form-input-field" />
                            </div>
                          </div>
                        </div>
                      )}

                      {paymentMethod === 'mbway' && (
                        <div className="mbway-details-fields" style={{ marginTop: '20px' }}>
                          <div className="form-group">
                            <label htmlFor="mbway-phone">Número de Telemóvel MBWay</label>
                            <input type="tel" id="mbway-phone" placeholder="910 000 000" className="form-input-field" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="step-actions" style={{ marginTop: '32px', display: 'flex', justifyContent: 'space-between' }}>
                    <button type="button" className="btn btn-outline" onClick={() => setStep(2)}>Voltar</button>
                    <button type="button" className="btn btn-primary" onClick={handleFinalizeBooking} disabled={isSubmitting}>
                      {isSubmitting ? 'A processar...' : 'Confirmar e Finalizar'}
                    </button>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="booking-step-content active">
                  <div className="success-widget" style={{ textAlign: 'center', padding: '40px 20px' }}>
                    <div className="success-icon" style={{ width: '80px', height: '80px', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--secondary)' }}><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                    <h2 style={{ fontSize: '2.25rem', fontWeight: '700', marginBottom: '8px' }}>Agendamento Confirmado!</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>O seu pedido foi registado com sucesso. Guarde o resumo do seu agendamento:</p>
                    
                    <div className="receipt-box">
                      <div className="receipt-row"><span>Nº do Serviço:</span><strong>#IMP-94827</strong></div>
                      <div className="receipt-row"><span>Cliente:</span><strong>João Silva</strong></div>
                      <div className="receipt-row"><span>Contacto:</span><strong>912 345 678</strong></div>
                      <div className="receipt-row"><span>Morada:</span><strong>Rua das Flores, nº 15, Porto</strong></div>
                      <div className="receipt-row"><span>Quantidade de Vidros:</span><strong>{windowCount} janelas</strong></div>
                      <div className="receipt-row"><span>Duração Estimada:</span><strong>{windowCount * 2} minutos (14:00 às 14:08)</strong></div>
                      <div className="receipt-row"><span>Método Escolhido:</span><strong>Pagamento em Mãos</strong></div>
                      <div className="receipt-row total"><span>Total Pago / A Pagar:</span><strong>€{totalPrice}</strong></div>
                    </div>

                    <div className="success-actions" style={{ marginTop: '32px' }}>
                      <button type="button" className="btn btn-primary" onClick={() => setStep(1)}>Fazer Novo Agendamento</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
