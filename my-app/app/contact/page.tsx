// ============================================================
// contact/page.tsx — Página de contacto con animaciones
// Animación de entrada en el hero + Reveal en el contenido
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

export default function ContactPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [formSent, setFormSent] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setIsMounted(true), 200);
    return () => clearTimeout(t);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSent(true);
  };

  const contactItems = [
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/></svg>,
      label: 'Dirección',
      value: 'Blvd. Lázaro Cárdenas s/n\nPátzcuaro, Michoacán, México',
    },
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"/></svg>,
      label: 'Teléfono',
      value: '+52 (434) 342-0000',
    },
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/></svg>,
      label: 'Correo',
      value: 'contacto@quintadalam.mx',
    },
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>,
      label: 'Horario de atención',
      value: 'Lun – Dom: 8:00 AM – 10:00 PM\nRecepción: 24 horas',
    },
  ];

  return (
    <main style={{ backgroundColor: 'var(--cream)', minHeight: '100vh' }}>

      {/* ── HERO con animación de entrada ── */}
      <section className="relative flex items-end pb-16 pt-40 grain-overlay overflow-hidden"
        style={{ backgroundColor: 'var(--wood-dark)', minHeight: '38vh' }}>
        {/* Gradiente radial de ambiente */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 70% 50%, rgba(200,129,58,0.3) 0%, transparent 65%)' }} />
        {/* Patrón de líneas diagonal decorativo */}
        <div className="absolute inset-0 pointer-events-none opacity-5"
          style={{ backgroundImage: 'repeating-linear-gradient(45deg, var(--copper) 0, var(--copper) 1px, transparent 0, transparent 50%)', backgroundSize: '20px 20px' }} />

        <div className="container mx-auto px-6 relative z-10">
          {/* Breadcrumb animado */}
          <p className={`text-xs uppercase tracking-[0.3em] mb-3 transition-all duration-700 ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            style={{ color: 'var(--copper)', fontFamily: 'var(--font-ui)', transitionDelay: '0ms' }}>
            Estamos aquí para ti
          </p>
          <h1 className={`font-display transition-all duration-900 ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
            style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem,6vw,5rem)', fontWeight: 300, color: 'var(--cream)', transitionDelay: '150ms' }}>
            Contáctanos
          </h1>
          {/* Línea decorativa animada que se expande */}
          <div className={`mt-5 h-px transition-all duration-1000 ${isMounted ? 'w-24 opacity-100' : 'w-0 opacity-0'}`}
            style={{ backgroundColor: 'var(--copper)', transitionDelay: '400ms' }} />
        </div>
      </section>

      {/* ── CONTENIDO ── */}
      <section className="py-20">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

            {/* Columna izquierda: info de contacto */}
            <div>
              <Reveal direction="left">
                <p className="text-xs uppercase tracking-[0.25em] mb-4"
                  style={{ color: 'var(--copper)', fontFamily: 'var(--font-ui)' }}>
                  Información de contacto
                </p>
                <h2 className="font-display mb-6"
                  style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 400, color: 'var(--charcoal)' }}>
                  Nos encantaría<br /><em>escucharte</em>
                </h2>
                <p className="text-sm leading-relaxed mb-8"
                  style={{ fontFamily: 'var(--font-body)', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                  Ya sea para hacer una reservación, consultar disponibilidad o simplemente para saber más sobre nosotros, estamos a tu disposición.
                </p>
              </Reveal>

              {/* Tarjetas de contacto con delay escalonado */}
              <div className="space-y-4">
                {contactItems.map((item, i) => (
                  <Reveal key={item.label} direction="left" delay={i * 100}>
                    <div className="flex items-start gap-4 p-4 rounded-lg transition-all duration-300"
                      style={{ backgroundColor: 'var(--cream-dark)', border: '1px solid var(--stone)', borderRadius: '4px 16px 4px 16px' }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-md)'}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.boxShadow = 'none'}>
                      <span style={{ color: 'var(--copper)', marginTop: '2px' }}>{item.icon}</span>
                      <div>
                        <p className="text-xs uppercase tracking-widest font-semibold mb-1"
                          style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>
                          {item.label}
                        </p>
                        <p className="text-sm leading-relaxed whitespace-pre-line"
                          style={{ color: 'var(--charcoal)', fontFamily: 'var(--font-body)' }}>
                          {item.value}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>

            {/* Columna derecha: formulario */}
            <Reveal direction="right" delay={150}>
              <div className="p-8"
                style={{ backgroundColor: 'var(--cream-dark)', border: '1px solid var(--stone)', borderRadius: '4px 24px 4px 24px', boxShadow: 'var(--shadow-md)' }}>
                <h3 className="font-display mb-6"
                  style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 400, color: 'var(--charcoal)' }}>
                  Envíanos un mensaje
                </h3>
                {formSent ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                      style={{ backgroundColor: 'rgba(200,129,58,0.12)', border: '2px solid var(--copper)' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"
                        className="w-8 h-8" style={{ color: 'var(--copper)' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </div>
                    <h4 className="font-display text-xl mb-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--charcoal)' }}>¡Mensaje enviado!</h4>
                    <p className="text-sm" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-body)', fontStyle: 'italic' }}>
                      Nos pondremos en contacto contigo muy pronto.
                    </p>
                  </div>
                ) : (
                  <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                      <label className="block text-xs font-semibold mb-2 uppercase tracking-widest" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>Nombre completo</label>
                      <input type="text" className="input-warm" placeholder="Tu nombre" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-2 uppercase tracking-widest" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>Correo electrónico</label>
                      <input type="email" className="input-warm" placeholder="tu@correo.com" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-2 uppercase tracking-widest" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>Teléfono</label>
                      <input type="tel" className="input-warm" placeholder="+52 ..." />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-2 uppercase tracking-widest" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>Mensaje</label>
                      <textarea rows={4} className="input-warm resize-none" placeholder="¿En qué podemos ayudarte?" />
                    </div>
                    <button type="submit" className="btn-copper w-full text-center mt-2">Enviar Mensaje</button>
                  </form>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </main>
  );
}