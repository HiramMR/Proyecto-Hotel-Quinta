// ============================================================
// NavBar.tsx — Barra de navegación global (Client Component)
//
// Cambios respecto a la versión anterior:
// - Detecta si hay sesión activa con useAuth()
// - Sin sesión: muestra botón "Iniciar Sesión"
// - Con sesión: muestra ícono de usuario con menú desplegable
//   que incluye nombre, correo, y botón de cerrar sesión
// ============================================================
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../../lib/auth-context';

export default function NavBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, isAdmin, loading, signOut } = useAuth();
  const navRef = useRef<HTMLElement>(null);
  const [capsuleStyle, setCapsuleStyle] = useState({ left: 0, width: 0, opacity: 0 });
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isWide, setIsWide] = useState(false);

  // Menú desplegable del usuario
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const links = [
    { name: 'Inicio',       href: '/' },
    { name: 'Habitaciones', href: '/rooms' },
    { name: 'Contacto',     href: '/contact' },
    { name: 'Nosotros',     href: '/about' },
  ];

  // ── Cerrar menú usuario al hacer clic fuera ──
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const check = () => setIsWide(window.innerWidth >= 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    if (!isWide || !navRef.current) return;
    const activeLink = Array.from(navRef.current.querySelectorAll('a')).find(link => {
      const href = link.getAttribute('href');
      if (href === '/') return pathname === '/';
      return pathname.startsWith(href || '');
    });
    if (activeLink) {
      const { offsetLeft, offsetWidth } = activeLink as HTMLElement;
      setCapsuleStyle({ left: offsetLeft, width: offsetWidth, opacity: 1 });
    }
  }, [isWide, pathname]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setIsMounted(true); }, []);

  useEffect(() => {
    const updateCapsule = () => {
      if (!navRef.current) return;
      const activeLink = Array.from(navRef.current.querySelectorAll('a')).find(link => {
        const href = link.getAttribute('href');
        if (href === '/') return pathname === '/';
        return pathname.startsWith(href || '');
      });
      if (activeLink) {
        const { offsetLeft, offsetWidth } = activeLink as HTMLElement;
        setCapsuleStyle({ left: offsetLeft, width: offsetWidth, opacity: 1 });
      } else {
        setCapsuleStyle(prev => ({ ...prev, opacity: 0 }));
      }
    };
    updateCapsule();
    window.addEventListener('resize', updateCapsule);
    return () => window.removeEventListener('resize', updateCapsule);
  }, [pathname]);

  // ── Nombre para mostrar en el menú ──
  const displayName = profile?.nombre
    ? `${profile.nombre} ${profile.apellido ?? ''}`.trim()
    : user?.email ?? '';

  // ── Inicial del avatar ──
  const initial = profile?.nombre
    ? profile.nombre.charAt(0).toUpperCase()
    : user?.email?.charAt(0).toUpperCase() ?? '?';

  const handleSignOut = async () => {
    setUserMenuOpen(false);
    await signOut();
    router.push('/');
  };

  return (
    <header
      className={`fixed z-50 transition-all duration-700 ease-in-out
        ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}
        ${isScrolled
          ? 'top-3 left-0 right-0 mx-auto max-w-6xl px-4 md:px-6'
          : 'top-0 left-0 right-0 w-full'
        }`}
    >
      <div
        className={`flex items-center justify-between transition-all duration-500
          ${isScrolled
            ? 'rounded-2xl px-3 py-2 md:px-6 md:py-3'
            : 'rounded-none px-4 py-3 md:px-10 md:py-4'
          }`}
        style={{
          backgroundColor: isScrolled ? 'rgba(245,240,232,0.88)' : 'rgba(245,240,232,0.75)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: isScrolled ? '1px solid rgba(221,213,197,0.6)' : '1px solid rgba(221,213,197,0.3)',
          borderTop: isScrolled ? undefined : 'none',
          borderLeft: isScrolled ? undefined : 'none',
          borderRight: isScrolled ? undefined : 'none',
          boxShadow: isScrolled ? 'var(--shadow-md)' : 'none',
        }}
      >
        {/* ── LOGO ── */}
        <div className="flex items-center gap-1.5 shrink-0">
          <Image src="/img/Logo.png" alt="Logo Quinta Dalam" width={36} height={36}
            className="w-7 h-7 lg:w-9 lg:h-9 object-contain" />
          <span className="font-display font-semibold tracking-wide transition-all duration-300"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--wood-dark)', fontSize: 'clamp(0.9rem, 2vw, 1.1rem)' }}>
            Hotel Quinta Dalam
          </span>
        </div>

        {/* ── NAV DESKTOP ── */}
        {isWide && (
          <nav ref={navRef} className="flex relative items-center gap-1 p-1 rounded-full"
            style={{ backgroundColor: 'rgba(237,232,220,0.8)', border: '1px solid rgba(221,213,197,0.5)' }}>
            <div className="absolute top-1 bottom-1 rounded-full transition-all duration-500"
              style={{
                left: capsuleStyle.left, width: capsuleStyle.width, opacity: capsuleStyle.opacity,
                backgroundColor: 'var(--copper)', boxShadow: '0 2px 12px rgba(200,129,58,0.35)',
                transitionTimingFunction: 'cubic-bezier(0.23,1,0.32,1)',
              }} />
            {links.map((link) => {
              const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
              return (
                <Link key={link.href} href={link.href}
                  className="relative z-10 px-4 py-1.5 text-xs font-medium tracking-wide transition-colors duration-300 rounded-full"
                  style={{ color: isActive ? '#fff' : 'var(--text-muted)', fontFamily: 'var(--font-ui)', letterSpacing: '0.04em', textTransform: 'uppercase', fontSize: '0.7rem' }}>
                  {link.name}
                </Link>
              );
            })}
          </nav>
        )}

        {/* ── SECCIÓN DERECHA ── */}
        <div className="flex items-center gap-1.5">

          {/* Links compactos móvil */}
          {!isWide && (
            <div className="flex items-center gap-1 p-1 rounded-full"
              style={{ backgroundColor: 'rgba(237,232,220,0.8)', border: '1px solid rgba(221,213,197,0.5)' }}>
              {links.map((link) => {
                const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
                return (
                  <Link key={link.href} href={link.href}
                    className="px-2.5 py-1 rounded-full font-medium transition-colors duration-300"
                    style={{ fontFamily: 'var(--font-ui)', fontSize: '0.6rem', letterSpacing: '0.04em', textTransform: 'uppercase', color: isActive ? '#fff' : 'var(--text-muted)', backgroundColor: isActive ? 'var(--copper)' : 'transparent', boxShadow: isActive ? '0 2px 12px rgba(200,129,58,0.35)' : 'none', whiteSpace: 'nowrap' }}>
                    {link.name}
                  </Link>
                );
              })}
            </div>
          )}

          {/* ── SIN SESIÓN: botón login ── */}
          {!user && isWide && (
            <Link href="/login" className="btn-copper" style={{ fontSize: '0.68rem', padding: '0.6rem 1.4rem' }}>
              Iniciar Sesión
            </Link>
          )}
          {!user && !isWide && (
            <Link href="/login"
              className="inline-flex items-center justify-center rounded-full transition-colors shrink-0"
              style={{ backgroundColor: 'var(--copper)', color: '#fff', width: '2rem', height: '2rem' }}
              aria-label="Iniciar sesión">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
              </svg>
            </Link>
          )}

          {/* ── CON SESIÓN: avatar + menú desplegable ── */}
          {user && (
            <div className="relative" ref={userMenuRef}>
              {/* Botón avatar */}
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="inline-flex items-center justify-center rounded-full font-bold transition-all duration-200 shrink-0"
                style={{
                  width: isWide ? '2.2rem' : '2rem',
                  height: isWide ? '2.2rem' : '2rem',
                  backgroundColor: 'var(--copper)',
                  color: '#fff',
                  fontFamily: 'var(--font-display)',
                  fontSize: isWide ? '1rem' : '0.85rem',
                  boxShadow: userMenuOpen ? '0 0 0 3px rgba(200,129,58,0.3)' : 'none',
                }}
                aria-label="Menú de usuario">
                {initial}
              </button>

              {/* Menú desplegable */}
              {userMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-64 rounded-2xl overflow-hidden"
                  style={{
                    backgroundColor: 'var(--cream)',
                    border: '1px solid var(--stone)',
                    boxShadow: 'var(--shadow-lg)',
                    zIndex: 100,
                    animation: 'fadeUp 0.2s ease both',
                  }}>

                  {/* Info del usuario */}
                  <div className="px-4 py-4 border-b" style={{ borderColor: 'var(--stone)' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0"
                        style={{ backgroundColor: 'var(--copper)', color: '#fff', fontFamily: 'var(--font-display)', fontSize: '1.1rem' }}>
                        {initial}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate" style={{ color: 'var(--charcoal)', fontFamily: 'var(--font-ui)' }}>
                          {displayName}
                        </p>
                        <p className="text-xs truncate" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Opciones del menú */}
                  <div className="py-2">
                    {/* Link al panel admin — solo visible para admins */}
                    {isAdmin && (
                      <Link href="/admin"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors w-full text-left"
                        style={{ color: 'var(--charcoal)', fontFamily: 'var(--font-ui)' }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--cream-dark)'}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4" style={{ color: 'var(--copper)' }}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Panel de administración
                      </Link>
                    )}
                    <Link href="/account?tab=profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors w-full text-left"
                      style={{ color: 'var(--charcoal)', fontFamily: 'var(--font-ui)' }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--cream-dark)'}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4" style={{ color: 'var(--copper)' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                      </svg>
                      Mi perfil
                    </Link>
                    <Link href="/account?tab=reservations"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors w-full text-left"
                      style={{ color: 'var(--charcoal)', fontFamily: 'var(--font-ui)' }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--cream-dark)'}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4" style={{ color: 'var(--copper)' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                      </svg>
                      Mis reservaciones
                    </Link>
                  </div>

                  {/* Cerrar sesión */}
                  <div className="border-t py-2" style={{ borderColor: 'var(--stone)' }}>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors w-full text-left"
                      style={{ color: '#c03c3c', fontFamily: 'var(--font-ui)' }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(200,60,60,0.06)'}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                      </svg>
                      Cerrar sesión
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}