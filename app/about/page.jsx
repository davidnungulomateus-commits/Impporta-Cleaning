import Link from 'next/link';

export const metadata = {
  title: 'Quem Somos | Impporta - Limpeza de Vidros',
  description: 'Conheça a história e os valores da Impporta, a sua parceira de confiança na limpeza profissional de vidros.',
};

export default function AboutPage() {
  return (
    <main>
      <section className="hero fade-up visible" style={{ padding: '140px 0 80px' }}>
        <div className="container">
          <h1>Sobre a <span className="text-secondary">Impporta</span></h1>
          <p style={{ maxWidth: '800px', margin: '0 auto' }}>A Impporta nasceu da paixão pela transparência e pelo detalhe. Acreditamos que janelas limpas não apenas melhoram a estética de um espaço, mas também trazem mais luz e bem-estar para o seu dia a dia.</p>
        </div>
      </section>

      <section className="section-padding bg-alt">
        <div className="container fade-up visible">
          <div className="about-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '48px', alignItems: 'center' }}>
            <div>
              <h2 style={{ marginBottom: '24px', fontSize: '2rem' }}>A Nossa Missão</h2>
              <p style={{ marginBottom: '16px', lineHeight: '1.8' }}>A nossa missão é fornecer serviços de limpeza de vidros da mais alta qualidade, utilizando técnicas modernas e produtos ecológicos. Queremos ser a referência de confiança para famílias e empresas em Portugal.</p>
              <p style={{ lineHeight: '1.8' }}>Trabalhamos com rigor, segurança e um compromisso inabalável com a satisfação dos nossos clientes. Cada janela que limpamos é tratada com o máximo de cuidado e profissionalismo.</p>
            </div>
            <div style={{ background: 'var(--surface)', padding: '40px', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}>
              <h3 style={{ marginBottom: '24px', color: 'var(--primary)' }}>Os Nossos Valores</h3>
              <ul style={{ listStyle: 'none', padding: '0', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ color: 'var(--secondary)', fontSize: '1.5rem' }}>✓</span>
                  <strong>Qualidade:</strong> Excelência em cada detalhe.
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ color: 'var(--secondary)', fontSize: '1.5rem' }}>✓</span>
                  <strong>Confiança:</strong> Profissionais experientes e seguros.
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ color: 'var(--secondary)', fontSize: '1.5rem' }}>✓</span>
                  <strong>Sustentabilidade:</strong> Produtos amigos do ambiente.
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ color: 'var(--secondary)', fontSize: '1.5rem' }}>✓</span>
                  <strong>Inovação:</strong> Processo de agendamento 100% digital.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section section-padding text-center" style={{ paddingBottom: '100px' }}>
        <div className="container fade-up visible">
          <h2>Pronto para ver a diferença?</h2>
          <p style={{ marginBottom: '32px' }}>Agende a sua limpeza hoje mesmo e deixe o trabalho connosco.</p>
          <Link href="/#calculator" className="btn btn-primary">Simulador</Link>
        </div>
      </section>
    </main>
  );
}
