'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabase';

export default function Navbar() {
  const [user, setUser] = useState(null);

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
            <Link href="/dashboard">O meu Painel</Link>
            {isAdmin && <Link href="#admin" style={{ color: 'var(--accent-color)' }}>Painel Admin</Link>}
            <a href="#" onClick={handleLogout}>Sair</a>
          </div>
        </div>
      );
    }

    return (
      <Link href="/auth" className="btn btn-outline">Entrar</Link>
    );
  };

  return (
    <nav className="navbar">
      <div className="container">
        <Link href="/" className="nav-brand">
          <img src="/logo.svg" alt="Impporta Logo" />
        </Link>
        <ul className="nav-menu">
          <li><Link href="/#services" className="nav-link">O Que Fazemos</Link></li>
          <li><Link href="/#process" className="nav-link">Como Funciona</Link></li>
          <li><Link href="/#calculator" className="nav-link">Simulador</Link></li>
          <li><Link href="/#calendar" className="nav-link">Agendamento</Link></li>
          <li><Link href="/about" className="nav-link">Quem Somos</Link></li>
        </ul>
        <div className="nav-actions">
          {renderAuthSection()}
        </div>
      </div>
    </nav>
  );
}
