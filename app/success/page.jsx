'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const name = searchParams.get('name') || 'Cliente';
  const date = searchParams.get('date') || '';
  const time = searchParams.get('time') || '';
  const windows = searchParams.get('windows') || '4';
  const price = searchParams.get('price') || '0';
  const address = searchParams.get('address') || '';

  const formattedDate = date ? new Date(date).toLocaleDateString('pt-PT') : '';

  return (
    <main>
      <section className="checkout-section fade-up visible" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div className="booking-card" style={{ padding: '2rem' }}>
            <div className="booking-step-content active">
              <div className="success-widget" style={{ textAlign: 'center', padding: '40px 20px' }}>
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
