// ============================================================
// rooms/page.tsx — Página de habitaciones (Client Component)
// 'use client' es necesario por los estados del buscador,
// los DatePickers y el componente Reveal con IntersectionObserver.
//
// Estructura de la página:
// 1. Hero: título + carrusel de habitaciones (pantalla completa)
// 2. Buscador: fechas, filtros y botón de búsqueda
// 3. Listado: todas las habitaciones en cards con animaciones
// ============================================================
'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import Carousel from '../components/Carousel';
import RoomCard from '../components/RoomCard';
import DatePicker from '../components/DatePicker';

// ============================================================
// Hook: useInView (mismo que en HomeClient.tsx)
// Detecta si un elemento entró en el viewport para animar.
// ============================================================
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

// ============================================================
// Componente: Reveal (mismo que en HomeClient.tsx)
// Aplica animación de entrada cuando el elemento es visible.
// ============================================================
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

// ============================================================
// CATÁLOGO DE AMENIDADES
// Cada amenidad tiene un nombre y un ícono SVG.
// El nombre es la clave que conecta las amenidades de cada
// habitación (en availableRooms) con su ícono correspondiente.
// ============================================================
const amenitiesList = [
  { name: "1 Cama",       icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M2 20h20M4 20V10a2 2 0 012-2h12a2 2 0 012 2v10M4 14h16" /></svg> },
  { name: "2 Camas",      icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M2 20h20M3 20V10a1 1 0 011-1h6a1 1 0 011 1v10M13 20V10a1 1 0 011-1h6a1 1 0 011 1v10" /></svg> },
  { name: "Agua caliente", icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" /></svg> },
  { name: "Toallas",      icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7v10a2 2 0 01-2 2H7a2 2 0 01-2-2V7m14 0V5a2 2 0 00-2-2H7a2 2 0 00-2 2v2m14 0H5" /></svg> },
  { name: "Wifi",         icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z" /></svg> },
  { name: "Television",   icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M6 20.25h12m-7.5-3v3m3-3v3m-10.125-3h17.25c.621 0 1.125-.504 1.125-1.125V4.875c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125z" /></svg> },
  { name: "Room-service", icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" /></svg> },
  { name: "Pet-friendly",  icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" /></svg> },
  { name: "Minibar",      icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M5 3h14v18H5V3zm2 2v14h10V5H7zm2 2h2v2H9V7z" /></svg> },
];

// ============================================================
// HABITACIONES DISPONIBLES
// Datos estáticos de las habitaciones.
// En el futuro estos datos vendrán de la base de datos (Prisma/PostgreSQL).
// popular: si se muestra el badge "Popular" en el carrusel del hero
// ============================================================
const availableRooms = [
  { id: 1, title: "Suite de Lujo",       description: "Espacio amplio con jacuzzi privado y vista panorámica al lago.", price: 250, images: ["/img/room1.jpg", "/img/room2.jpg", "/img/room3.jpg", "/img/room4.jpg"], capacity: 2, popular: true,  amenities: ["1 Cama", "Agua caliente", "Wifi", "Minibar"] },
  { id: 2, title: "Habitación Familiar", description: "Espaciosa habitación ideal para familias. Dos camas queen y área de estar confortable.", price: 180, images: ["/img/room2.jpg", "/img/room1.jpg", "/img/room3.jpg", "/img/room4.jpg"], capacity: 4, popular: true,  amenities: ["2 Camas", "Television", "Room-service"] },
  { id: 3, title: "Habitación Estándar", description: "Comodidad y calidez para una estancia placentera.", price: 100, images: ["/img/room3.jpg", "/img/room2.jpg", "/img/room1.jpg", "/img/room4.jpg"], capacity: 2, popular: false, amenities: ["1 Cama", "Wifi"] },
  { id: 4, title: "Habitación Sencilla", description: "Descanso genuino en un entorno íntimo y acogedor.", price: 100, images: ["/img/room4.jpg", "/img/room3.jpg", "/img/room2.jpg", "/img/room1.jpg"], capacity: 1, popular: false, amenities: ["1 Cama", "Toallas"] },
];

export default function RoomsPage() {
  // ── Estados del buscador ──
  // Solo un dropdown puede estar abierto a la vez.
  // Los tres se excluyen mutuamente en los onToggle.
  const [showFilters, setShowFilters] = useState(false);   // Panel "Más filtros"
  const [showLlegada, setShowLlegada] = useState(false);   // DatePicker de llegada
  const [showSalida, setShowSalida]   = useState(false);   // DatePicker de salida

  // Fechas seleccionadas en formato "YYYY-MM-DD" (o "" si no hay)
  const [llegada, setLlegada] = useState('');
  const [salida, setSalida]   = useState('');

  // ── Estados de los filtros ──
  const [selectedCapacity, setSelectedCapacity] = useState<number | null>(null); // null = sin filtro
  const [maxPrice, setMaxPrice]                 = useState(10000);               // Precio máximo
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);      // Amenidades seleccionadas

  // Agrega o quita una amenidad del array de selección
  const toggleAmenity = (a: string) =>
    setSelectedAmenities(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]);

  // ── Slides para el carrusel hero ──
  // Cada slide muestra la imagen de la habitación y su nombre + amenidades superpuestos.
  // Se construyen mapeando availableRooms al formato Slide de Carousel.
  const roomSlides = availableRooms.map(room => ({
    src: room.images[0], // Solo la primera imagen como fondo del slide
    content: (
      <div className="text-center">
        <h3 className="font-display mb-2 drop-shadow-lg"
          style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem,4vw,3rem)', fontWeight: 400, color: 'var(--cream)' }}>
          {room.title}
        </h3>
        {/* Badge Popular (solo si popular=true) */}
        {room.popular && (
          <span className="inline-block px-4 py-1 text-xs uppercase tracking-widest font-semibold mb-3"
            style={{ backgroundColor: 'var(--copper)', color: '#fff', borderRadius: '2px 10px 2px 10px' }}>
            Popular
          </span>
        )}
        {/* Amenidades en pastillas translúcidas */}
        <div className="flex justify-center gap-3 mt-3 flex-wrap">
          {room.amenities?.map(name => {
            const item = amenitiesList.find(a => a.name === name);
            return item ? (
              <div key={name} className="flex items-center gap-1.5 px-3 py-1 text-xs rounded-full"
                style={{ backgroundColor: 'rgba(245,240,232,0.15)', backdropFilter: 'blur(8px)', color: 'var(--cream)', border: '1px solid rgba(245,240,232,0.2)' }}>
                {item.icon} {name}
              </div>
            ) : null;
          })}
        </div>
      </div>
    )
  }));

  return (
    <main style={{ backgroundColor: 'var(--cream)', minHeight: '100vh', overflowX: 'hidden' }}>

      {/* ══════════════════════════════════════════
          SECCIÓN 1: HERO — Título + Carrusel de habitaciones
          Ocupa el 100vh. El carrusel muestra cada habitación
          con su nombre y amenidades superpuestos.
          ══════════════════════════════════════════ */}
      <section className="flex flex-col grain-overlay"
        style={{ height: '100vh', backgroundColor: 'var(--charcoal)', background: 'linear-gradient(135deg, var(--charcoal) 0%, var(--wood-dark) 100%)' }}>

        {/* Título de la sección */}
        <div className="flex flex-col items-center justify-center pt-24 pb-6 text-center">
          <p className="text-xs uppercase tracking-[0.3em] mb-3" style={{ color: 'var(--copper)', fontFamily: 'var(--font-ui)' }}>
            Descubre tu espacio
          </p>
          <h1 className="font-display" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem,6vw,5rem)', fontWeight: 300, color: 'var(--cream)' }}>
            Nuestras <em style={{ fontWeight: 400 }}>Habitaciones</em>
          </h1>
        </div>

        {/* Carrusel de habitaciones — flex-1 ocupa el espacio restante */}
        <div className="flex-1 min-h-0">
          <Carousel slides={roomSlides} />
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECCIÓN 2: BUSCADOR
          Los tres elementos (llegada, salida, filtros) están
          apilados en columna para tener el mismo ancho.
          Cada uno maneja su propio z-index cuando está abierto
          para que el dropdown aparezca encima del resto.
          ══════════════════════════════════════════ */}
      <section className="py-14" style={{ backgroundColor: 'var(--cream-dark)', position: 'relative', zIndex: 10 }}>
        <div className="container mx-auto px-4">
          <Reveal direction="up">
            <h2 className="font-display text-center mb-8"
              style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 400, color: 'var(--charcoal)' }}>
              Encuentra tu habitación ideal
            </h2>
          </Reveal>

          <Reveal direction="up" delay={100}>
            <div className="flex flex-col justify-center gap-3 max-w-4xl mx-auto" style={{ position: 'relative', zIndex: 50 }}>

              {/* DatePicker de llegada
                  zIndex: 100 cuando está abierto para aparecer encima de todo */}
              <div className="w-full" style={{ position: 'relative', zIndex: showLlegada ? 100 : 'auto' }}>
                <DatePicker
                  label="Fecha de llegada"
                  value={llegada}
                  onChange={v => { setLlegada(v); setShowLlegada(false); }} // Cierra al seleccionar
                  isOpen={showLlegada}
                  onToggle={() => { setShowLlegada(!showLlegada); setShowSalida(false); setShowFilters(false); }} // Cierra los otros
                />
              </div>

              {/* DatePicker de salida */}
              <div className="w-full" style={{ position: 'relative', zIndex: showSalida ? 100 : 'auto' }}>
                <DatePicker
                  label="Fecha de salida"
                  value={salida}
                  onChange={v => { setSalida(v); setShowSalida(false); }}
                  isOpen={showSalida}
                  onToggle={() => { setShowSalida(!showSalida); setShowLlegada(false); setShowFilters(false); }}
                />
              </div>

              {/* Botón "Más filtros" con su panel desplegable */}
              <div className="w-full" style={{ position: 'relative', zIndex: showFilters ? 100 : 'auto' }}>
                <button
                  onClick={() => { setShowFilters(!showFilters); setShowLlegada(false); setShowSalida(false); }}
                  className="w-full flex items-center justify-center gap-2 transition-colors"
                  style={{
                    padding: '0.75rem 1.25rem',
                    border: `1px solid ${showFilters ? 'var(--copper)' : 'var(--stone)'}`,
                    borderRadius: '8px',
                    backgroundColor: showFilters ? 'rgba(200,129,58,0.05)' : 'var(--cream)',
                    color: showFilters ? 'var(--copper)' : 'var(--text-muted)',
                    fontFamily: 'var(--font-ui)',
                    fontSize: '0.8rem',
                  }}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                  </svg>
                  Más filtros
                </button>

                {/* Panel de filtros adicionales (visible cuando showFilters=true) */}
                {showFilters && (
                  <div className="absolute top-full left-0 mt-2 p-5 w-full"
                    style={{ backgroundColor: 'var(--cream)', border: '1px solid var(--stone)', borderRadius: '4px 16px 4px 16px', boxShadow: '0 20px 60px rgba(44,36,32,0.18)', zIndex: 9999 }}>

                    {/* Filtro de capacidad — botones de selección única */}
                    <div className="mb-5">
                      <label className="block text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>Capacidad</label>
                      <div className="flex gap-3">
                        {[2, 4, 6, 8].map(cap => (
                          <button key={cap}
                            onClick={() => setSelectedCapacity(selectedCapacity === cap ? null : cap)} // Toggle: seleccionar o deseleccionar
                            className="flex items-center gap-1 text-xs font-medium transition-colors"
                            style={{ color: selectedCapacity === cap ? 'var(--copper)' : 'var(--text-muted)' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                              <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                            </svg>
                            {cap}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Filtro de precio máximo — slider (range input) */}
                    <div className="mb-5">
                      <label className="block text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>Precio máximo</label>
                      <input type="range" min="0" max="10000" value={maxPrice}
                        onChange={e => setMaxPrice(Number(e.target.value))}
                        className="w-full h-1.5 rounded-lg cursor-pointer"
                        style={{ accentColor: 'var(--copper)' }} /> {/* accentColor colorea el thumb del slider */}
                      <p className="text-center text-xs mt-2 font-semibold" style={{ color: 'var(--copper)' }}>Hasta ${maxPrice}</p>
                    </div>

                    {/* Filtro de amenidades — selección múltiple en grid 3 columnas */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>Amenidades</label>
                      <div className="grid grid-cols-3 gap-2">
                        {amenitiesList.map(a => (
                          <button key={a.name} onClick={() => toggleAmenity(a.name)}
                            className="flex flex-col items-center gap-1.5 p-2 rounded-lg text-xs transition-all"
                            style={{
                              color: selectedAmenities.includes(a.name) ? 'var(--copper)' : 'var(--text-muted)',
                              backgroundColor: selectedAmenities.includes(a.name) ? 'rgba(200,129,58,0.08)' : 'transparent',
                              border: `1px solid ${selectedAmenities.includes(a.name) ? 'rgba(200,129,58,0.3)' : 'var(--stone)'}`,
                            }}>
                            {a.icon}
                            <span>{a.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Botón de búsqueda — mismo ancho que los elementos de arriba (w-full) */}
              <div className="w-full">
                <Link href="/rooms" className="btn-copper block text-center w-full">
                  Buscar disponibilidad
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECCIÓN 3: LISTADO DE HABITACIONES
          Todas las habitaciones en cards con animaciones
          de entrada escalonadas (delay: i * 100ms).
          ══════════════════════════════════════════ */}
      <section className="py-20" style={{ backgroundColor: 'var(--cream)' }}>
        <div className="container mx-auto px-4">
          <Reveal direction="up">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] mb-2" style={{ color: 'var(--copper)', fontFamily: 'var(--font-ui)' }}>
                  Disponibles para ti
                </p>
                <h2 className="font-display" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem,3vw,2.8rem)', fontWeight: 400, color: 'var(--charcoal)' }}>
                  Todas nuestras <em>habitaciones</em>
                </h2>
              </div>
            </div>
          </Reveal>

          {/* Grid de RoomCards — cada una aparece con un delay escalonado */}
          <div className="flex flex-wrap justify-center gap-8">
            {availableRooms.map((room, i) => (
              <Reveal key={room.id} direction="up" delay={i * 100}
                className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.33rem)]">
                <RoomCard
                  title={room.title}
                  description={room.description}
                  price={room.price}
                  images={room.images}
                  capacity={room.capacity}
                  amenities={room.amenities}
                  amenitiesList={amenitiesList} // Pasamos el catálogo para obtener íconos
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}