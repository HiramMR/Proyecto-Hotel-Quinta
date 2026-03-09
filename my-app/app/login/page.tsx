// ============================================================
// login/page.tsx — Página de login con animaciones
// La imagen de la izquierda aparece deslizándose desde la izquierda.
// El formulario aparece desde la derecha con fade.
// Los campos de formulario se animan con delay escalonado.
// ============================================================
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function LoginPage() {
  // mounted: activa todas las animaciones de entrada tras el primer render
  const [mounted, setMounted] = useState(false);
  useEffect(() => { const t = setTimeout(() => setMounted(true), 100); return () => clearTimeout(t); }, []);

  const fields = [
    { id: 'correo', label: 'Correo Electrónico', type: 'email', placeholder: 'tu@correo.com', delay: 400 },
    { id: 'contrasena', label: 'Contraseña', type: 'password', placeholder: '••••••••', delay: 500, extra: true },
  ];

  return (
    <main className="min-h-screen flex overflow-hidden" style={{ backgroundColor: 'var(--charcoal)' }}>

      {/* ── LADO IZQUIERDO — imagen (entra desde la izquierda) ── */}
      <div className={`hidden lg:flex lg:w-1/2 relative flex-col justify-end overflow-hidden transition-all duration-1000 ease-out ${mounted ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}>
        <Image src="/img/banner.png" alt="Hotel Quinta Dalam" fill className="object-cover" priority
          style={{ transform: 'scale(1.04)', transformOrigin: 'center' }} />
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(44,36,32,0.95) 0%, rgba(44,36,32,0.3) 50%, rgba(44,36,32,0.1) 100%)' }} />
        <div className="absolute inset-0"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`, opacity: 0.6 }} />
        <div className="relative z-10 p-12 pb-14">
          {/* Año de fundación animado */}
          <div className={`flex items-center gap-3 mb-8 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            style={{ transitionDelay: '600ms' }}>
            <div className="h-px w-8" style={{ backgroundColor: 'var(--copper)' }} />
            <span className="text-xs uppercase tracking-[0.3em]" style={{ color: 'var(--copper)', fontFamily: 'var(--font-ui)' }}>Desde 1987</span>
          </div>
          <h2 className={`mb-4 leading-tight transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
            style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.2rem, 3.5vw, 3.2rem)', fontWeight: 300, color: 'var(--cream)', letterSpacing: '-0.01em', transitionDelay: '700ms' }}>
            Un lugar donde<br />el tiempo<br /><em>se detiene</em>
          </h2>
          <p className={`text-sm leading-relaxed max-w-xs transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            style={{ color: 'rgba(245,240,232,0.55)', fontFamily: 'var(--font-body)', transitionDelay: '850ms' }}>
            Accede a tu cuenta para gestionar tus reservaciones y descubrir ofertas exclusivas.
          </p>
          {/* Ornamento */}
          <div className={`mt-10 flex items-center gap-2 transition-all duration-700 ${mounted ? 'opacity-100' : 'opacity-0'}`}
            style={{ transitionDelay: '1000ms' }}>
            <div className="h-px flex-1 max-w-16" style={{ backgroundColor: 'rgba(200,129,58,0.4)' }} />
            <div className="w-1 h-1 rounded-full" style={{ backgroundColor: 'var(--copper)' }} />
            <div className="h-px flex-1 max-w-16" style={{ backgroundColor: 'rgba(200,129,58,0.4)' }} />
          </div>
        </div>
      </div>

      {/* ── LADO DERECHO — formulario (entra desde la derecha) ── */}
      <div className={`w-full lg:w-1/2 flex flex-col justify-center px-6 py-16 lg:px-16 xl:px-24 relative transition-all duration-1000 ease-out ${mounted ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0'}`}
        style={{ backgroundColor: 'var(--cream)' }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: `radial-gradient(ellipse at 80% 20%, rgba(200,129,58,0.04) 0%, transparent 60%)` }} />
        <div className="relative w-full max-w-sm mx-auto">

          {/* Logo móvil */}
          <div className={`lg:hidden flex items-center gap-2 mb-10 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            style={{ transitionDelay: '200ms' }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--wood-dark)' }}>
              <span style={{ color: 'var(--cream)', fontSize: '0.7rem', fontFamily: 'var(--font-display)', fontWeight: 600 }}>QD</span>
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--wood-dark)', fontWeight: 600 }}>Hotel Quinta Dalam</span>
          </div>

          {/* Encabezado animado */}
          <div className="mb-10">
            <p className={`text-xs uppercase tracking-[0.25em] mb-3 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}
              style={{ color: 'var(--copper)', fontFamily: 'var(--font-ui)', transitionDelay: '250ms' }}>
              Bienvenido de vuelta
            </p>
            <h1 className={`transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
              style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 400, color: 'var(--charcoal)', lineHeight: 1.1, transitionDelay: '320ms' }}>
              Iniciar<br /><em>Sesión</em>
            </h1>
          </div>

          {/* Campos del formulario con delays escalonados */}
          <form className="space-y-5">
            {fields.map(field => (
              <div key={field.id}
                className={`transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                style={{ transitionDelay: `${field.delay}ms` }}>
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor={field.id} className="text-xs font-semibold uppercase tracking-widest"
                    style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>
                    {field.label}
                  </label>
                  {(field as any).extra && (
                    <a href="/forgot-password" className="text-xs transition-colors hover:underline"
                      style={{ color: 'var(--copper)', fontFamily: 'var(--font-ui)' }}>
                      ¿Olvidaste?
                    </a>
                  )}
                </div>
                <input type={field.type} id={field.id} name={field.id} className="input-warm" placeholder={field.placeholder} />
              </div>
            ))}
            <div className={`transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ transitionDelay: '600ms' }}>
              <button type="submit" className="btn-copper w-full text-center mt-2">Iniciar Sesión</button>
            </div>
          </form>

          {/* Separador */}
          <div className={`flex items-center gap-4 my-7 transition-all duration-700 ${mounted ? 'opacity-100' : 'opacity-0'}`}
            style={{ transitionDelay: '700ms' }}>
            <div className="flex-1 h-px" style={{ backgroundColor: 'var(--stone)' }} />
            <span className="text-xs" style={{ color: 'var(--text-light)', fontFamily: 'var(--font-ui)' }}>o</span>
            <div className="flex-1 h-px" style={{ backgroundColor: 'var(--stone)' }} />
          </div>

          <p className={`text-center text-xs transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}
            style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)', transitionDelay: '750ms' }}>
            ¿No tienes cuenta?{' '}
            <Link href="/register" className="font-semibold underline underline-offset-2" style={{ color: 'var(--copper)' }}>
              Regístrate aquí
            </Link>
          </p>

          <div className={`mt-10 pt-8 border-t transition-all duration-700 ${mounted ? 'opacity-100' : 'opacity-0'}`}
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
    </main>
  );
}