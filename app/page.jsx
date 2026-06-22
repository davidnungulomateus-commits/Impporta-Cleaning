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
