'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import confetti from 'canvas-confetti';

export default function HeroInteractive() {
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
    <>
      <div className="hero-buttons" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
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
        
        {/* WhatsApp Link Priority 3a */}
        <a href="https://wa.me/351927322095" target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.95rem', color: 'var(--text-main)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: '500', transition: 'color 0.2s ease' }} onMouseOver={(e) => e.currentTarget.style.color = 'var(--primary)'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-main)'}>
          Prefere falar primeiro? 💬 <span style={{ color: '#25D366', fontWeight: 'bold' }}>WhatsApp: +351 927 322 095</span>
        </a>
      </div>
      
      <div style={{ marginTop: '32px', marginBottom: '32px', fontSize: '0.9rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: '500', background: 'rgba(0, 112, 243, 0.05)', padding: '8px 16px', borderRadius: '20px', display: 'inline-flex' }}>
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
    </>
  );
}
