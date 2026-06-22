export const metadata = {
  title: 'Resolução de Litígios | Impporta',
  description: 'Informação sobre Entidades de Resolução Alternativa de Litígios de Consumo (RAL).',
};

export default function ResolucaoLitigios() {
  return (
    <main className="legal-page fade-up visible">
      <div className="container" style={{ padding: '60px 20px', maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ marginBottom: '32px', color: 'var(--primary)' }}>Resolução Alternativa de Litígios</h1>
        
        <div className="legal-content" style={{ lineHeight: '1.7', color: 'var(--text-main)' }}>
          <p>Em caso de litígio de consumo, de acordo com o estabelecido na Lei n.º 144/2015, de 8 de setembro, o consumidor pode recorrer a uma Entidade de Resolução Alternativa de Litígios de Consumo (RAL).</p>
          
          <h2 style={{ marginTop: '32px', marginBottom: '16px', fontSize: '1.25rem' }}>O que é a Resolução Alternativa de Litígios?</h2>
          <p>A Resolução Alternativa de Litígios de Consumo disponibiliza aos consumidores uma forma acessível, rápida e simples para a resolução dos seus problemas sem necessidade de recorrer aos tribunais. Em Portugal, existem diversas entidades que podem auxiliar na mediação ou arbitragem.</p>
          
          <h2 style={{ marginTop: '32px', marginBottom: '16px', fontSize: '1.25rem' }}>Onde posso recorrer?</h2>
          <p>Abaixo indicamos os links para as plataformas oficiais onde poderá obter mais informações e submeter o seu processo, caso necessário:</p>
          
          <ul style={{ paddingLeft: '20px', marginBottom: '32px' }}>
            <li style={{ marginBottom: '12px' }}>
              <strong>Portal do Consumidor (Direção-Geral do Consumidor):</strong><br />
              <a href="https://www.consumidor.gov.pt/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>www.consumidor.gov.pt</a>
            </li>
            <li style={{ marginBottom: '12px' }}>
              <strong>Centro Nacional de Informação e Arbitragem de Conflitos de Consumo (CNIACC):</strong><br />
              <a href="https://www.cniacc.pt/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>www.cniacc.pt</a>
            </li>
            <li>
              <strong>Plataforma Europeia de Resolução de Litígios em Linha (RLL):</strong><br />
              <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>ec.europa.eu/consumers/odr/</a>
            </li>
          </ul>

          <p>A Impporta está sempre ao dispor para resolver qualquer questão ou insatisfação através dos nossos canais de apoio, privilegiando sempre uma resolução amigável em primeiro lugar.</p>
        </div>
      </div>
    </main>
  );
}
