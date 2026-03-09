// ============================================================
// register/page.tsx — Página de registro con animaciones
// Espejo del login: formulario desde la izquierda,
// imagen desde la derecha. Campos con delay escalonado.
// ============================================================
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function RegisterPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { const t = setTimeout(() => setMounted(true), 100); return () => clearTimeout(t); }, []);

  const formFields = [
    { id: 'nombre',     label: 'Nombre',     type: 'text',     placeholder: 'Ana',              delay: 350, half: true },
    { id: 'apellido',   label: 'Apellido',   type: 'text',     placeholder: 'García',           delay: 400, half: true },
    { id: 'correo',     label: 'Correo Electrónico', type: 'email', placeholder: 'tu@correo.com', delay: 450 },
    { id: 'telefono',   label: 'Teléfono',   type: 'tel',      placeholder: '+52 443 000 0000', delay: 500, optional: true },
    { id: 'contrasena', label: 'Contraseña', type: 'password', placeholder: '••••••••',         delay: 550 },
    { id: 'confirmar',  label: 'Confirmar Contraseña', type: 'password', placeholder: '••••••••', delay: 600 },
  ];

  // Agrupar los campos "half" en pares para el grid de 2 columnas
  const rows: (typeof formFields[number] | typeof formFields[number][])[] = [];
  let i = 0;
  while (i < formFields.length) {
    if (formFields[i].half && formFields[i + 1]?.half) {
      rows.push([formFields[i], formFields[i + 1]]);
      i += 2;
    } else {
      rows.push(formFields[i]);
      i++;
    }
  }

  return (
    <main className="min-h-screen flex overflow-hidden" style={{ backgroundColor: 'var(--charcoal)' }}>

      {/* ── FORMULARIO (lado izquierdo, entra desde la izquierda) ── */}
      <div className={`w-full lg:w-1/2 flex flex-col justify-center px-6 py-16 lg:px-16 xl:px-24 relative transition-all duration-1000 ease-out ${mounted ? 'translate-x-0 opacity-100' : '-translate-x-12 opacity-0'}`}
        style={{ backgroundColor: 'var(--cream)' }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: `radial-gradient(ellipse at 20% 80%, rgba(200,129,58,0.05) 0%, transparent 60%)` }} />
        <div className="relative w-full max-w-sm mx-auto">

          {/* Logo móvil */}
          <div className={`lg:hidden flex items-center gap-2 mb-10 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            style={{ transitionDelay: '200ms' }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--wood-dark)' }}>
              <span style={{ color: 'var(--cream)', fontSize: '0.7rem', fontFamily: 'var(--font-display)', fontWeight: 600 }}>QD</span>
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--wood-dark)', fontWeight: 600 }}>Hotel Quinta Dalam</span>
          </div>

          {/* Encabezado */}
          <div className="mb-8">
            <p className={`text-xs uppercase tracking-[0.25em] mb-3 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}
              style={{ color: 'var(--copper)', fontFamily: 'var(--font-ui)', transitionDelay: '250ms' }}>
              Tu primer paso
            </p>
            <h1 className={`transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
              style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 400, color: 'var(--charcoal)', lineHeight: 1.1, transitionDelay: '320ms' }}>
              Crear<br /><em>Cuenta</em>
            </h1>
          </div>

          {/* Formulario */}
          <form className="space-y-4">
            {rows.map((row, ri) => {
              if (Array.isArray(row)) {
                // Fila de 2 columnas (nombre + apellido)
                return (
                  <div key={ri} className="grid grid-cols-2 gap-3">
                    {row.map(field => (
                      <div key={field.id}
                        className={`transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                        style={{ transitionDelay: `${field.delay}ms` }}>
                        <label htmlFor={field.id} className="block text-xs font-semibold mb-2 uppercase tracking-widest"
                          style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>
                          {field.label}
                        </label>
                        <input type={field.type} id={field.id} name={field.id} className="input-warm" placeholder={field.placeholder} />
                      </div>
                    ))}
                  </div>
                );
              }
              // Fila de campo único
              return (
                <div key={row.id}
                  className={`transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                  style={{ transitionDelay: `${row.delay}ms` }}>
                  <label htmlFor={row.id} className="block text-xs font-semibold mb-2 uppercase tracking-widest"
                    style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>
                    {row.label}{' '}
                    {row.optional && <span style={{ color: 'var(--text-light)', textTransform: 'none', letterSpacing: 0 }}>(opcional)</span>}
                  </label>
                  <input type={row.type} id={row.id} name={row.id} className="input-warm" placeholder={row.placeholder} />
                </div>
              );
            })}

            <div className={`transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ transitionDelay: '650ms' }}>
              <button type="submit" className="btn-copper w-full text-center mt-2">Crear Cuenta</button>
            </div>
          </form>

          {/* Separador */}
          <div className={`flex items-center gap-4 my-6 transition-all duration-700 ${mounted ? 'opacity-100' : 'opacity-0'}`}
            style={{ transitionDelay: '720ms' }}>
            <div className="flex-1 h-px" style={{ backgroundColor: 'var(--stone)' }} />
            <span className="text-xs" style={{ color: 'var(--text-light)', fontFamily: 'var(--font-ui)' }}>o</span>
            <div className="flex-1 h-px" style={{ backgroundColor: 'var(--stone)' }} />
          </div>

          <p className={`text-center text-xs transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}
            style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)', transitionDelay: '780ms' }}>
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" className="font-semibold underline underline-offset-2" style={{ color: 'var(--copper)' }}>
              Inicia sesión
            </Link>
          </p>

          <div className={`mt-8 pt-8 border-t transition-all duration-700 ${mounted ? 'opacity-100' : 'opacity-0'}`}
            style={{ borderColor: 'var(--stone)', transitionDelay: '850ms' }}>
            <Link href="/" className="flex items-center gap-2 text-xs group" style={{ color: 'var(--text-light)', fontFamily: 'var(--font-ui)' }}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>

      {/* ── IMAGEN (lado derecho, entra desde la derecha) ── */}
      <div className={`hidden lg:flex lg:w-1/2 relative flex-col justify-end overflow-hidden transition-all duration-1000 ease-out ${mounted ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
        <Image src="/img/room1.jpg" alt="Habitación Hotel Quinta Dalam" fill className="object-cover" priority
          style={{ transform: 'scale(1.04)', transformOrigin: 'center' }}
          onError={(e) => { (e.target as HTMLImageElement).src = '/img/banner.png'; }} />
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(44,36,32,0.95) 0%, rgba(44,36,32,0.2) 60%, rgba(44,36,32,0.05) 100%)' }} />
        <div className="absolute inset-0"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`, opacity: 0.6 }} />
        <div className="relative z-10 p-12 pb-14">
          <div className={`flex items-center gap-3 mb-8 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            style={{ transitionDelay: '700ms' }}>
            <div className="h-px w-8" style={{ backgroundColor: 'var(--copper)' }} />
            <span className="text-xs uppercase tracking-[0.3em]" style={{ color: 'var(--copper)', fontFamily: 'var(--font-ui)' }}>Únete a nosotros</span>
          </div>
          <h2 className={`mb-4 leading-tight transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
            style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.2rem, 3.5vw, 3.2rem)', fontWeight: 300, color: 'var(--cream)', letterSpacing: '-0.01em', transitionDelay: '800ms' }}>
            Experiencias<br />que quedan<br /><em>para siempre</em>
          </h2>
          <p className={`text-sm leading-relaxed max-w-xs transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            style={{ color: 'rgba(245,240,232,0.55)', fontFamily: 'var(--font-body)', transitionDelay: '950ms' }}>
            Crea tu cuenta y accede a tarifas preferenciales, historial de reservaciones y atención personalizada.
          </p>
          <div className={`mt-10 flex items-center gap-2 transition-all duration-700 ${mounted ? 'opacity-100' : 'opacity-0'}`}
            style={{ transitionDelay: '1100ms' }}>
            <div className="h-px flex-1 max-w-16" style={{ backgroundColor: 'rgba(200,129,58,0.4)' }} />
            <div className="w-1 h-1 rounded-full" style={{ backgroundColor: 'var(--copper)' }} />
            <div className="h-px flex-1 max-w-16" style={{ backgroundColor: 'rgba(200,129,58,0.4)' }} />
          </div>
        </div>
      </div>
    </main>
  );
}