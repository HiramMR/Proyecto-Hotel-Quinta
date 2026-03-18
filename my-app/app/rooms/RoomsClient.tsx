// ============================================================
// app/rooms/RoomsClient.tsx — Client Component
//
// Recibe todas las habitaciones pre-cargadas desde el servidor.
// Maneja: buscador de fechas, filtros, carousel, disponibilidad,
// y el modal de reservación.
// ============================================================
'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Carousel from '../components/Carousel';
import RoomCard from '../components/RoomCard';
import RoomModal from '../components/RoomModal';
import DatePicker from '../components/DatePicker';
import { supabase } from '../../lib/supabase';

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

interface RoomData {
  id: number; title: string; description: string; longDescription?: string;
  price: number; images: string[]; capacity: number; popular?: boolean; stars?: number; amenities?: string[];
}

interface RoomsClientProps {
  allRooms: RoomData[];
}

// Wrapper necesario para useSearchParams dentro de Suspense
export default function RoomsClient({ allRooms }: RoomsClientProps) {
  return (
    <Suspense fallback={
      <main style={{ backgroundColor: 'var(--cream)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>Cargando...</p>
      </main>
    }>
      <RoomsContent allRooms={allRooms} />
    </Suspense>
  );
}

function RoomsContent({ allRooms }: RoomsClientProps) {
  const searchParams = useSearchParams();

  const llegadaParam = searchParams.get('llegada') ?? '';
  const salidaParam  = searchParams.get('salida')  ?? '';

  const [isMounted, setIsMounted]         = useState(false);
  const [showFilters, setShowFilters]     = useState(false);
  const [showLlegada, setShowLlegada]     = useState(false);
  const [showSalida, setShowSalida]       = useState(false);
  const [llegada, setLlegada]             = useState(llegadaParam);
  const [salida, setSalida]               = useState(salidaParam);
  const [selectedCapacity, setSelectedCapacity] = useState<number | null>(null);
  const [maxPrice, setMaxPrice]           = useState(10000);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectedRoom, setSelectedRoom]   = useState<RoomData | null>(null);
  const [unavailableIds, setUnavailableIds] = useState<number[]>([]);

  useEffect(() => {
    const t = setTimeout(() => setIsMounted(true), 200);
    return () => clearTimeout(t);
  }, []);

  // Solo necesitamos consultar las habitaciones OCUPADAS — las habitaciones
  // ya llegaron pre-cargadas desde el servidor, sin timing issues.
  useEffect(() => {
    if (!llegadaParam || !salidaParam) {
      setUnavailableIds([]);
      return;
    }
    const fetchOcupadas = async () => {
      const { data } = await supabase
        .from('reservations')
        .select('room_id')
        .in('estado', ['confirmada', 'pagada'])
        .lt('fecha_llegada', salidaParam)
        .gt('fecha_salida', llegadaParam)
      setUnavailableIds((data ?? []).map(r => r.room_id));
    };
    fetchOcupadas();
  }, [llegadaParam, salidaParam]);

  const toggleAmenity = (a: string) =>
    setSelectedAmenities(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]);

  const roomSlides = allRooms.map(room => ({
    src: room.images[0] ?? '/img/banner.png',
    content: (
      <div className="text-center">
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem,4vw,3rem)', fontWeight: 400, color: 'var(--cream)' }}>
          {room.title}
        </h3>
        {room.popular && (
          <span className="inline-block px-4 py-1 text-xs uppercase tracking-widest font-semibold mt-2"
            style={{ backgroundColor: 'var(--copper)', color: '#fff', borderRadius: '2px 10px 2px 10px' }}>
            Popular
          </span>
        )}
      </div>
    )
  }));

  const formatShort = (dateStr: string) =>
    new Date(dateStr + 'T00:00:00').toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });

  return (
    <main style={{ backgroundColor: 'var(--cream)', minHeight: '100vh', overflowX: 'hidden' }}>

      {/* ── HERO ── */}
      <section className="flex flex-col grain-overlay relative"
        style={{ height: '100vh', background: 'linear-gradient(135deg, var(--charcoal) 0%, var(--wood-dark) 100%)' }}>
        <div className="flex flex-col items-center justify-center pt-24 pb-6 text-center relative z-10">
          <p className={`text-xs uppercase tracking-[0.3em] mb-3 transition-all duration-700 ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            style={{ color: 'var(--copper)', fontFamily: 'var(--font-ui)', transitionDelay: '0ms' }}>
            Descubre tu espacio
          </p>
          <h1 className={`font-display transition-all duration-900 ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
            style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem,6vw,5rem)', fontWeight: 300, color: 'var(--cream)', transitionDelay: '150ms' }}>
            Nuestras <em style={{ fontWeight: 400 }}>Habitaciones</em>
          </h1>
          <div className={`flex items-center gap-4 mt-5 transition-all duration-700 ${isMounted ? 'opacity-60 translate-y-0' : 'opacity-0 translate-y-3'}`}
            style={{ transitionDelay: '300ms' }}>
            <div className="h-px w-12" style={{ background: 'linear-gradient(to right, transparent, var(--copper))' }} />
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--copper)' }} />
            <div className="h-px w-12" style={{ background: 'linear-gradient(to left, transparent, var(--copper))' }} />
          </div>
        </div>
        <div className={`flex-1 min-h-0 transition-all duration-1000 ${isMounted ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
          style={{ transitionDelay: '400ms' }}>
          <Carousel slides={roomSlides} />
        </div>
        <div className={`absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10 transition-all duration-700 ${isMounted ? 'opacity-50' : 'opacity-0'}`}
          style={{ transitionDelay: '800ms' }}>
          <span className="text-xs uppercase tracking-widest" style={{ color: 'var(--cream)', fontFamily: 'var(--font-ui)' }}>Ver opciones</span>
          <div className="w-px h-8 animate-pulse" style={{ backgroundColor: 'var(--copper)' }} />
        </div>
      </section>

      {/* ── BUSCADOR ── */}
      <section className="py-14" style={{ backgroundColor: 'var(--cream-dark)', position: 'relative', zIndex: 10 }}>
        <div className="container mx-auto px-4">
          <Reveal direction="up">
            <h2 className="font-display text-center mb-8"
              style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 400, color: 'var(--charcoal)' }}>
              Encuentra tu habitación ideal
            </h2>
          </Reveal>
          <Reveal direction="up" delay={100}>
            <div className="flex flex-col gap-3 max-w-4xl mx-auto" style={{ position: 'relative', zIndex: 50 }}>
              <div className="w-full" style={{ position: 'relative', zIndex: showLlegada ? 100 : 'auto' }}>
                <DatePicker label="Fecha de llegada" value={llegada}
                  onChange={v => { setLlegada(v); setShowLlegada(false); }}
                  isOpen={showLlegada}
                  onToggle={() => { setShowLlegada(!showLlegada); setShowSalida(false); setShowFilters(false); }} />
              </div>
              <div className="w-full" style={{ position: 'relative', zIndex: showSalida ? 100 : 'auto' }}>
                <DatePicker label="Fecha de salida" value={salida}
                  onChange={v => { setSalida(v); setShowSalida(false); }}
                  isOpen={showSalida}
                  onToggle={() => { setShowSalida(!showSalida); setShowLlegada(false); setShowFilters(false); }} />
              </div>
              <div className="w-full" style={{ position: 'relative', zIndex: showFilters ? 100 : 'auto' }}>
                <button onClick={() => { setShowFilters(!showFilters); setShowLlegada(false); setShowSalida(false); }}
                  className="w-full flex items-center justify-center gap-2 transition-colors"
                  style={{ padding: '0.75rem 1.25rem', border: `1px solid ${showFilters ? 'var(--copper)' : 'var(--stone)'}`, borderRadius: '8px', backgroundColor: showFilters ? 'rgba(200,129,58,0.05)' : 'var(--cream)', color: showFilters ? 'var(--copper)' : 'var(--text-muted)', fontFamily: 'var(--font-ui)', fontSize: '0.8rem' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" /></svg>
                  Más filtros
                </button>
                {showFilters && (
                  <div className="absolute top-full left-0 mt-2 p-5 w-full"
                    style={{ backgroundColor: 'var(--cream)', border: '1px solid var(--stone)', borderRadius: '4px 16px 4px 16px', boxShadow: '0 20px 60px rgba(44,36,32,0.18)', zIndex: 9999 }}>
                    <div className="mb-5">
                      <label className="block text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>Capacidad</label>
                      <div className="flex gap-3">
                        {[2, 4, 6, 8].map(cap => (
                          <button key={cap} onClick={() => setSelectedCapacity(selectedCapacity === cap ? null : cap)}
                            className="flex items-center gap-1 text-xs font-medium transition-colors"
                            style={{ color: selectedCapacity === cap ? 'var(--copper)' : 'var(--text-muted)' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" /></svg>
                            {cap}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="mb-5">
                      <label className="block text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>Precio máximo</label>
                      <input type="range" min="0" max="10000" value={maxPrice} onChange={e => setMaxPrice(Number(e.target.value))} className="w-full h-1.5 rounded-lg cursor-pointer" style={{ accentColor: 'var(--copper)' }} />
                      <p className="text-center text-xs mt-2 font-semibold" style={{ color: 'var(--copper)' }}>Hasta ${maxPrice}</p>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>Amenidades</label>
                      <div className="grid grid-cols-3 gap-2">
                        {amenitiesList.map(a => (
                          <button key={a.name} onClick={() => toggleAmenity(a.name)}
                            className="flex flex-col items-center gap-1.5 p-2 rounded-lg text-xs transition-all"
                            style={{ color: selectedAmenities.includes(a.name) ? 'var(--copper)' : 'var(--text-muted)', backgroundColor: selectedAmenities.includes(a.name) ? 'rgba(200,129,58,0.08)' : 'transparent', border: `1px solid ${selectedAmenities.includes(a.name) ? 'rgba(200,129,58,0.3)' : 'var(--stone)'}` }}>
                            {a.icon}<span>{a.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="w-full">
                <button
                  className="btn-copper w-full text-center"
                  onClick={() => {
                    const params = new URLSearchParams();
                    if (llegada) params.set('llegada', llegada);
                    if (salida) params.set('salida', salida);
                    setShowFilters(false); setShowLlegada(false); setShowSalida(false);
                    window.location.href = `/rooms?${params.toString()}`;
                  }}>
                  Buscar disponibilidad
                </button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── LISTADO DE HABITACIONES ── */}
      <section className="py-20" style={{ backgroundColor: 'var(--cream)' }}>
        <div className="container mx-auto px-4">
          <Reveal direction="up">
            <div className="mb-12">
              <p className="text-xs uppercase tracking-[0.25em] mb-2" style={{ color: 'var(--copper)', fontFamily: 'var(--font-ui)' }}>
                {llegadaParam && salidaParam
                  ? `Disponibles del ${formatShort(llegadaParam)} al ${formatShort(salidaParam)}`
                  : 'Disponibles para ti'
                }
              </p>
              <h2 className="font-display" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem,3vw,2.8rem)', fontWeight: 400, color: 'var(--charcoal)' }}>
                {llegadaParam && salidaParam
                  ? <>Habitaciones <em>disponibles</em></>
                  : <>Todas nuestras <em>habitaciones</em></>
                }
              </h2>
            </div>
          </Reveal>

          <div className="flex flex-wrap justify-center gap-8">
            {allRooms.map((room, i) => {
              const unavailable = !!(llegadaParam && salidaParam && unavailableIds.includes(room.id));
              return (
                <Reveal key={room.id} direction="up" delay={i * 120}
                  className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.33rem)]">
                  <div style={{ position: 'relative', opacity: unavailable ? 0.5 : 1, transition: 'opacity 0.3s' }}>
                    {unavailable && (
                      <div style={{
                        position: 'absolute', top: '12px', left: '12px', zIndex: 10,
                        backgroundColor: 'rgba(44,36,32,0.75)', backdropFilter: 'blur(4px)',
                        color: '#fff', fontFamily: 'var(--font-ui)', fontSize: '0.65rem',
                        fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase',
                        padding: '0.3rem 0.75rem', borderRadius: '2px 8px 2px 8px',
                      }}>
                        No disponible
                      </div>
                    )}
                    <RoomCard
                      room={room}
                      onReserve={unavailable ? () => {} : setSelectedRoom}
                      amenitiesList={amenitiesList}
                      unavailable={unavailable}
                    />
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── MODAL ── */}
      {selectedRoom && (
        <RoomModal
          room={selectedRoom}
          llegada={llegada}
          salida={salida}
          onClose={() => setSelectedRoom(null)}
          amenitiesList={amenitiesList}
        />
      )}
    </main>
  );
}