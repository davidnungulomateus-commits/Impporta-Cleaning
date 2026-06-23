'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabase';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async (e) => {
    e.preventDefault();
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
  };

  const renderAuthSection = () => {
    if (user) {
      const avatarUrl = user.user_metadata?.avatar_url;
      const initials = (user.user_metadata?.full_name || user.email || 'U').substring(0, 2).toUpperCase();
      const isAdmin = user.email === 'david.nungulo.mateus@gmail.com';

      return (
        <div className="user-dropdown">
          <button className="user-avatar">
            {avatarUrl ? <img src={avatarUrl} alt="Avatar" /> : initials}
          </button>
          <div className="user-dropdown-content">
            <Link href="/dashboard" onClick={closeMobileMenu}>O meu Painel</Link>
            {isAdmin && <Link href="/admin" onClick={closeMobileMenu} style={{ color: 'var(--accent-color)' }}>Painel Admin</Link>}
            <a href="#" onClick={(e) => { closeMobileMenu(); handleLogout(e); }}>Sair</a>
          </div>
        </div>
      );
    }

    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button 
          className="btn btn-outline" 
          onClick={() => { closeMobileMenu(); handleGoogleLogin(); }}
        >
          Entrar
        </button>
        <Link 
          href="/#calculator"
          className="btn btn-primary" 
          onClick={closeMobileMenu}
        >
          Agendar
        </Link>
      </div>
    );
  };

  return (
    <nav className="navbar">
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', flexWrap: 'wrap' }}>
        <Link href="/" className="nav-brand" onClick={closeMobileMenu}>
          <img src="/logo.svg" alt="Impporta Logo" />
        </Link>
        
        {/* Hamburger Icon */}
        <button 
          className="hamburger-btn" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Menu"
        >
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>

        <div className={`nav-links-container ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          <ul className="nav-menu">
            <li><Link href="/#services" className="nav-link" onClick={closeMobileMenu}>O Que Fazemos</Link></li>
            <li><Link href="/#process" className="nav-link" onClick={closeMobileMenu}>Como Funciona</Link></li>
            <li><Link href="/#calculator" className="nav-link" onClick={closeMobileMenu}>Simulador</Link></li>
            <li><Link href="/#calendar" className="nav-link" onClick={closeMobileMenu}>Agendamento</Link></li>
            <li><Link href="/about" className="nav-link" onClick={closeMobileMenu}>Quem Somos</Link></li>
          </ul>
          <div className="nav-actions" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <a 
              href="https://wa.me/351927322095" 
              target="_blank" 
              rel="noopener noreferrer"
              className="whatsapp-nav-link"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#25D366', fontWeight: '600', textDecoration: 'none' }}
              onClick={closeMobileMenu}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.663-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51h-.57c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              <span className="whatsapp-text">WhatsApp</span>
            </a>
            {renderAuthSection()}
          </div>
        </div>
      </div>
    </nav>
  );
}
