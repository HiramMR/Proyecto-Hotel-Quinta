// ============================================================
// HomeClient.tsx — Contenido interactivo de la página de inicio
//
// Cambios en esta versión:
//   - RoomCard ahora recibe room (objeto completo) + onReserve
//   - Al hacer clic en Reservar se abre RoomModal con la habitación
//   - Las fechas del buscador se pasan al modal
// ============================================================
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Carousel from './Carousel';
import RoomCard from './RoomCard';
import RoomModal from './RoomModal';
import DatePicker from './DatePicker';

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
    <div ref={ref}
      className={`transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-x-0 translate-y-0' : initial[direction]} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

// ── Catálogo de amenidades (necesario para el modal) ──
const amenitiesList = [
  { name: "1 Cama",        icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M2 20h20M4 20V10a2 2 0 012-2h12a2 2 0 012 2v10M4 14h16" /></svg> },
  { name: "2 Camas",       icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M2 20h20M3 20V10a1 1 0 011-1h6a1 1 0 011 1v10M13 20V10a1 1 0 011-1h6a1 1 0 011 1v10" /></svg> },
  { name: "Agua caliente",  icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" /></svg> },
  { name: "Toallas",       icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7v10a2 2 0 01-2 2H7a2 2 0 01-2-2V7m14 0V5a2 2 0 00-2-2H7a2 2 0 00-2 2v2m14 0H5" /></svg> },
  { name: "Wifi",          icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z" /></svg> },
  { name: "Television",    icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M6 20.25h12m-7.5-3v3m3-3v3m-10.125-3h17.25c.621 0 1.125-.504 1.125-1.125V4.875c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125z" /></svg> },
  { name: "Room-service",  icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" /></svg> },
  { name: "Pet-friendly",  icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" /></svg> },
  { name: "Minibar",       icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M5 3h14v18H5V3zm2 2v14h10V5H7zm2 2h2v2H9V7z" /></svg> },
];

// ── Tipos ──
interface RoomData {
  id: number; title: string; description: string; longDescription?: string;
  price: number; images: string[]; capacity: number; popular?: boolean; stars?: number; amenities?: string[];
}
interface Feature { icon: string; title: string; description: string; }
interface HomeClientProps {
  bannerImages: string[];
  featuredRooms: RoomData[];
  features: Feature[];
}

export default function HomeClient({ bannerImages, featuredRooms, features }: HomeClientProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  // buscadorActive: true mientras algún campo tenga foco o un picker esté abierto.
  // Evita que el buscador desaparezca mientras el usuario interactúa con él.
  const [buscadorActive, setBuscadorActive] = useState(false);

  // ── Estado del modal ──
  const [selectedRoom, setSelectedRoom] = useState<RoomData | null>(null);

  // Fechas y pickers del buscador del inicio
  const [llegada, setLlegada] = useState('');
  const [salida, setSalida] = useState('');
  const [showLlegada, setShowLlegada] = useState(false);
  const [showSalida, setShowSalida] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 400);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Aparece al pasar el 40% del viewport (antes que antes) y desaparece
    // solo si el usuario no está interactuando con el buscador.
    const handleScroll = () => {
      const past40 = window.scrollY > window.innerHeight * 0.40;
      setIsScrolled(past40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
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

      {/* ── BUSCADOR — mismo estilo que /rooms ── */}
      {/* visible: pasado el 40% del scroll O mientras el usuario interactúa */}
      <div className="relative z-20 container mx-auto px-4 mt-8 md:mt-12 transition-all duration-700 ease-out"
        style={{
          opacity: (isScrolled || buscadorActive) ? 1 : 0,
          transform: (isScrolled || buscadorActive) ? 'translateY(0)' : 'translateY(32px)',
          pointerEvents: (isScrolled || buscadorActive) ? 'auto' : 'none',
        }}>
        <div className="p-6 md:p-8"
          style={{ backgroundColor: 'var(--cream)', border: '1px solid var(--stone)', borderRadius: '4px 24px 4px 24px', boxShadow: 'var(--shadow-lg)' }}>

          <p className="text-xs uppercase tracking-[0.25em] mb-5 text-center"
            style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>
            Busca tu habitación ideal
          </p>

          <div className="flex flex-col gap-3 max-w-2xl mx-auto" style={{ position: 'relative', zIndex: 50 }}>

            {/* Fecha de llegada */}
            <div className="w-full" style={{ position: 'relative', zIndex: showLlegada ? 100 : 'auto' }}
              onFocus={() => setBuscadorActive(true)}
              onBlur={() => setBuscadorActive(showLlegada || showSalida)}>
              <DatePicker
                label="Fecha de llegada"
                value={llegada}
                onChange={v => { setLlegada(v); setShowLlegada(false); }}
                isOpen={showLlegada}
                onToggle={() => { setShowLlegada(!showLlegada); setShowSalida(false); setBuscadorActive(true); }}
              />
            </div>

            {/* Fecha de salida */}
            <div className="w-full" style={{ position: 'relative', zIndex: showSalida ? 100 : 'auto' }}
              onFocus={() => setBuscadorActive(true)}
              onBlur={() => setBuscadorActive(showLlegada || showSalida)}>
              <DatePicker
                label="Fecha de salida"
                value={salida}
                onChange={v => { setSalida(v); setShowSalida(false); }}
                isOpen={showSalida}
                onToggle={() => { setShowSalida(!showSalida); setShowLlegada(false); setBuscadorActive(true); }}
              />
            </div>

            {/* Botón buscar — pasa las fechas como parámetros en la URL */}
            <div className="w-full">
              <button
                className="btn-copper block text-center w-full"
                onClick={() => {
                  const params = new URLSearchParams()
                  if (llegada) params.set('llegada', llegada)
                  if (salida) params.set('salida', salida)
                  window.location.href = `/rooms?${params.toString()}`
                }}>
                Buscar Disponibilidad
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── HABITACIONES DESTACADAS ── */}
      <section className="py-16 md:py-24 section-cream">
        <div className="container mx-auto px-4">
          <Reveal direction="up" className="flex flex-col md:flex-row justify-between items-end mb-14 gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] mb-3" style={{ color: 'var(--copper)', fontFamily: 'var(--font-ui)' }}>
                Nuestras habitaciones
              </p>
              <h2 className="font-display leading-none" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 400, color: 'var(--charcoal)' }}>
                Espacios para<br /><em>descansar de verdad</em>
              </h2>
            </div>
            <Link href="/rooms" className="flex items-center gap-2 text-xs uppercase tracking-widest font-semibold transition-colors group"
              style={{ color: 'var(--copper)', fontFamily: 'var(--font-ui)' }}>
              Ver todas <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
            </Link>
          </Reveal>

          <div className="flex flex-wrap justify-center gap-6 md:gap-8">
            {Array.from(new Map(featuredRooms.map(r => [r.id, r])).values()).map((room, i) => (
              <Reveal key={room.id} direction="up" delay={i * 100}
                className="w-full md:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1.33rem)]">
                {/* RoomCard con onReserve → abre el modal */}
                <RoomCard
                  room={room}
                  onReserve={setSelectedRoom}
                  amenitiesList={amenitiesList}
                />
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
            <h2 className="font-display" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 400, color: 'var(--charcoal)' }}>
              ¿Por qué elegirnos?
            </h2>
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
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 60% 50%, rgba(200,129,58,0.12) 0%, transparent 70%)' }} />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <Reveal direction="up">
            <p className="text-xs uppercase tracking-[0.3em] mb-5" style={{ color: 'var(--copper)', fontFamily: 'var(--font-ui)' }}>Tu próxima escapada</p>
            <h2 className="font-display mb-6 leading-tight"
              style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.2rem, 5vw, 4.5rem)', fontWeight: 300, color: 'var(--cream)' }}>
              ¿Listo para vivir<br /><em style={{ fontWeight: 400 }}>una experiencia inolvidable?</em>
            </h2>
          </Reveal>
          <Reveal direction="up" delay={150}>
            <p className="max-w-xl mx-auto mb-10 text-base leading-relaxed"
              style={{ fontFamily: 'var(--font-body)', color: 'rgba(245,240,232,0.65)', fontStyle: 'italic' }}>
              Reserva directamente con nosotros y obtén los mejores precios garantizados.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/contact" className="btn-copper">Contáctanos Hoy</Link>
              <Link href="/rooms" className="btn-outline">Ver Habitaciones</Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── MODAL — se monta cuando hay habitación seleccionada ── */}
      {selectedRoom && (
        <RoomModal
          room={selectedRoom}
          llegada={llegada}
          salida={salida}
          onClose={() => setSelectedRoom(null)}
          amenitiesList={amenitiesList}
        />
      )}
    </>
  );
}