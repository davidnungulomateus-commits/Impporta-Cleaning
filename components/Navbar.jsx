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
      <button 
        type="button" 
        className="btn btn-outline" 
        onClick={() => { closeMobileMenu(); handleGoogleLogin(); }}
        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        Continuar com Google
      </button>
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
          <div className="nav-actions">
            {renderAuthSection()}
          </div>
        </div>
      </div>
    </nav>
  );
}
