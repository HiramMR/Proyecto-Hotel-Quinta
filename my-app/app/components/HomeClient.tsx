'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Carousel from './Carousel';
import RoomCard from './RoomCard';

/* ── Hook IntersectionObserver ── */
function useInView(threshold = 0.12) {
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

function Reveal({ children, delay = 0, direction = 'up', className = '' }: {
  children: React.ReactNode; delay?: number; direction?: 'up' | 'left' | 'right' | 'none'; className?: string;
}) {
  const { ref, visible } = useInView();
  const initial: Record<string, string> = {
    up: 'opacity-0 translate-y-10', left: 'opacity-0 -translate-x-10',
    right: 'opacity-0 translate-x-10', none: 'opacity-0',
  };
  return (
    <div ref={ref} className={`transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-x-0 translate-y-0' : initial[direction]} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

/* ── Tipos ── */
interface Room { id: number; title: string; description: string; price: number; images: string[]; capacity: number; }
interface Feature { icon: string; title: string; description: string; }

interface HomeClientProps {
  bannerImages: string[];
  featuredRooms: Room[];
  features: Feature[];
}

export default function HomeClient({ bannerImages, featuredRooms, features }: HomeClientProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 400);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > window.innerHeight * 0.75);
    window.addEventListener('scroll', handleScroll, { passive: true }); // ✅ passive mejora rendimiento de scroll
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* ── HERO ── */}
      <section className="relative h-screen w-full grain-overlay overflow-hidden">
        <div className="absolute inset-0">
          <Carousel images={bannerImages} priority={true} />
        </div>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(to top, rgba(44,36,32,0.85) 0%, rgba(44,36,32,0.3) 50%, rgba(44,36,32,0.15) 100%)' }} />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10 px-6 text-center">
          <p className={`transition-all duration-700 text-xs uppercase tracking-[0.3em] mb-6 ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            style={{ color: 'var(--copper)', fontFamily: 'var(--font-ui)', transitionDelay: '0ms' }}>
            Michoacán · México
          </p>
          <h1 className={`transition-all duration-900 font-display leading-none mb-6 ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
            style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(3rem, 8vw, 7rem)', fontWeight: 300, letterSpacing: '-0.01em', textShadow: '0 2px 40px rgba(44,36,32,0.4)', transitionDelay: '150ms' }}>
            Hotel Quinta<br /><em style={{ fontStyle: 'italic', fontWeight: 400 }}>Dalam</em>
          </h1>
          <p className={`transition-all duration-900 max-w-xl text-base md:text-lg leading-relaxed mb-10 ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            style={{ fontFamily: 'var(--font-body)', color: 'rgba(245,240,232,0.8)', fontStyle: 'italic', transitionDelay: '300ms' }}>
            Donde el lago, la piedra y el silencio se convierten en tu hogar.
          </p>
          <div className={`transition-all duration-700 flex gap-3 md:gap-4 flex-wrap justify-center ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            style={{ transitionDelay: '450ms' }}>
            <Link href="/rooms" className="btn-copper">Ver Habitaciones</Link>
            <Link href="/contact" className="btn-outline">Contáctanos</Link>
          </div>
        </div>

        <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-all duration-700 ${isMounted ? 'opacity-60' : 'opacity-0'}`}
          style={{ transitionDelay: '700ms' }}>
          <span className="text-xs uppercase tracking-widest" style={{ color: 'var(--cream)', fontFamily: 'var(--font-ui)' }}>Explorar</span>
          <div className="w-px h-10 animate-pulse" style={{ backgroundColor: 'var(--copper)' }} />
        </div>
      </section>

      {/* ── BUSCADOR (aparece al hacer scroll) ── */}
      <div className="relative z-20 container mx-auto px-4 mt-8 md:mt-12 transition-all duration-700 ease-out"
        style={{ opacity: isScrolled ? 1 : 0, transform: isScrolled ? 'translateY(0)' : 'translateY(32px)', pointerEvents: isScrolled ? 'auto' : 'none' }}>
        <div className="p-4 md:p-8 flex flex-col lg:flex-row gap-4 items-end justify-between"
          style={{ backgroundColor: 'var(--cream)', border: '1px solid var(--stone)', borderRadius: '4px 24px 4px 24px', boxShadow: 'var(--shadow-lg)' }}>
          <div className="flex-1 w-full">
            <label className="block text-xs font-semibold mb-2 uppercase tracking-widest" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>Llegada</label>
            <input type="date" className="input-warm" />
          </div>
          <div className="flex-1 w-full">
            <label className="block text-xs font-semibold mb-2 uppercase tracking-widest" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>Salida</label>
            <input type="date" className="input-warm" />
          </div>
          <div className="flex-1 w-full">
            <label className="block text-xs font-semibold mb-2 uppercase tracking-widest" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>Huéspedes</label>
            <select className="input-warm" style={{ backgroundColor: 'var(--cream)' }}>
              <option>1 Persona</option><option>2 Personas</option><option>3 Personas</option><option>4+ Personas</option>
            </select>
          </div>
          <div className="w-full lg:w-auto">
            <Link href="/rooms" className="btn-copper block text-center w-full lg:w-auto whitespace-nowrap">Buscar Disponibilidad</Link>
          </div>
        </div>
      </div>

      {/* ── HABITACIONES ── */}
      <section className="py-16 md:py-24 section-cream">
        <div className="container mx-auto px-4">
          <Reveal direction="up" className="flex flex-col md:flex-row justify-between items-end mb-14 gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] mb-3" style={{ color: 'var(--copper)', fontFamily: 'var(--font-ui)' }}>Nuestras habitaciones</p>
              <h2 className="font-display leading-none" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 400, color: 'var(--charcoal)' }}>
                Espacios para<br /><em>descansar de verdad</em>
              </h2>
            </div>
            <Link href="/rooms" className="flex items-center gap-2 text-xs uppercase tracking-widest font-semibold transition-colors group" style={{ color: 'var(--copper)', fontFamily: 'var(--font-ui)' }}>
              Ver todas <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
            </Link>
          </Reveal>
          <div className="flex flex-wrap justify-center gap-6 md:gap-8">
            {featuredRooms.map((room, i) => (
              <Reveal key={room.id} direction="up" delay={i * 100} className="w-full md:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1.33rem)]">
                <RoomCard title={room.title} description={room.description} price={room.price} images={room.images} capacity={room.capacity} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── POR QUÉ ELEGIRNOS ── */}
      <section className="py-16 md:py-24" style={{ backgroundColor: 'var(--cream)' }}>
        <div className="container mx-auto px-4">
          <Reveal direction="up" className="text-center mb-16">
            <p className="text-xs uppercase tracking-[0.25em] mb-4" style={{ color: 'var(--copper)', fontFamily: 'var(--font-ui)' }}>Nuestra esencia</p>
            <h2 className="font-display" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 400, color: 'var(--charcoal)' }}>¿Por qué elegirnos?</h2>
            <div className="divider-ornament max-w-xs mx-auto mt-6">
              <span className="text-xs uppercase tracking-widest px-4" style={{ color: 'var(--text-light)', fontFamily: 'var(--font-ui)' }}>✦</span>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {features.map((f, i) => (
              <Reveal key={i} direction={i === 0 ? 'left' : i === 2 ? 'right' : 'up'} delay={i * 120}>
                <div className="p-6 md:p-8 text-center cursor-default h-full"
                  style={{ border: '1px solid var(--stone)', borderRadius: '4px 20px 4px 20px', transition: 'background-color 0.3s, box-shadow 0.3s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--cream-dark)'; (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-md)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}>
                  <div className="text-3xl md:text-4xl mb-5">{f.icon}</div>
                  <h3 className="font-display text-xl font-semibold mb-3" style={{ fontFamily: 'var(--font-display)', color: 'var(--charcoal)' }}>{f.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-muted)', fontStyle: 'italic' }}>{f.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="py-20 md:py-28 relative overflow-hidden grain-overlay" style={{ backgroundColor: 'var(--charcoal)' }}>
        <div className="absolute inset-0 opacity-15">
          <img src="/img/banner.png" alt="" className="w-full h-full object-cover" loading="lazy" />
        </div>
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 60% 50%, rgba(200,129,58,0.12) 0%, transparent 70%)' }} />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <Reveal direction="up">
            <p className="text-xs uppercase tracking-[0.3em] mb-5" style={{ color: 'var(--copper)', fontFamily: 'var(--font-ui)' }}>Tu próxima escapada</p>
            <h2 className="font-display mb-6 leading-tight" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.2rem, 5vw, 4.5rem)', fontWeight: 300, color: 'var(--cream)' }}>
              ¿Listo para vivir<br /><em style={{ fontWeight: 400 }}>una experiencia inolvidable?</em>
            </h2>
          </Reveal>
          <Reveal direction="up" delay={150}>
            <p className="max-w-xl mx-auto mb-10 text-base leading-relaxed" style={{ fontFamily: 'var(--font-body)', color: 'rgba(245,240,232,0.65)', fontStyle: 'italic' }}>
              Reserva directamente con nosotros y obtén los mejores precios garantizados.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/contact" className="btn-copper">Contáctanos Hoy</Link>
              <Link href="/rooms" className="btn-outline">Ver Habitaciones</Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}