export const metadata = {
  title: 'Termos e Condições | Impporta',
  description: 'Termos e Condições de Serviço da Impporta Limpezas.',
};

export default function Termos() {
  return (
    <main className="legal-page fade-up visible">
      <div className="container" style={{ padding: '60px 20px', maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ marginBottom: '32px', color: 'var(--primary)' }}>Termos e Condições</h1>
        
        <div className="legal-content" style={{ lineHeight: '1.7', color: 'var(--text-main)' }}>
          <p><strong>Última atualização:</strong> Junho de 2026</p>
          
          <h2 style={{ marginTop: '32px', marginBottom: '16px', fontSize: '1.25rem' }}>1. Âmbito de Aplicação</h2>
          <p>Os presentes Termos e Condições regulam o uso do site e os serviços de limpeza de vidros e janelas prestados pela Impporta Limpezas. Ao utilizar os nossos serviços, o cliente concorda com estes termos.</p>
          
          <h2 style={{ marginTop: '32px', marginBottom: '16px', fontSize: '1.25rem' }}>2. Serviços e Preços</h2>
          <p>Os nossos preços são baseados na contagem de janelas fornecida pelo cliente no momento do agendamento. Caso, no dia do serviço, a nossa equipa verifique uma discrepância entre o número informado e a realidade (conforme os nossos critérios de contagem), o valor será reajustado em conformidade, mediante aprovação do cliente antes de iniciar a limpeza.</p>
          
          <h2 style={{ marginTop: '32px', marginBottom: '16px', fontSize: '1.25rem' }}>3. Cancelamento e Reagendamento</h2>
          <p>O cliente pode cancelar ou reagendar o serviço de forma gratuita até 24 horas antes do horário marcado. Cancelamentos efetuados com menos de 24 horas de antecedência podem estar sujeitos a uma taxa administrativa.</p>
          
          <h2 style={{ marginTop: '32px', marginBottom: '16px', fontSize: '1.25rem' }}>4. Pagamentos</h2>
          <p>Aceitamos pagamentos online (cartão de crédito/débito), MB Way ou pagamento em numerário/cartão diretamente ao profissional no dia do serviço. Todos os pagamentos processados online são seguros e encriptados.</p>
          
          <h2 style={{ marginTop: '32px', marginBottom: '16px', fontSize: '1.25rem' }}>5. Responsabilidades</h2>
          <p>A Impporta compromete-se a executar os serviços de limpeza com o máximo de zelo e profissionalismo. Em caso de algum dano comprovadamente causado pela nossa equipa durante o serviço, a nossa responsabilidade limitar-se-á à reparação ou indemnização de acordo com a nossa apólice de seguro de responsabilidade civil.</p>
          
          <h2 style={{ marginTop: '32px', marginBottom: '16px', fontSize: '1.25rem' }}>6. Alterações aos Termos</h2>
          <p>A Impporta reserva-se o direito de atualizar ou modificar estes Termos e Condições a qualquer momento. Quaisquer alterações entrarão em vigor imediatamente após a sua publicação no site.</p>
        </div>
      </div>
    </main>
  );
}
