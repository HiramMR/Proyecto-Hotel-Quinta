// ============================================================
// NavBar.tsx — Barra de navegación global (Client Component)
// 'use client' es necesario porque usa hooks de React y eventos
// del navegador (scroll, resize, pathname).
//
// Comportamiento:
// - Al cargar: aparece con fade desde arriba (isMounted)
// - En reposo (top): barra semitransparente de ancho completo
// - Al hacer scroll > 50px: se convierte en cápsula flotante centrada
// - Cápsula naranja deslizante que indica la página activa
// - En pantallas < 640px: cambia a modo compacto (links pequeños + ícono)
// ============================================================
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function NavBar() {
  // pathname: ruta actual (ej. "/rooms"), para saber qué link está activo
  const pathname = usePathname();

  // navRef: referencia al <nav> para medir posición de los links
  // y calcular dónde colocar la cápsula naranja animada
  const navRef = useRef<HTMLElement>(null);

  // capsuleStyle: posición (left) y ancho del link activo.
  // La cápsula naranja se mueve con CSS transition usando estos valores.
  const [capsuleStyle, setCapsuleStyle] = useState({ left: 0, width: 0, opacity: 0 });

  // isScrolled: true cuando el usuario bajó más de 50px.
  // Cambia el estilo del navbar (de barra a cápsula flotante).
  const [isScrolled, setIsScrolled] = useState(false);

  // isMounted: false en el primer render del servidor, true después.
  // Sirve para activar la animación de entrada (fade + slide from top).
  const [isMounted, setIsMounted] = useState(false);

  // isMobileMenuOpen: controla si el menú hamburguesa está abierto (legacy, no se usa actualmente)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // isWide: true si la ventana tiene 640px o más.
  // Controla si mostrar el nav desktop o el nav compacto móvil.
  const [isWide, setIsWide] = useState(false);

  // ── Detectar ancho de pantalla ──
  // Se ejecuta al montar y cada vez que cambia el tamaño de ventana.
  // Usamos JS puro porque las clases de Tailwind (xl:hidden) no
  // se generan de forma confiable en Tailwind v4 con Next.js.
  useEffect(() => {
    const check = () => setIsWide(window.innerWidth >= 640);
    check(); // Ejecutar inmediatamente al montar
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check); // Limpiar listener
  }, []);

  // ── Recalcular cápsula cuando aparece el nav desktop ──
  // Cuando isWide cambia de false a true, el <nav> se renderiza por primera vez.
  // En ese momento medimos la posición del link activo para posicionar la cápsula.
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

  // ── Links de navegación ──
  const links = [
    { name: 'Inicio',       href: '/' },
    { name: 'Habitaciones', href: '/rooms' },
    { name: 'Contacto',     href: '/contact' },
    { name: 'Nosotros',     href: '/about' },
  ];

  // ── Listener de scroll ──
  // { passive: true } mejora el rendimiento en móvil: le dice al navegador
  // que este listener nunca llama preventDefault(), así puede optimizar el scroll.
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Verificar posición inicial
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ── Animación de entrada ──
  // Se activa inmediatamente al montar el componente en el cliente.
  useEffect(() => { setIsMounted(true); }, []);

  // ── Actualizar posición de la cápsula ──
  // Se dispara cuando cambia la ruta (pathname) o cuando cambia el tamaño de ventana.
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

  // ── Cerrar menú móvil al navegar ──
  useEffect(() => { setIsMobileMenuOpen(false); }, [pathname]);

  return (
    <header
      className={`fixed z-50 transition-all duration-700 ease-in-out
        ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}
        ${isScrolled
          // Con scroll: centrado, ancho máximo, con padding horizontal
          ? 'top-3 left-0 right-0 mx-auto max-w-6xl px-4 md:px-6'
          // Sin scroll: ocupa todo el ancho de la pantalla
          : 'top-0 left-0 right-0 w-full'
        }`}
    >
      <div
        className={`flex items-center justify-between transition-all duration-500
          ${isScrolled
            ? 'rounded-2xl px-3 py-2 md:px-6 md:py-3'  // Cápsula flotante
            : 'rounded-none px-4 py-3 md:px-10 md:py-4' // Barra completa
          }`}
        style={{
          // Fondo semitransparente con blur (efecto "glassmorphism")
          backgroundColor: isScrolled ? 'rgba(245,240,232,0.88)' : 'rgba(245,240,232,0.75)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)', // Necesario para Safari
          // Con scroll: borde completo. Sin scroll: solo borde inferior
          border: isScrolled ? '1px solid rgba(221,213,197,0.6)' : '1px solid rgba(221,213,197,0.3)',
          borderTop: isScrolled ? undefined : 'none',
          borderLeft: isScrolled ? undefined : 'none',
          borderRight: isScrolled ? undefined : 'none',
          boxShadow: isScrolled ? 'var(--shadow-md)' : 'none',
        }}
      >
        {/* ── LOGO ── */}
        <div className="flex items-center gap-1.5 shrink-0">
          <Image
            src="/img/Logo.png"
            alt="Logo Quinta Dalam"
            width={36}
            height={36}
            // Más pequeño en móvil (w-7) para ahorrar espacio
            className="w-7 h-7 lg:w-9 lg:h-9 object-contain"
          />
          <span
            className="font-display font-semibold tracking-wide transition-all duration-300"
            style={{
              fontFamily: 'var(--font-display)',
              color: 'var(--wood-dark)',
              // clamp() escala el tamaño automáticamente según el ancho de ventana
              fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
            }}
          >
            Hotel Quinta Dalam
          </span>
        </div>

        {/* ── NAV DESKTOP (solo cuando isWide = true, es decir >= 640px) ──
            Contiene la cápsula naranja animada que indica la página activa. */}
        {isWide && (
          <nav
            ref={navRef} // Referencia para medir posición de los links
            className="flex relative items-center gap-1 p-1 rounded-full"
            style={{ backgroundColor: 'rgba(237,232,220,0.8)', border: '1px solid rgba(221,213,197,0.5)' }}
          >
            {/* Cápsula naranja que se desliza al link activo.
                Su posición (left, width) se actualiza dinámicamente con JS. */}
            <div
              className="absolute top-1 bottom-1 rounded-full transition-all duration-500"
              style={{
                left: capsuleStyle.left,
                width: capsuleStyle.width,
                opacity: capsuleStyle.opacity,
                backgroundColor: 'var(--copper)',
                boxShadow: '0 2px 12px rgba(200,129,58,0.35)',
                // Easing tipo "spring" para el movimiento de la cápsula
                transitionTimingFunction: 'cubic-bezier(0.23,1,0.32,1)',
              }}
            />
            {/* Links de navegación */}
            {links.map((link) => {
              const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
              return (
                <Link key={link.href} href={link.href}
                  // z-10 para que el texto quede encima de la cápsula de fondo
                  className="relative z-10 px-4 py-1.5 text-xs font-medium tracking-wide transition-colors duration-300 rounded-full"
                  style={{
                    color: isActive ? '#fff' : 'var(--text-muted)', // Blanco si activo
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
        )}

        {/* ── SECCIÓN DERECHA: botón de sesión + links compactos en móvil ── */}
        <div className="flex items-center gap-1.5">

          {/* Links compactos (modo móvil, < 640px).
              Se muestran en la barra directamente en lugar del menú hamburguesa,
              con la misma estética de cápsula que el nav desktop pero más pequeños. */}
          {!isWide && (
            <div className="flex items-center gap-1 p-1 rounded-full"
              style={{ backgroundColor: 'rgba(237,232,220,0.8)', border: '1px solid rgba(221,213,197,0.5)' }}>
              {links.map((link) => {
                const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
                return (
                  <Link key={link.href} href={link.href}
                    className="px-2.5 py-1 rounded-full font-medium transition-colors duration-300"
                    style={{
                      fontFamily: 'var(--font-ui)',
                      fontSize: '0.6rem',       // Más pequeño que el desktop
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

          {/* Botón "Iniciar Sesión" — solo en desktop (>= 640px) */}
          {isWide && (
            <Link href="/login" className="btn-copper" style={{ fontSize: '0.68rem', padding: '0.6rem 1.4rem' }}>
              Iniciar Sesión
            </Link>
          )}

          {/* Ícono de sesión circular — solo en móvil (< 640px)
              Reemplaza al botón grande para ahorrar espacio */}
          {!isWide && (
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-full transition-colors shrink-0"
              style={{ backgroundColor: 'var(--copper)', color: '#fff', width: '2rem', height: '2rem' }}
              aria-label="Iniciar sesión"
            >
              {/* Ícono de login (flecha de entrada) */}
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