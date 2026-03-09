'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function NavBar() {
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);
  const [capsuleStyle, setCapsuleStyle] = useState({ left: 0, width: 0, opacity: 0 });
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isWide, setIsWide] = useState(false);

  useEffect(() => {
    const check = () => setIsWide(window.innerWidth >= 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Recalcular cápsula cuando el nav aparece (isWide cambia a true)
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

  const links = [
    { name: 'Inicio',       href: '/' },
    { name: 'Habitaciones', href: '/rooms' },
    { name: 'Contacto',     href: '/contact' },
    { name: 'Nosotros',     href: '/about' },
  ];

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

  useEffect(() => { setIsMobileMenuOpen(false); }, [pathname]);

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
        {/* ── LOGO — más pequeño en móvil ── */}
        <div className="flex items-center gap-1.5 shrink-0">
          <Image
            src="/img/Logo.png"
            alt="Logo Quinta Dalam"
            width={36}
            height={36}
            className="w-7 h-7 lg:w-9 lg:h-9 object-contain"
          />
          <span
            className="font-display font-semibold tracking-wide transition-all duration-300"
            style={{
              fontFamily: 'var(--font-display)',
              color: 'var(--wood-dark)',
              fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
            }}
          >
            Hotel Quinta Dalam
          </span>
        </div>

        {/* ── NAV desktop ── */}
        {isWide && (
          <nav
            ref={navRef}
            className="flex relative items-center gap-1 p-1 rounded-full"
            style={{ backgroundColor: 'rgba(237,232,220,0.8)', border: '1px solid rgba(221,213,197,0.5)' }}
          >
            <div
              className="absolute top-1 bottom-1 rounded-full transition-all duration-500"
              style={{
                left: capsuleStyle.left, width: capsuleStyle.width, opacity: capsuleStyle.opacity,
                backgroundColor: 'var(--copper)', boxShadow: '0 2px 12px rgba(200,129,58,0.35)',
                transitionTimingFunction: 'cubic-bezier(0.23,1,0.32,1)',
              }}
            />
            {links.map((link) => {
              const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
              return (
                <Link key={link.href} href={link.href}
                  className="relative z-10 px-4 py-1.5 text-xs font-medium tracking-wide transition-colors duration-300 rounded-full"
                  style={{ color: isActive ? '#fff' : 'var(--text-muted)', fontFamily: 'var(--font-ui)', letterSpacing: '0.04em', textTransform: 'uppercase', fontSize: '0.7rem' }}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>
        )}

        {/* ── DERECHA ── */}
        <div className="flex items-center gap-1.5">

          {/* Links compactos — solo cuando < 640px */}
          {!isWide && (
            <div className="flex items-center gap-1 p-1 rounded-full" style={{ backgroundColor: 'rgba(237,232,220,0.8)', border: '1px solid rgba(221,213,197,0.5)' }}>
              {links.map((link) => {
                const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
                return (
                  <Link key={link.href} href={link.href}
                    className="px-2.5 py-1 rounded-full font-medium transition-colors duration-300"
                    style={{
                      fontFamily: 'var(--font-ui)',
                      fontSize: '0.6rem',
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                      color: isActive ? '#fff' : 'var(--text-muted)',
                      backgroundColor: isActive ? 'var(--copper)' : 'transparent',
                      boxShadow: isActive ? '0 2px 12px rgba(200,129,58,0.35)' : 'none',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>
          )}

          {/* Botón grande — solo >= 1280px */}
          {isWide && (
            <Link href="/login" className="btn-copper" style={{ fontSize: '0.68rem', padding: '0.6rem 1.4rem' }}>
              Iniciar Sesión
            </Link>
          )}

          {/* Ícono — solo < 1280px */}
          {!isWide && (
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-full transition-colors shrink-0"
              style={{ backgroundColor: 'var(--copper)', color: '#fff', width: '2rem', height: '2rem' }}
              aria-label="Iniciar sesión"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
              </svg>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}