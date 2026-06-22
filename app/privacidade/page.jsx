export const metadata = {
  title: 'Política de Privacidade | Impporta',
  description: 'Política de Privacidade e Proteção de Dados da Impporta Limpezas.',
};

export default function Privacidade() {
  return (
    <main className="legal-page fade-up visible">
      <div className="container" style={{ padding: '60px 20px', maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ marginBottom: '32px', color: 'var(--primary)' }}>Política de Privacidade</h1>
        
        <div className="legal-content" style={{ lineHeight: '1.7', color: 'var(--text-main)' }}>
          <p><strong>Última atualização:</strong> Junho de 2026</p>
          <p>A privacidade e a segurança dos dados pessoais dos nossos clientes são uma prioridade para a Impporta. Esta Política de Privacidade explica como recolhemos, usamos, partilhamos e protegemos as suas informações pessoais, de acordo com o Regulamento Geral sobre a Proteção de Dados (RGPD).</p>
          
          <h2 style={{ marginTop: '32px', marginBottom: '16px', fontSize: '1.25rem' }}>1. Dados que Recolhemos</h2>
          <p>Recolhemos os seguintes dados pessoais apenas quando fornecidos voluntariamente durante o processo de agendamento: nome, e-mail, contacto telefónico, e morada do serviço de limpeza.</p>
          
          <h2 style={{ marginTop: '32px', marginBottom: '16px', fontSize: '1.25rem' }}>2. Uso da Informação</h2>
          <p>Os dados recolhidos são utilizados exclusivamente para as seguintes finalidades:</p>
          <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
            <li>Gestão e execução dos agendamentos de limpeza.</li>
            <li>Contacto com o cliente para confirmação, cancelamento ou esclarecimentos do serviço.</li>
            <li>Faturação e processamento de pagamentos.</li>
          </ul>
          
          <h2 style={{ marginTop: '32px', marginBottom: '16px', fontSize: '1.25rem' }}>3. Partilha de Dados</h2>
          <p>Não vendemos, trocamos nem partilhamos os seus dados pessoais com terceiros para fins de marketing. Os seus dados apenas poderão ser partilhados com os parceiros estritamente necessários para a execução do serviço (por exemplo, a plataforma Stripe para processamento de pagamentos, que tem as suas próprias rigorosas políticas de privacidade).</p>
          
          <h2 style={{ marginTop: '32px', marginBottom: '16px', fontSize: '1.25rem' }}>4. Segurança dos Dados</h2>
          <p>Implementamos medidas técnicas e organizativas para garantir a segurança dos seus dados pessoais contra a alteração, perda, tratamento ou acesso não autorizado. Todos os dados são armazenados de forma segura e os pagamentos processados com forte encriptação.</p>
          
          <h2 style={{ marginTop: '32px', marginBottom: '16px', fontSize: '1.25rem' }}>5. Os Seus Direitos</h2>
          <p>De acordo com o RGPD, tem o direito de aceder, retificar, apagar (direito a ser esquecido), e limitar o tratamento dos seus dados pessoais. Pode exercer estes direitos contactando-nos através do e-mail de suporte ou através dos nossos canais de comunicação disponíveis no site.</p>
        </div>
      </div>
    </main>
  );
}
