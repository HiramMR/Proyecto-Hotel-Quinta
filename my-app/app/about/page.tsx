// ============================================================
// about/page.tsx — Página Nosotros
// Historia real de Quinta Dalam, trayectoria y testimonios
// ============================================================
'use client';

import { useState, useEffect, useRef } from 'react';

function useInView(threshold = 0.1) {
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

export default function AboutPage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setIsMounted(true), 200);
    return () => clearTimeout(t);
  }, []);

  const testimonios = [
    {
      nombre: 'Sofía Morales',
      ciudad: 'Ciudad de México',
      estrellas: 5,
      texto: 'Una experiencia que no olvidaré. La habitación de Pátzcuaro tenía una vista increíble al manantial y cada detalle reflejaba el alma de Michoacán. Se siente como estar en casa, pero mejor.',
      inicial: 'S',
    },
    {
      nombre: 'Andrés y Valeria Castro',
      ciudad: 'Guadalajara',
      estrellas: 5,
      texto: 'Fuimos por un fin de semana y nos quedamos con ganas de más. La tranquilidad de Quencio, la calidez del equipo y la belleza del lugar nos conquistaron desde el primer momento.',
      inicial: 'A',
    },
    {
      nombre: 'Roberto Sánchez',
      ciudad: 'Monterrey',
      estrellas: 5,
      texto: 'Llegué buscando descanso y encontré mucho más: una historia detrás de cada habitación, un paisaje que te calma el alma y una familia que te recibe con el corazón abierto.',
      inicial: 'R',
    },
    {
      nombre: 'Familia Gutiérrez',
      ciudad: 'Morelia',
      estrellas: 5,
      texto: 'Llevamos a nuestros hijos a conocer Quinta Dalam y fue una lección de historia, arte y tradición michoacana. Cada habitación es un mundo distinto. ¡Volvemos pronto!',
      inicial: 'F',
    },
  ];

  const municipios = [
    { nombre: 'Tzintzunzan',   num: '101' },
    { nombre: 'Paracho',       num: '102' },
    { nombre: 'Yunuen',        num: '103' },
    { nombre: 'Pátzcuaro',     num: '104' },
    { nombre: 'Coeneo',        num: '105' },
    { nombre: 'Janitzio',      num: '106' },
    { nombre: 'Suite Quencio', num: '201', suite: true },
    { nombre: 'Morelia',       num: '202' },
    { nombre: 'Tacámbaro',     num: '203' },
    { nombre: 'Uruapan',       num: '204' },
    { nombre: 'Tlalpujahua',   num: '205' },
    { nombre: 'Cuitzeo',       num: '206' },
    { nombre: 'Cuanajo',       num: '207' },
  ];

  return (
    <main style={{ backgroundColor: 'var(--cream)', minHeight: '100vh' }}>

      {/* ── HERO ── */}
      <section className="relative flex items-end pb-16 pt-40 grain-overlay overflow-hidden"
        style={{ backgroundColor: 'var(--charcoal)', minHeight: '42vh' }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 30% 60%, rgba(139,94,60,0.3) 0%, transparent 65%)' }} />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 80% 20%, rgba(200,129,58,0.08) 0%, transparent 50%)' }} />
        <div className="container mx-auto px-6 relative z-10">
          <p className={`text-xs uppercase tracking-[0.3em] mb-3 transition-all duration-700 ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            style={{ color: 'var(--copper)', fontFamily: 'var(--font-ui)', transitionDelay: '0ms' }}>
            Nuestra historia
          </p>
          <h1 className={`font-display transition-all duration-900 ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
            style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem,6vw,5rem)', fontWeight: 300, color: 'var(--cream)', transitionDelay: '150ms' }}>
            Quiénes somos
          </h1>
          <p className={`text-base mt-4 transition-all duration-700 ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            style={{ fontFamily: 'var(--font-body)', color: 'rgba(245,240,232,0.55)', fontStyle: 'italic', transitionDelay: '300ms', maxWidth: '480px' }}>
            Un proyecto que nació del corazón de una familia michoacana y sobrevivió a todo.
          </p>
          <div className={`mt-6 h-px transition-all duration-1000 ${isMounted ? 'w-24 opacity-100' : 'w-0 opacity-0'}`}
            style={{ backgroundColor: 'var(--copper)', transitionDelay: '450ms' }} />
        </div>
      </section>

      {/* ── HISTORIA + VALORES ── */}
      <section className="py-20">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            <Reveal direction="left">
              <p className="text-xs uppercase tracking-[0.25em] mb-4" style={{ color: 'var(--copper)', fontFamily: 'var(--font-ui)' }}>
                Desde nuestros orígenes
              </p>
              <h2 className="font-display mb-6" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem,3vw,2.8rem)', fontWeight: 400, color: 'var(--charcoal)' }}>
                Un sueño familiar<br /><em>hecho realidad</em>
              </h2>
              <p className="text-sm leading-relaxed mb-4" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                Quinta Dalam nació en Quencio, un pintoresco pueblo de Michoacán con un hermoso nacimiento de agua. Fue el sueño de Daniel, un joven visionario acompañado por su padre Roberto, quienes comenzaron construyendo un hogar que con el tiempo se convirtió en hotel — no por afán lucrativo, sino por el deseo de dejar una huella positiva en la sociedad.
              </p>
              <p className="text-sm leading-relaxed mb-4" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-muted)' }}>
                El proyecto comenzó antes de la pandemia de COVID-19. La crisis sanitaria fue devastadora: Daniel y Laura, parte esencial de este sueño, perdieron la vida a causa de la enfermedad. Su partida dejó un dolor profundo en la familia Medina.
              </p>
              <p className="text-sm leading-relaxed" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-muted)' }}>
                Fue Roberto quien, en un acto de amor y desde el corazón, retomó la construcción. Plasmó en cada habitación las ideas de su hijo, un poco de Michoacán y mucho del gran espíritu familiar que los define.
              </p>
            </Reveal>

            <div className="space-y-4">
              {[
                { title: 'Amor familiar',    desc: 'Cada habitación es un homenaje a quienes dieron todo por este sueño.' },
                { title: 'Raíces purépechas', desc: 'Materiales, artesanías y tradiciones de los pueblos de Michoacán en cada rincón.' },
                { title: 'Armonía con la naturaleza', desc: 'Frente al manantial de Quencio, sin romper con la tranquilidad de la comunidad.' },
              ].map((v, i) => (
                <Reveal key={i} direction="right" delay={i * 100}>
                  <div className="flex gap-4 p-5 transition-all duration-300"
                    style={{ border: '1px solid var(--stone)', borderRadius: '4px 16px 4px 16px', backgroundColor: 'var(--cream-dark)' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-md)'; (e.currentTarget as HTMLElement).style.transform = 'translateX(4px)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = 'none'; (e.currentTarget as HTMLElement).style.transform = 'translateX(0)'; }}>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold"
                      style={{ backgroundColor: 'var(--copper)', color: '#fff', fontFamily: 'var(--font-ui)' }}>
                      {i + 1}
                    </div>
                    <div>
                      <h4 className="font-display text-lg font-semibold mb-1" style={{ fontFamily: 'var(--font-display)', color: 'var(--charcoal)' }}>{v.title}</h4>
                      <p className="text-xs leading-relaxed" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-muted)', fontStyle: 'italic' }}>{v.desc}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── MUNICIPIOS ── */}
      <section className="py-20" style={{ backgroundColor: 'var(--cream-dark)' }}>
        <div className="container mx-auto px-6 max-w-4xl">
          <Reveal direction="up">
            <p className="text-xs uppercase tracking-[0.25em] mb-3 text-center" style={{ color: 'var(--copper)', fontFamily: 'var(--font-ui)' }}>
              Michoacán en cada habitación
            </p>
            <h2 className="font-display text-center mb-4" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem,3vw,2.5rem)', fontWeight: 400, color: 'var(--charcoal)' }}>
              Un recorrido por el <em>estado</em>
            </h2>
            <p className="text-sm text-center mb-12 max-w-2xl mx-auto" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-muted)', fontStyle: 'italic' }}>
              Cada habitación de Quinta Dalam lleva el nombre y el alma de un municipio michoacano. Hospedarte aquí es hacer un viaje cultural sin salir del hotel.
            </p>
          </Reveal>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {municipios.map((m, i) => (
              <Reveal key={m.nombre} direction="up" delay={i * 50}>
                <div className="p-4 text-center transition-all duration-300 cursor-default"
                  style={{
                    borderRadius: '4px 16px 4px 16px',
                    border: `1px solid ${m.suite ? 'var(--copper)' : 'var(--stone)'}`,
                    backgroundColor: m.suite ? 'var(--copper)' : 'var(--cream)',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = m.suite ? 'var(--copper)' : 'rgba(200,129,58,0.08)';
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--copper)';
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = m.suite ? 'var(--copper)' : 'var(--cream)';
                    (e.currentTarget as HTMLElement).style.borderColor = m.suite ? 'var(--copper)' : 'var(--stone)';
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                  }}>
                  <p className="text-xs font-semibold mb-1"
                    style={{ fontFamily: 'var(--font-ui)', color: m.suite ? 'rgba(255,255,255,0.7)' : 'var(--text-light)' }}>
                    {m.num}
                  </p>
                  <p className="font-display text-base font-semibold"
                    style={{ fontFamily: 'var(--font-display)', color: m.suite ? '#fff' : 'var(--charcoal)' }}>
                    {m.nombre}
                  </p>
                  {m.suite && (
                    <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.8)', fontFamily: 'var(--font-ui)' }}>
                      Suite principal
                    </p>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── NUESTRA TRAYECTORIA ── */}
      <section className="py-20" style={{ backgroundColor: 'var(--wood-dark)' }}>
        <div className="container mx-auto px-6 max-w-3xl">
          <Reveal direction="up">
            <p className="text-xs uppercase tracking-[0.25em] mb-3 text-center" style={{ color: 'var(--copper)', fontFamily: 'var(--font-ui)' }}>
              Nuestra trayectoria
            </p>
            <h2 className="font-display text-center mb-4" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem,3vw,2.5rem)', fontWeight: 400, color: 'var(--cream)' }}>
              Un proyecto que <em>sobrevivió</em>
            </h2>
            <p className="text-sm text-center mb-12 max-w-2xl mx-auto" style={{ fontFamily: 'var(--font-body)', color: 'rgba(245,240,232,0.6)', fontStyle: 'italic' }}>
              La historia de Quinta Dalam fue contada por la prensa michoacana. Aquí te compartimos un fragmento.
            </p>
          </Reveal>

          <Reveal direction="up" delay={100}>
            <div className="relative p-8 md:p-10"
              style={{ backgroundColor: 'rgba(245,240,232,0.05)', border: '1px solid rgba(200,129,58,0.25)', borderRadius: '4px 24px 4px 24px' }}>
              {/* Comilla decorativa */}
              <div className="absolute -top-5 left-8 text-6xl leading-none"
                style={{ color: 'var(--copper)', fontFamily: 'var(--font-display)', opacity: 0.6 }}>
                "
              </div>
              <div className="space-y-4 text-sm leading-relaxed" style={{ fontFamily: 'var(--font-body)', color: 'rgba(245,240,232,0.75)', fontStyle: 'italic' }}>
                <p>
                  Quencio es un pueblito pintoresco de Michoacán, tiene un hermoso nacimiento de agua que es visitado por personas de la localidad pero que aún no tiene una vocación turística importante en la entidad, pero esto no limitó el sueño de una familia para construir una joya de arquitectura. Aquí surge Quinta Dalam.
                </p>
                <p>
                  Daniel, un joven visionario, tuvo el acompañamiento de su señor padre, y juntos comenzaron el proyecto de un hogar que después cambiaría su vocación a un hotel, sin el afán de buscar un tema lucrativo, sino de dejar una huella positiva en la sociedad.
                </p>
                <p>
                  Quinta Dalam comenzó antes de la pandemia de COVID-19, y sobrevivió, pero tristemente Daniel y Laura fueron víctimas mortales de esta terrible enfermedad, lo que dejó luto y dolor en la familia Medina.
                </p>
                <p>
                  En un acto de amor y desde el corazón, Roberto continuó la construcción del inmueble, retomando las ideas de su hijo, plasmando en cada habitación un poco de Michoacán y un mucho del gran espíritu familiar.
                </p>
              </div>
              {/* Autor */}
              <div className="mt-6 pt-5 flex items-center gap-3" style={{ borderTop: '1px solid rgba(200,129,58,0.2)' }}>
                <div className="w-8 h-px" style={{ backgroundColor: 'var(--copper)' }} />
                <p className="text-xs uppercase tracking-widest" style={{ color: 'var(--copper)', fontFamily: 'var(--font-ui)' }}>
                  César Hernández · César Hdz Noti
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── TESTIMONIOS ── */}
      <section className="py-20" style={{ backgroundColor: 'var(--cream-dark)' }}>
        <div className="container mx-auto px-6 max-w-5xl">
          <Reveal direction="up">
            <p className="text-xs uppercase tracking-[0.25em] mb-3 text-center" style={{ color: 'var(--copper)', fontFamily: 'var(--font-ui)' }}>
              Lo que dicen nuestros huéspedes
            </p>
            <h2 className="font-display text-center mb-14" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem,3vw,2.5rem)', fontWeight: 400, color: 'var(--charcoal)' }}>
              Experiencias que <em>inspiran</em>
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonios.map((t, i) => (
              <Reveal key={i} direction="up" delay={i * 100}>
                <div className="p-6 h-full transition-all duration-300"
                  style={{ backgroundColor: 'var(--cream)', border: '1px solid var(--stone)', borderRadius: '4px 20px 4px 20px' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-md)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.boxShadow = 'none'}>
                  {/* Estrellas */}
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.estrellas }).map((_, s) => (
                      <svg key={s} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" style={{ color: 'var(--copper)' }}>
                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354l-4.543 2.826c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                      </svg>
                    ))}
                  </div>
                  {/* Texto */}
                  <p className="text-sm leading-relaxed mb-5 flex-1" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                    "{t.texto}"
                  </p>
                  {/* Autor */}
                  <div className="flex items-center gap-3 pt-4" style={{ borderTop: '1px solid var(--stone)' }}>
                    <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold shrink-0"
                      style={{ backgroundColor: 'var(--wood-dark)', color: 'var(--copper)', fontFamily: 'var(--font-display)', fontSize: '1rem' }}>
                      {t.inicial}
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: 'var(--charcoal)', fontFamily: 'var(--font-ui)' }}>{t.nombre}</p>
                      <p className="text-xs" style={{ color: 'var(--text-light)', fontFamily: 'var(--font-ui)' }}>{t.ciudad}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Nota de testimonios de ejemplo */}
          <Reveal direction="up" delay={200}>
            <p className="text-xs text-center mt-10 italic" style={{ color: 'var(--text-light)', fontFamily: 'var(--font-ui)' }}>
              * Testimonios de ejemplo. Próximamente compartiremos las experiencias reales de nuestros primeros huéspedes.
            </p>
          </Reveal>
        </div>
      </section>

    </main>
  );
}