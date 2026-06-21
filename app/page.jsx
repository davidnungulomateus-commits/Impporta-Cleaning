'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabase';
// Note: This is a massive React conversion of the original 800-line vanilla JS.

export default function Home() {
  const [mounted, setMounted] = useState(false);

  // Form State
  const [step, setStep] = useState(1);
  const [roomCount, setRoomCount] = useState(1);
  const [windowCount, setWindowCount] = useState(1);
  const [propertyType, setPropertyType] = useState('apartamento');
  
  // Pricing State
  const [basePrice, setBasePrice] = useState(45);
  const [totalPrice, setTotalPrice] = useState(45);
  
  // Date State
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  
  // User Data State
  const [customerData, setCustomerData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    postalCode: '',
    city: ''
  });

  useEffect(() => {
    setMounted(true);
    // Any necessary DOM initialization
  }, []);

  const calculatePrice = () => {
    let p = 0;
    if (propertyType === 'apartamento') p += 40;
    if (propertyType === 'moradia') p += 60;
    if (propertyType === 'escritorio') p += 80;

    p += (roomCount * 5);
    p += (windowCount * 8);

    setBasePrice(p);
    setTotalPrice(p);
  };

  useEffect(() => {
    calculatePrice();
  }, [roomCount, windowCount, propertyType]);

  const handleNextStep = () => setStep(prev => prev + 1);
  const handlePrevStep = () => setStep(prev => prev - 1);

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
          </div>
        </div>
      </section>

      {/* Simulator Section placeholder */}
      <section id="calculator" className="calculator section-padding bg-alt">
        <div className="container">
          <div className="section-header text-center fade-up visible">
            <h2>Simulador & Agendamento</h2>
            <p>Descubra o valor em segundos e agende a sua limpeza.</p>
          </div>
          
          <div className="calc-grid">
            <div className="calc-form fade-up visible" style={{ transitionDelay: '0.1s' }}>
              
              {/* Process Bar */}
              <div className="process-bar">
                <div className={`process-step ${step >= 1 ? 'active' : ''}`}>1. Detalhes</div>
                <div className={`process-step ${step >= 2 ? 'active' : ''}`}>2. Data</div>
                <div className={`process-step ${step >= 3 ? 'active' : ''}`}>3. Morada</div>
                <div className={`process-step ${step >= 4 ? 'active' : ''}`}>4. Resumo</div>
              </div>

              {/* Step 1 */}
              {step === 1 && (
                <div className="step-content">
                  <h3>Detalhes do Imóvel</h3>
                  <div className="form-group">
                    <label className="form-label">Tipo de Imóvel</label>
                    <select 
                      className="form-control" 
                      value={propertyType} 
                      onChange={e => setPropertyType(e.target.value)}
                    >
                      <option value="apartamento">Apartamento</option>
                      <option value="moradia">Moradia</option>
                      <option value="escritorio">Escritório</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Número de Assoalhadas (T0, T1, etc.)</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      min="1" 
                      value={roomCount} 
                      onChange={e => setRoomCount(parseInt(e.target.value) || 1)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Número Aproximado de Janelas</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      min="1" 
                      value={windowCount} 
                      onChange={e => setWindowCount(parseInt(e.target.value) || 1)}
                    />
                  </div>
                  <button className="btn btn-primary" onClick={handleNextStep}>Continuar para Agendamento</button>
                </div>
              )}

              {/* Step 2, 3, 4 placeholders for simplicity during migration. We will build them out fully in the next iteration. */}
              {step > 1 && (
                <div className="step-content">
                  <h3>Passo {step} (Em migração...)</h3>
                  <button className="btn btn-outline" onClick={handlePrevStep} style={{ marginRight: '10px' }}>Voltar</button>
                  {step < 4 && <button className="btn btn-primary" onClick={handleNextStep}>Continuar</button>}
                  {step === 4 && <button className="btn btn-primary" onClick={() => alert('Agendamento submetido!')}>Confirmar e Agendar</button>}
                </div>
              )}
            </div>

            {/* Price Card */}
            <div className="price-card fade-up visible" style={{ transitionDelay: '0.2s' }}>
              <h3>Estimativa</h3>
              <div className="price-display">
                <span className="currency">€</span>
                <span className="amount">{totalPrice}</span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>
                O valor exato será confirmado após avaliação no local.
              </p>
              <div className="feature-list">
                <div className="feature-item">
                  <span>✓</span> Limpeza interior e exterior
                </div>
                <div className="feature-item">
                  <span>✓</span> Remoção de manchas difíceis
                </div>
                <div className="feature-item">
                  <span>✓</span> Limpeza de caixilharias
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
