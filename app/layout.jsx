import './globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export const metadata = {
  title: 'Impporta - Especialistas em Limpeza de Vidros e Janelas',
  description: 'A Impporta oferece serviços profissionais de limpeza de vidros e janelas para residências, escritórios e supermercados.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
