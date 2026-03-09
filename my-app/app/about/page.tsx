// ============================================================
// about/page.tsx — Página Nosotros con animaciones
// Hero con entrada escalonada + Reveal en todas las secciones
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

  const team = [
    { name: 'María Ramírez',  role: 'Directora General',      initial: 'M', bio: 'Más de 20 años liderando la hospitalidad michoacana con pasión y visión.' },
    { name: 'Carlos Fuentes', role: 'Chef Ejecutivo',         initial: 'C', bio: 'Cocina de autor con raíces purépechas, premiado por sus sabores auténticos.' },
    { name: 'Ana Lozano',     role: 'Gerente de Experiencia', initial: 'A', bio: 'Diseña experiencias que convierten cada estancia en un recuerdo imborrable.' },
  ];

  const timeline = [
    { year: '1987', event: 'Fundación del hotel en la casona colonial frente al lago.' },
    { year: '2003', event: 'Primera renovación mayor: incorporación del spa y jardines.' },
    { year: '2015', event: 'Reconocimiento como Hotel Boutique de Lujo por Sectur.' },
    { year: '2023', event: 'Apertura del restaurante de gastronomía michoacana de autor.' },
  ];

  return (
    <main style={{ backgroundColor: 'var(--cream)', minHeight: '100vh' }}>

      {/* ── HERO con animación de entrada ── */}
      <section className="relative flex items-end pb-16 pt-40 grain-overlay overflow-hidden"
        style={{ backgroundColor: 'var(--charcoal)', minHeight: '42vh' }}>
        {/* Gradiente radial de madera */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 30% 60%, rgba(139,94,60,0.3) 0%, transparent 65%)' }} />
        {/* Segundo punto de luz */}
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
          {/* Frase tagline animada */}
          <p className={`text-base mt-4 transition-all duration-700 ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            style={{ fontFamily: 'var(--font-body)', color: 'rgba(245,240,232,0.55)', fontStyle: 'italic', transitionDelay: '300ms', maxWidth: '420px' }}>
            Desde 1987, un refugio de alma michoacana frente al lago.
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
              <p className="text-xs uppercase tracking-[0.25em] mb-4" style={{ color: 'var(--copper)', fontFamily: 'var(--font-ui)' }}>Desde nuestros orígenes</p>
              <h2 className="font-display mb-6" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem,3vw,2.8rem)', fontWeight: 400, color: 'var(--charcoal)' }}>
                Un refugio con<br /><em>alma michoacana</em>
              </h2>
              <p className="text-sm leading-relaxed mb-4" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                Hotel Quinta Dalam nació del deseo de ofrecer algo diferente: un espacio donde la arquitectura colonial de Pátzcuaro dialoga con el confort contemporáneo, frente a las aguas tranquilas del lago más hermoso de México.
              </p>
              <p className="text-sm leading-relaxed" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-muted)' }}>
                Cada rincón del hotel ha sido diseñado para que sientas la calidez de Michoacán: materiales locales, artesanías purépechas y una hospitalidad que viene del corazón.
              </p>
            </Reveal>

            <div className="space-y-4">
              {[
                { title: 'Autenticidad', desc: 'Cada detalle refleja la cultura y tradición de Pátzcuaro.' },
                { title: 'Calidez',      desc: 'Tratamos a cada huésped como parte de nuestra familia.' },
                { title: 'Naturaleza',   desc: 'El lago y el bosque son parte esencial de la experiencia.' },
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

      {/* ── LÍNEA DE TIEMPO ── */}
      <section className="py-20" style={{ backgroundColor: 'var(--wood-dark)' }}>
        <div className="container mx-auto px-6 max-w-3xl">
          <Reveal direction="up">
            <p className="text-xs uppercase tracking-[0.25em] mb-3 text-center" style={{ color: 'var(--copper)', fontFamily: 'var(--font-ui)' }}>Nuestra trayectoria</p>
            <h2 className="font-display text-center mb-14" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem,3vw,2.5rem)', fontWeight: 400, color: 'var(--cream)' }}>
              Hitos que nos <em>definen</em>
            </h2>
          </Reveal>
          <div className="relative">
            {/* Línea vertical central */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 hidden md:block"
              style={{ backgroundColor: 'rgba(200,129,58,0.25)' }} />
            <div className="space-y-8">
              {timeline.map((item, i) => (
                <Reveal key={i} direction={i % 2 === 0 ? 'left' : 'right'} delay={i * 100}>
                  <div className={`flex items-center gap-6 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                    <div className={`flex-1 p-5 ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}
                      style={{ backgroundColor: 'rgba(245,240,232,0.05)', borderRadius: '4px 16px 4px 16px', border: '1px solid rgba(245,240,232,0.1)' }}>
                      <span className="text-xs uppercase tracking-widest font-bold block mb-1" style={{ color: 'var(--copper)', fontFamily: 'var(--font-ui)' }}>{item.year}</span>
                      <p className="text-sm" style={{ color: 'rgba(245,240,232,0.7)', fontFamily: 'var(--font-body)', fontStyle: 'italic' }}>{item.event}</p>
                    </div>
                    {/* Punto central */}
                    <div className="w-4 h-4 rounded-full shrink-0 hidden md:block"
                      style={{ backgroundColor: 'var(--copper)', boxShadow: '0 0 12px rgba(200,129,58,0.5)' }} />
                    <div className="flex-1 hidden md:block" />
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── EQUIPO ── */}
      <section className="py-20" style={{ backgroundColor: 'var(--cream-dark)' }}>
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <Reveal direction="up">
            <p className="text-xs uppercase tracking-[0.25em] mb-3" style={{ color: 'var(--copper)', fontFamily: 'var(--font-ui)' }}>Las personas detrás</p>
            <h2 className="font-display mb-14" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem,3vw,2.5rem)', fontWeight: 400, color: 'var(--charcoal)' }}>
              Nuestro <em>equipo</em>
            </h2>
          </Reveal>
          <div className="flex flex-wrap justify-center gap-8">
            {team.map((member, i) => (
              <Reveal key={i} direction="up" delay={i * 120} className="w-full sm:w-64">
                <div className="text-center p-6 transition-all duration-300"
                  style={{ borderRadius: '4px 20px 4px 20px' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--cream)'; (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-md)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}>
                  <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold transition-transform duration-300"
                    style={{ backgroundColor: 'var(--wood-dark)', color: 'var(--copper)', fontFamily: 'var(--font-display)', border: '2px solid var(--stone)' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = 'scale(1.08)'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = 'scale(1)'}>
                    {member.initial}
                  </div>
                  <h4 className="font-display text-lg font-semibold" style={{ fontFamily: 'var(--font-display)', color: 'var(--charcoal)' }}>{member.name}</h4>
                  <p className="text-xs uppercase tracking-wider mt-1 mb-3" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>{member.role}</p>
                  <p className="text-xs leading-relaxed" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-muted)', fontStyle: 'italic' }}>{member.bio}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}