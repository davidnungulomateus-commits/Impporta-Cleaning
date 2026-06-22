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
      <Link href="/auth" className="btn btn-outline" onClick={closeMobileMenu}>Entrar</Link>
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
