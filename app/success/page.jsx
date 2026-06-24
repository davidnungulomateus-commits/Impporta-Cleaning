'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useState, useEffect } from 'react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const name = searchParams.get('name') || 'Cliente';
  const date = searchParams.get('date') || '';
  const time = searchParams.get('time') || '';
  const windows = searchParams.get('windows') || '4';
  const price = searchParams.get('price') || '0';
  const address = searchParams.get('address') || '';

  const [user, setUser] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkUser = async () => {
      const { supabase } = await import('../../lib/supabase');
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    checkUser();
  }, []);

  const handleGoogleSignup = async () => {
    const { supabase } = await import('../../lib/supabase');
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/dashboard'
      }
    });
  };

  const formattedDate = date ? new Date(date).toLocaleDateString('pt-PT') : '';

  return (
    <main>
      <section className="checkout-section fade-up visible" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="container" style={{ maxWidth: '800px', marginTop: '40px', marginBottom: '40px' }}>
          <div className="booking-card" style={{ padding: '2rem' }}>
            <div className="booking-step-content active">
              <div className="success-widget" style={{ textAlign: 'center', padding: '20px 10px' }}>
                <div className="success-icon" style={{ width: '80px', height: '80px', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--secondary)' }}><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <h2 style={{ fontSize: '2.25rem', fontWeight: '700', marginBottom: '8px' }}>Agendamento Confirmado!</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>O seu pedido foi registado com sucesso. A nossa equipa entrará em contacto em breve.</p>
                
                <div className="receipt-box" style={{ textAlign: 'left', background: 'var(--bg-alt)', padding: '24px', borderRadius: '12px' }}>
                  <div className="receipt-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', borderBottom: '1px dashed #e2e8f0', paddingBottom: '12px' }}><span>Cliente:</span><strong>{name}</strong></div>
                  {address && <div className="receipt-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', borderBottom: '1px dashed #e2e8f0', paddingBottom: '12px' }}><span>Morada:</span><strong>{address}</strong></div>}
                  {formattedDate && <div className="receipt-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', borderBottom: '1px dashed #e2e8f0', paddingBottom: '12px' }}><span>Data & Hora:</span><strong>{formattedDate} às {time}</strong></div>}
                  <div className="receipt-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', borderBottom: '1px dashed #e2e8f0', paddingBottom: '12px' }}><span>Quantidade de Vidros:</span><strong>{windows} janelas</strong></div>
                  <div className="receipt-row total" style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '12px', fontSize: '1.2rem', fontWeight: 'bold' }}><span>Total a Pagar:</span><strong>€{price}</strong></div>
                </div>

                {mounted && !user && (
                  <div style={{ marginTop: '32px', padding: '24px', backgroundColor: 'rgba(0, 112, 243, 0.04)', borderRadius: '12px', border: '1px solid rgba(0, 112, 243, 0.1)' }}>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Crie uma conta para gerir os seus agendamentos</h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '16px', fontSize: '0.95rem' }}>Poupe tempo nos próximos agendamentos e tenha acesso a campanhas exclusivas para clientes registados.</p>
                    <button 
                      type="button" 
                      className="btn btn-outline" 
                      onClick={handleGoogleSignup}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                      </svg>
                      Criar conta com Google
                    </button>
                  </div>
                )}

                <div className="success-actions" style={{ marginTop: '32px' }}>
                  <a href="/" className="btn btn-primary" style={{ padding: '12px 24px' }}>Voltar ao Início</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: 'center', padding: '100px' }}>Carregando...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
