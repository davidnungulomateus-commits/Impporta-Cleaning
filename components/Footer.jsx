import Link from 'next/link';

export default function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <Link href="/"><img src="/logo.svg" alt="Impporta Logo" style={{ height: '32px' }} /></Link>
          </div>
          <div className="footer-links">
            <Link href="/#services">O Que Fazemos</Link>
            <Link href="/#process">Como Funciona</Link>
            <Link href="/#calculator">Simulador</Link>
            <Link href="/#calendar">Agendamento</Link>
            <Link href="/about">Quem Somos</Link>
          </div>
        </div>
        <div className="footer-legal-links">
          <Link href="/termos">Termos e Condições</Link>
          <Link href="/privacidade">Política de Privacidade</Link>
          <a href="https://www.livroreclamacoes.pt/" target="_blank" rel="noopener noreferrer">Livro de Reclamações</a>
          <Link href="/resolucao-litigios">Resolução de Litígios</Link>
        </div>
        <div className="footer-bottom">
          &copy; 2026 Impporta. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
