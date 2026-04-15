// ============================================================
// contact/page.tsx — Página de contacto
// Formulario con nombre, teléfono y mensaje.
// El mensaje se envía al correo del admin via Resend.
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
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ nombre: '', telefono: '', mensaje: '' });

  useEffect(() => {
    const t = setTimeout(() => setIsMounted(true), 200);
    return () => clearTimeout(t);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nombre.trim() || form.nombre.trim().length < 2 || form.nombre.trim().length > 50) {
      setError('El nombre debe tener entre 2 y 50 caracteres.');
      return;
    }
    if (form.telefono.trim().replace(/\D/g, '').length < 8) {
      setError('Ingresa un teléfono válido de al menos 8 dígitos.');
      return;
    }
    if (!form.mensaje.trim() || form.mensaje.trim().length < 10 || form.mensaje.trim().length > 1000) {
      setError('El mensaje debe tener entre 10 y 1000 caracteres.');
      return;
    }

    setSending(true);
    setError('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Error al enviar el mensaje. Intenta de nuevo.');
        setSending(false);
        return;
      }
      setFormSent(true);
    } catch {
      setError('Error de conexión. Intenta de nuevo.');
    }
    setSending(false);
  };

  const contactItems = [
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/></svg>,
      label: 'Dirección',
      value: 'Quencio, Municipio de Coeneo\nMichoacán, México',
      href: null,
    },
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"/></svg>,
      label: 'Teléfono',
      value: '+52 (434) 342-0000',
      href: 'tel:+524343420000',
    },
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z" clipRule="evenodd" /></svg>,
      label: 'WhatsApp',
      value: 'Escríbenos por WhatsApp',
      href: 'https://wa.me/524343420000?text=Hola,%20me%20gustar%C3%ADa%20obtener%20m%C3%A1s%20informaci%C3%B3n%20sobre%20Quinta%20Dalam',
    },
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/></svg>,
      label: 'Correo',
      value: 'reservaciones@quintadalam.com',
      href: 'mailto:reservaciones@quintadalam.com',
    },
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>,
      label: 'Horario de atención',
      value: 'Lun – Dom: 8:00 AM – 10:00 PM\nRecepción: 24 horas',
      href: null,
    },
  ];

  const inputStyle = {
    width: '100%',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    border: '1px solid var(--stone)',
    backgroundColor: 'var(--cream)',
    color: 'var(--charcoal)',
    fontFamily: 'var(--font-ui)',
    fontSize: '0.875rem',
    outline: 'none',
    transition: 'border-color 0.2s',
  };

  return (
    <main style={{ backgroundColor: 'var(--cream)', minHeight: '100vh' }}>

      {/* ── HERO ── */}
      <section className="relative flex items-end pb-16 pt-40 grain-overlay overflow-hidden"
        style={{ backgroundColor: 'var(--wood-dark)', minHeight: '38vh' }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 70% 50%, rgba(200,129,58,0.3) 0%, transparent 65%)' }} />
        <div className="absolute inset-0 pointer-events-none opacity-5"
          style={{ backgroundImage: 'repeating-linear-gradient(45deg, var(--copper) 0, var(--copper) 1px, transparent 0, transparent 50%)', backgroundSize: '20px 20px' }} />
        <div className="container mx-auto px-6 relative z-10">
          <p className={`text-xs uppercase tracking-[0.3em] mb-3 transition-all duration-700 ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            style={{ color: 'var(--copper)', fontFamily: 'var(--font-ui)', transitionDelay: '0ms' }}>
            Estamos aquí para ti
          </p>
          <h1 className={`font-display transition-all duration-900 ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
            style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem,6vw,5rem)', fontWeight: 300, color: 'var(--cream)', transitionDelay: '150ms' }}>
            Contáctanos
          </h1>
          <div className={`mt-5 h-px transition-all duration-1000 ${isMounted ? 'w-24 opacity-100' : 'w-0 opacity-0'}`}
            style={{ backgroundColor: 'var(--copper)', transitionDelay: '400ms' }} />
        </div>
      </section>

      {/* ── CONTENIDO ── */}
      <section className="py-20">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

            {/* ── COLUMNA IZQUIERDA: info de contacto ── */}
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
                  Para reservaciones, consultas de disponibilidad o cualquier duda, contáctanos directamente. Estamos disponibles para responderte.
                </p>
              </Reveal>

              <div className="space-y-3">
                {contactItems.map((item, i) => (
                  <Reveal key={item.label} direction="left" delay={i * 80}>
                    {item.href ? (
                      <a href={item.href}
                        target={item.href.startsWith('http') ? '_blank' : undefined}
                        rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="flex items-start gap-4 p-4 transition-all duration-300 group"
                        style={{ backgroundColor: 'var(--cream-dark)', border: '1px solid var(--stone)', borderRadius: '4px 16px 4px 16px', textDecoration: 'none' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-md)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--copper)'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = 'none'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--stone)'; }}>
                        <span style={{ color: 'var(--copper)', marginTop: '2px', flexShrink: 0 }}>{item.icon}</span>
                        <div>
                          <p className="text-xs uppercase tracking-widest font-semibold mb-0.5"
                            style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>
                            {item.label}
                          </p>
                          <p className="text-sm leading-relaxed"
                            style={{ color: 'var(--charcoal)', fontFamily: 'var(--font-body)', fontWeight: 500 }}>
                            {item.value}
                          </p>
                        </div>
                      </a>
                    ) : (
                      <div className="flex items-start gap-4 p-4 transition-all duration-300"
                        style={{ backgroundColor: 'var(--cream-dark)', border: '1px solid var(--stone)', borderRadius: '4px 16px 4px 16px' }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-md)'}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.boxShadow = 'none'}>
                        <span style={{ color: 'var(--copper)', marginTop: '2px', flexShrink: 0 }}>{item.icon}</span>
                        <div>
                          <p className="text-xs uppercase tracking-widest font-semibold mb-0.5"
                            style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>
                            {item.label}
                          </p>
                          <p className="text-sm leading-relaxed whitespace-pre-line"
                            style={{ color: 'var(--charcoal)', fontFamily: 'var(--font-body)' }}>
                            {item.value}
                          </p>
                        </div>
                      </div>
                    )}
                  </Reveal>
                ))}
              </div>
            </div>

            {/* ── COLUMNA DERECHA: formulario ── */}
            <Reveal direction="right" delay={150}>
              <div className="p-8"
                style={{ backgroundColor: 'var(--cream-dark)', border: '1px solid var(--stone)', borderRadius: '4px 24px 4px 24px', boxShadow: 'var(--shadow-md)' }}>

                {formSent ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                      style={{ backgroundColor: 'rgba(200,129,58,0.12)', border: '2px solid var(--copper)' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"
                        className="w-8 h-8" style={{ color: 'var(--copper)' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </div>
                    <h4 className="font-display text-xl mb-2"
                      style={{ fontFamily: 'var(--font-display)', color: 'var(--charcoal)' }}>
                      ¡Mensaje enviado!
                    </h4>
                    <p className="text-sm leading-relaxed"
                      style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-body)', fontStyle: 'italic' }}>
                      Recibimos tu mensaje. Nos pondremos en contacto contigo a la brevedad.
                    </p>
                  </div>
                ) : (
                  <>
                    <h3 className="font-display mb-2"
                      style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 400, color: 'var(--charcoal)' }}>
                      Envíanos un mensaje
                    </h3>
                    <p className="text-xs mb-6 italic"
                      style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>
                      Te contactaremos por teléfono para atender tu consulta.
                    </p>

                    <div className="space-y-4">
                      {/* Nombre */}
                      <div>
                        <label className="block text-xs font-semibold mb-2 uppercase tracking-widest"
                          style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>
                          Nombre completo
                        </label>
                        <input
                          type="text"
                          placeholder="Tu nombre"
                          value={form.nombre}
                          onChange={e => setForm(p => ({ ...p, nombre: e.target.value }))}
                          style={inputStyle}
                          onFocus={e => (e.target as HTMLElement).style.borderColor = 'var(--copper)'}
                          onBlur={e => (e.target as HTMLElement).style.borderColor = 'var(--stone)'}
                        />
                      </div>

                      {/* Teléfono */}
                      <div>
                        <label className="block text-xs font-semibold mb-2 uppercase tracking-widest"
                          style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>
                          Número de teléfono
                        </label>
                        <input
                          type="tel"
                          placeholder="+52 434 000 0000"
                          value={form.telefono}
                          onChange={e => setForm(p => ({ ...p, telefono: e.target.value }))}
                          style={inputStyle}
                          onFocus={e => (e.target as HTMLElement).style.borderColor = 'var(--copper)'}
                          onBlur={e => (e.target as HTMLElement).style.borderColor = 'var(--stone)'}
                        />
                      </div>

                      {/* Mensaje */}
                      <div>
                        <label className="block text-xs font-semibold mb-2 uppercase tracking-widest"
                          style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>
                          Mensaje
                        </label>
                        <textarea
                          rows={4}
                          placeholder="¿En qué podemos ayudarte?"
                          value={form.mensaje}
                          onChange={e => setForm(p => ({ ...p, mensaje: e.target.value }))}
                          style={{ ...inputStyle, resize: 'none' }}
                          onFocus={e => (e.target as HTMLElement).style.borderColor = 'var(--copper)'}
                          onBlur={e => (e.target as HTMLElement).style.borderColor = 'var(--stone)'}
                        />
                      </div>

                      {error && (
                        <p className="text-xs" style={{ color: '#c03c3c', fontFamily: 'var(--font-ui)' }}>
                          {error}
                        </p>
                      )}

                      <button
                        onClick={handleSubmit}
                        disabled={sending}
                        className="btn-copper w-full text-center"
                        style={{ opacity: sending ? 0.7 : 1 }}>
                        {sending ? 'Enviando...' : 'Enviar mensaje'}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </main>
  );
}