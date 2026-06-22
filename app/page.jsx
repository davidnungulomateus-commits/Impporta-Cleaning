'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import confetti from 'canvas-confetti';
import BookingWidget from '../components/BookingWidget';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [supportCount, setSupportCount] = useState(0);
  const [hasSupported, setHasSupported] = useState(false);

  useEffect(() => {
    setMounted(true);

    const fetchSupport = async () => {
      const { data, error } = await supabase.from('support_stats').select('count').eq('id', 1).single();
      if (data && !error) {
        setSupportCount(data.count);
      }
    };
    fetchSupport();
  }, []);

  const handleSupportClick = async () => {
    if (hasSupported) return;
    setHasSupported(true);
    setSupportCount(prev => prev + 1);

    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#2e5cff', '#00e5ff', '#ffffff'] 
    });

    await supabase.rpc('increment_support_count');
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
            <button 
              className={`btn btn-outline ${hasSupported ? 'supported' : ''}`} 
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: hasSupported ? 'default' : 'pointer', opacity: hasSupported ? 0.8 : 1 }}
              onClick={handleSupportClick}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill={hasSupported ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
              </svg>
              {hasSupported ? 'Obrigado pelo apoio!' : 'Apoiar a Impporta'}
            </button>
          </div>
          
          <div style={{ marginTop: '20px', marginBottom: '32px', fontSize: '0.9rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: '500', background: 'rgba(0, 112, 243, 0.05)', padding: '8px 16px', borderRadius: '20px', display: 'inline-flex' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--primary)' }}><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>
            <span>A nossa app mobile (iOS e Android) chegará em breve!</span>
          </div>
          
          <div className="stats">
            <div className="stat-item fade-up visible" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '650px', margin: '0 auto' }}>
              <div className="counter-container" style={{ position: 'relative', display: 'inline-block' }}>
                <h3><span>{supportCount}</span><span className="text-secondary">+</span></h3>
              </div>
              <p className="stat-label">Clientes que nos apoiam</p>
              <p className="stat-dream-quote" style={{ fontSize: '0.9rem', lineHeight: '1.5', opacity: 0.8 }}>"Somos uma equipa nova e jovem, mas carregamos o grande sonho de nos tornarmos a empresa número um em limpeza de vidros e janelas. A nossa dedicação e vontade de trabalhar são honestas e infinitas!"</p>
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

      <BookingWidget />
    </main>
  );
}
