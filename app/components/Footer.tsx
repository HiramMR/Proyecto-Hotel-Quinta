// ============================================================
// Footer.tsx — Pie de página global (Client Component)
// 'use client' necesario para el año dinámico y el estado
// de la suscripción al newsletter.
//
// Secciones:
// 1. Logo + descripción del hotel
// 2. Navegación rápida
// 3. Información de contacto
// 4. Newsletter
// 5. Barra inferior: copyright + redes sociales + políticas
// ============================================================
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';

// ── Hook useInView para animar el footer al entrar en viewport ──
function useInView(threshold = 0.08) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, visible };
}

// ── Columna animada con delay escalonado ──
function FadeCol({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, visible } = useInView();
  return (
    <div ref={ref} className={`transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) { setSubscribed(true); setEmail(''); }
  };

  const navLinks = [
    { name: 'Inicio',       href: '/' },
    { name: 'Habitaciones', href: '/rooms' },
    { name: 'Nosotros',     href: '/about' },
    { name: 'Contacto',     href: '/contact' },
  ];

  const policies = [
    { name: 'Política de privacidad', href: '#' },
    { name: 'Términos y condiciones', href: '#' },
    { name: 'Política de cancelación', href: '#' },
  ];

  const socialLinks = [
    {
      name: 'Instagram',
      href: '#',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      ),
    },
    {
      name: 'Facebook',
      href: '#',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
    },
    {
      name: 'Whatsapp',
      href: '#',
      icon: (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      ),
    },
  ];

  return (
    <footer style={{ backgroundColor: 'var(--charcoal)', color: 'var(--cream)' }}>

      {/* ── Línea decorativa superior ── */}
      <div className="h-px w-full" style={{ background: 'linear-gradient(to right, transparent, var(--copper), transparent)' }} />

      {/* ── Cuerpo principal del footer ── */}
      <div className="container mx-auto px-6 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">

          {/* ── COLUMNA 1: Logo + descripción ── */}
          <FadeCol delay={0} className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-5">
              <Image src="/img/Logo.png" alt="Logo Hotel Quinta Dalam" width={36} height={36}
                className="w-9 h-9 object-contain" />
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 600, color: 'var(--cream)' }}>
                Hotel Quinta Dalam
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-6"
              style={{ fontFamily: 'var(--font-body)', color: 'rgba(245,240,232,0.55)', fontStyle: 'italic' }}>
              Un refugio de lujo donde la tradición michoacana y el confort contemporáneo se encuentran.
            </p>
            {/* Estrellas de calificación */}
            <div className="flex items-center gap-1 mb-4">
              {[1,2,3,4,5].map(i => (
                <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                  className="w-4 h-4" style={{ color: 'var(--copper)' }}>
                  <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354l-4.543 2.826c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                </svg>
              ))}
              <span className="text-xs ml-2" style={{ color: 'rgba(245,240,232,0.45)', fontFamily: 'var(--font-ui)' }}>
                Hotel Boutique
              </span>
            </div>
            {/* Redes sociales */}
            <div className="flex gap-3 mt-2">
              {socialLinks.map(s => (
                <a key={s.name} href={s.href} aria-label={s.name}
                  className="inline-flex items-center justify-center rounded-full transition-all duration-300"
                  style={{ width: '2rem', height: '2rem', backgroundColor: 'rgba(245,240,232,0.08)', color: 'rgba(245,240,232,0.5)', border: '1px solid rgba(245,240,232,0.12)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--copper)'; (e.currentTarget as HTMLElement).style.color = '#fff'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--copper)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(245,240,232,0.08)'; (e.currentTarget as HTMLElement).style.color = 'rgba(245,240,232,0.5)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(245,240,232,0.12)'; }}>
                  {s.icon}
                </a>
              ))}
            </div>
          </FadeCol>

          {/* ── COLUMNA 2: Navegación rápida ── */}
          <FadeCol delay={100}>
            <p className="text-xs uppercase tracking-[0.25em] font-semibold mb-6"
              style={{ color: 'var(--copper)', fontFamily: 'var(--font-ui)' }}>
              Navegación
            </p>
            <ul className="space-y-3">
              {navLinks.map(link => (
                <li key={link.href}>
                  <Link href={link.href}
                    className="flex items-center gap-2 text-sm transition-all duration-300 group"
                    style={{ color: 'rgba(245,240,232,0.55)', fontFamily: 'var(--font-ui)' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--cream)'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(245,240,232,0.55)'}>
                    <span className="inline-block transition-transform duration-300 group-hover:translate-x-1"
                      style={{ color: 'var(--copper)', fontSize: '0.6rem' }}>▶</span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

          </FadeCol>

          {/* ── COLUMNA 3: Contacto + Check-in ── */}
          <FadeCol delay={200}>
            <p className="text-xs uppercase tracking-[0.25em] font-semibold mb-6"
              style={{ color: 'var(--copper)', fontFamily: 'var(--font-ui)' }}>
              Contacto
            </p>
            <div className="space-y-4">
              {[
                {
                  icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 shrink-0 mt-0.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/></svg>,
                  label: 'Dirección',
                  value: 'Quencio, Municipio de Coeneo\nMichoacán, México'
                },
                {
                  icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 shrink-0 mt-0.5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"/></svg>,
                  label: 'Teléfono',
                  value: '+52 (434) 342-0000\n+52 (434) 342-0001'
                },
                {
                  icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 shrink-0 mt-0.5"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/></svg>,
                  label: 'Correo',
                  value: 'reservaciones@quintadalam.com\ncontacto@quintadalam.com'
                },
              ].map(item => (
                <div key={item.label} className="flex gap-3">
                  <span style={{ color: 'var(--copper)' }}>{item.icon}</span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest mb-1"
                      style={{ color: 'rgba(245,240,232,0.35)', fontFamily: 'var(--font-ui)' }}>
                      {item.label}
                    </p>
                    <p className="text-sm leading-relaxed whitespace-pre-line"
                      style={{ color: 'rgba(245,240,232,0.65)', fontFamily: 'var(--font-body)' }}>
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Horarios de check-in/out */}
            <div className="mt-12 p-4 rounded-lg" style={{ backgroundColor: 'rgba(245,240,232,0.05)', border: '1px solid rgba(245,240,232,0.1)' }}>
              <p className="text-xs uppercase tracking-widest font-semibold mb-3" style={{ color: 'var(--copper)', fontFamily: 'var(--font-ui)' }}>
                Horarios
              </p>
              <div className="flex justify-between text-xs" style={{ fontFamily: 'var(--font-ui)' }}>
                <div>
                  <p style={{ color: 'rgba(245,240,232,0.4)' }}>Check-in</p>
                  <p className="font-semibold mt-0.5" style={{ color: 'var(--cream)' }}>3:00 PM</p>
                </div>
                <div className="h-8 w-px self-center" style={{ backgroundColor: 'rgba(245,240,232,0.15)' }} />
                <div>
                  <p style={{ color: 'rgba(245,240,232,0.4)' }}>Check-out</p>
                  <p className="font-semibold mt-0.5" style={{ color: 'var(--cream)' }}>12:00 PM</p>
                </div>
                <div className="h-8 w-px self-center" style={{ backgroundColor: 'rgba(245,240,232,0.15)' }} />
                <div>
                  <p style={{ color: 'rgba(245,240,232,0.4)' }}>Recepción</p>
                  <p className="font-semibold mt-0.5" style={{ color: 'var(--cream)' }}>24 hrs</p>
                </div>
              </div>
            </div>
          </FadeCol>

          <FadeCol delay={300}>
            {/* Garantía de reserva directa */}
            <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgba(200,129,58,0.07)', border: '1px solid rgba(200,129,58,0.2)' }}>
              <div className="flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                  className="w-5 h-5 shrink-0 mt-0.5" style={{ color: 'var(--copper)' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--copper)', fontFamily: 'var(--font-ui)' }}>
                    Mejor precio garantizado
                  </p>
                  <p className="text-xs leading-relaxed" style={{ color: 'rgba(245,240,232,0.45)', fontFamily: 'var(--font-body)' }}>
                    Reserva directamente con nosotros y obtén el mejor precio disponible.
                  </p>
                </div>
              </div>
            </div>
          </FadeCol>
        </div>
      </div>

      {/* ── Línea divisora ── */}
      <div className="mx-6" style={{ height: '1px', backgroundColor: 'rgba(245,240,232,0.08)' }} />

      {/* ── Barra inferior: copyright + políticas ── */}
      <div className="container mx-auto px-6 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-center md:text-left"
            style={{ color: 'rgba(245,240,232,0.3)', fontFamily: 'var(--font-ui)' }}>
            © {year} Hotel Quinta Dalam. Todos los derechos reservados.
            <span className="mx-2" style={{ color: 'rgba(245,240,232,0.15)' }}>·</span>
            Coeneo, Michoacán, México
          </p>
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-1">
            {policies.map(p => (
              <a key={p.name} href={p.href}
                className="text-xs transition-colors duration-300 hover:underline underline-offset-2"
                style={{ color: 'rgba(245,240,232,0.3)', fontFamily: 'var(--font-ui)' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'rgba(245,240,232,0.7)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(245,240,232,0.3)'}>
                {p.name}
              </a>
            ))}
          </div>

          {/* ── Logos de validación W3C ── */}
          <div className="flex items-center gap-3">
            <a href="https://validator.w3.org/" target="_blank" rel="noopener noreferrer"
              title="Valid HTML 4.01">
              <img src="/img/valid-html401.png" alt="Valid HTML 4.01"
                style={{ height: '24px', width: 'auto', opacity: 0.8, transition: 'opacity 0.2s' }}
                onMouseEnter={e => (e.currentTarget as HTMLImageElement).style.opacity = '1'}
                onMouseLeave={e => (e.currentTarget as HTMLImageElement).style.opacity = '0.8'} />
            </a>
            <a href="https://jigsaw.w3.org/css-validator/" target="_blank" rel="noopener noreferrer"
              title="Valid CSS">
              <img src="/img/valid-css.png" alt="Valid CSS"
                style={{ height: '24px', width: 'auto', opacity: 0.8, transition: 'opacity 0.2s' }}
                onMouseEnter={e => (e.currentTarget as HTMLImageElement).style.opacity = '1'}
                onMouseLeave={e => (e.currentTarget as HTMLImageElement).style.opacity = '0.8'} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}