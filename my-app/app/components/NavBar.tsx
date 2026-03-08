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

  const links = [
    { name: 'Inicio',       href: '/' },
    { name: 'Habitaciones', href: '/rooms' },
    { name: 'Contacto',     href: '/contact' },
    { name: 'Nosotros',     href: '/about' },
  ];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
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
            ? 'rounded-2xl px-4 py-2.5 md:px-6 md:py-3'
            : 'rounded-none px-5 py-4 md:px-10'
          }`}
        style={{
          backgroundColor: isScrolled
            ? 'rgba(245, 240, 232, 0.88)'
            : 'rgba(245, 240, 232, 0.75)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: isScrolled ? '1px solid rgba(221,213,197,0.6)' : '1px solid rgba(221,213,197,0.3)',
          borderTop: isScrolled ? undefined : 'none',
          borderLeft: isScrolled ? undefined : 'none',
          borderRight: isScrolled ? undefined : 'none',
          boxShadow: isScrolled ? 'var(--shadow-md)' : 'none',
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 shrink-0">
          <Image
            src="/img/Logo.png"
            alt="Logo Quinta Dalam"
            width={40}
            height={40}
            className="w-8 h-8 md:w-9 md:h-9 object-contain"
          />
          <span
            className="font-display font-semibold tracking-wide transition-all duration-300"
            style={{
              fontFamily: 'var(--font-display)',
              color: 'var(--wood-dark)',
              fontSize: isScrolled ? '1.1rem' : '1.2rem',
            }}
          >
            Hotel Quinta Dalam
          </span>
        </div>

        {/* Navigation Capsule */}
        <nav
          ref={navRef}
          className="hidden md:flex relative items-center gap-1 p-1 rounded-full"
          style={{
            backgroundColor: 'rgba(237,232,220,0.8)',
            border: '1px solid rgba(221,213,197,0.5)',
          }}
        >
          {/* Cápsula activa */}
          <div
            className="absolute top-1 bottom-1 rounded-full transition-all duration-500"
            style={{
              left: capsuleStyle.left,
              width: capsuleStyle.width,
              opacity: capsuleStyle.opacity,
              backgroundColor: 'var(--copper)',
              boxShadow: '0 2px 12px rgba(200,129,58,0.35)',
              transitionTimingFunction: 'cubic-bezier(0.23,1,0.32,1)',
            }}
          />
          {links.map((link) => {
            const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className="relative z-10 px-4 py-1.5 text-xs font-medium tracking-wide transition-colors duration-300 rounded-full"
                style={{
                  color: isActive ? '#fff' : 'var(--text-muted)',
                  fontFamily: 'var(--font-ui)',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  fontSize: '0.7rem',
                }}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* CTA + Hamburguesa */}
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="hidden md:block btn-copper"
            style={{ fontSize: '0.68rem', padding: '0.6rem 1.4rem' }}
          >
            Iniciar Sesión
          </Link>
          <button
            className="md:hidden p-2 rounded-full transition-colors"
            style={{ color: 'var(--wood-dark)' }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Menú"
          >
            {isMobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Menú móvil */}
      <div
        className={`md:hidden absolute top-full left-0 right-0 transition-all duration-300 ease-in-out overflow-hidden
          ${isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}
        style={{
          backgroundColor: 'rgba(245,240,232,0.97)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--stone)',
        }}
      >
        <div className="flex flex-col p-4 gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-4 py-3 rounded-xl text-sm font-medium transition-colors"
              style={{
                fontFamily: 'var(--font-ui)',
                color: pathname === link.href ? 'var(--copper)' : 'var(--text-muted)',
                backgroundColor: pathname === link.href ? 'rgba(200,129,58,0.08)' : 'transparent',
                textTransform: 'uppercase',
                fontSize: '0.72rem',
                letterSpacing: '0.05em',
              }}
            >
              {link.name}
            </Link>
          ))}
          <hr className="my-2" style={{ borderColor: 'var(--stone)' }} />
          <Link href="/login" className="btn-copper text-center">
            Iniciar Sesión
          </Link>
        </div>
      </div>
    </header>
  );
}
