import HeroInteractive from '../components/HeroInteractive';
import BookingWidget from '../components/BookingWidget';

export const metadata = {
  title: 'Impporta - Limpeza de Vidros Lisboa',
  description: 'Limpeza profissional e personalizada de vidros e janelas em Lisboa. Serviços para residências, escritórios e condomínios. Agende já a sua limpeza com a Impporta.',
};

export default function Home() {
  return (
    <main>
      {/* Hero */}
      <section id="hero" className="hero fade-up visible">
        <div className="container">
          <h1>Limpeza <span className="text-secondary">personalizada</span> de vidros e janelas</h1>
          <p>Sinta a diferença com a Impporta — onde a transparência, o brilho e a sua tranquilidade vêm em primeiro lugar. Garantimos vidros impecáveis e seguros para o seu ambiente.</p>
          
          <HeroInteractive />
        </div>
      </section>

      {/* Pricing */}
      <section id="services" className="pricing-section">
        <div className="container">
          <div className="section-header fade-up visible">
            <h2>Preços Transparentes</h2>
            <p>Sem surpresas. Sem letras pequenas.</p>
            <p style={{ color: 'var(--primary)', fontWeight: '600', marginTop: '8px' }}>Primeira visita sempre com 20% de desconto.</p>
          </div>

          <div className="discount-banner fade-up visible">
            <p className="discount-banner-title">🎉 Primeira visita com 20% de desconto — para novos clientes em todos os serviços.</p>
            <p className="discount-banner-sub">Sem código, sem formulários. O desconto é aplicado automaticamente.</p>
          </div>

          <div className="pricing-cards-grid">
            <div className="pricing-card fade-up visible">
              <div className="pricing-card-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="12" y1="3" x2="12" y2="21"/><line x1="3" y1="12" x2="21" y2="12"/></svg>
              </div>
              <h3 className="pricing-card-name">Apartamento T1</h3>
              <p className="pricing-card-subtitle">Interior + exterior, até 8 janelas</p>
              <span className="pricing-badge">1ª Visita</span>
              <div className="pricing-first-price">€36</div>
              <p className="pricing-regular-price">Depois: €45 / visita</p>
              <a href="#calculator" className="btn btn-primary">Agendar agora</a>
            </div>

            <div className="pricing-card fade-up visible" style={{ transitionDelay: '0.1s' }}>
              <div className="pricing-card-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="12" y1="3" x2="12" y2="21"/><line x1="3" y1="12" x2="21" y2="12"/></svg>
              </div>
              <h3 className="pricing-card-name">Apartamento T2</h3>
              <p className="pricing-card-subtitle">Interior + exterior, até 12 janelas</p>
              <span className="pricing-badge">1ª Visita</span>
              <div className="pricing-first-price">€48</div>
              <p className="pricing-regular-price">Depois: €60 / visita</p>
              <a href="#calculator" className="btn btn-primary">Agendar agora</a>
            </div>

            <div className="pricing-card fade-up visible" style={{ transitionDelay: '0.2s' }}>
              <div className="pricing-card-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="12" y1="3" x2="12" y2="21"/><line x1="3" y1="12" x2="21" y2="12"/></svg>
              </div>
              <h3 className="pricing-card-name">Apartamento T3 / Moradia</h3>
              <p className="pricing-card-subtitle">Interior + exterior, superfície maior</p>
              <span className="pricing-badge">1ª Visita</span>
              <div className="pricing-first-price">€68</div>
              <p className="pricing-regular-price">Depois: €85 / visita</p>
              <a href="#calculator" className="btn btn-primary">Agendar agora</a>
            </div>

            <div className="pricing-card pricing-card--commercial fade-up visible" style={{ transitionDelay: '0.3s' }}>
              <div className="pricing-card-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
              </div>
              <h3 className="pricing-card-name">Montra / Vidros de Loja</h3>
              <p className="pricing-card-subtitle">Contrato semanal recorrente, por visita</p>
              <span className="pricing-badge">1ª Visita</span>
              <div className="pricing-first-price">a partir de €16</div>
              <p className="pricing-regular-price">Depois: a partir de €20 / visita</p>
              <a href="#calculator" className="btn btn-primary">Agendar agora</a>
            </div>
          </div>

          <div className="pricing-trust-line fade-up visible">
            <p>Orçamento gratuito para moradias grandes ou edifícios de condomínio.</p>
            <a href="https://wa.me/351927322095" target="_blank" rel="noopener noreferrer">→ Pedir orçamento</a>
          </div>
        </div>
      </section>

      {/* Antes e Depois */}
      <section id="results" className="section-padding bg-alt" style={{ display: 'none' }}>
        <div className="container">
          <div className="section-header fade-up visible">
            <span style={{ textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--primary)', fontWeight: '600', marginBottom: '8px', display: 'block' }}>Resultados</span>
            <h2>Antes e Depois</h2>
            <p>Veja com os seus próprios olhos a diferença que uma limpeza profissional pode fazer. A transparência perfeita transforma o seu espaço.</p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginTop: '40px' }}>
            {[1, 2, 3].map((item) => (
              <div key={item} className="fade-up visible" style={{ background: 'var(--surface)', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', height: '200px' }}>
                  <div style={{ flex: 1, backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: '2px solid white' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#999' }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
                      <span style={{ fontSize: '0.8rem', marginTop: '8px', fontWeight: 'bold' }}>Foto em breve</span>
                    </div>
                  </div>
                  <div style={{ flex: 1, backgroundColor: '#e5e5e5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#999' }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
                      <span style={{ fontSize: '0.8rem', marginTop: '8px', fontWeight: 'bold' }}>Foto em breve</span>
                    </div>
                  </div>
                </div>
                <div style={{ padding: '16px', textAlign: 'center', borderTop: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 10%', fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-muted)' }}>
                    <span>Antes</span>
                    <span>Depois</span>
                  </div>
                </div>
              </div>
            ))}
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
                <h3>Escolha o Tipo de Imóvel</h3>
                <p>Selecione o seu tipo de imóvel no nosso simulador abaixo — T1, T2, T3 ou montra — e veja instantaneamente o preço da sua limpeza.</p>
                <a href="#calculator" className="btn btn-outline">Simular Agora</a>
              </div>
            </div>
            <div className="process-step fade-up visible">
              <div className="process-image step-2"></div>
              <div className="process-content">
                <div className="step-number">2</div>
                <h3>Escolha e Agende</h3>
                <p>Reserve o horário ideal diretamente no nosso calendário online. Certifique-se de estar em casa no dia agendado para receber o profissional.</p>
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
