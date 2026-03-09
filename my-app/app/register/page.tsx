'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function RegisterPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <main className="min-h-screen flex" style={{ backgroundColor: 'var(--charcoal)' }}>

      {/* ── LADO DERECHO — formulario (invertido respecto al login) ── */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 py-16 lg:px-16 xl:px-24 relative"
        style={{ backgroundColor: 'var(--cream)' }}>
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: `radial-gradient(ellipse at 20% 80%, rgba(200,129,58,0.05) 0%, transparent 60%)`,
        }} />
        <div className="relative w-full max-w-sm mx-auto" style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(16px)',
          transition: 'opacity 0.6s ease, transform 0.6s ease',
        }}>
          {/* Logo móvil */}
          <div className="lg:hidden flex items-center gap-2 mb-10">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--wood-dark)' }}>
              <span style={{ color: 'var(--cream)', fontSize: '0.7rem', fontFamily: 'var(--font-display)', fontWeight: 600 }}>QD</span>
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--wood-dark)', fontWeight: 600 }}>Hotel Quinta Dalam</span>
          </div>

          <div className="mb-10">
            <p className="text-xs uppercase tracking-[0.25em] mb-3" style={{ color: 'var(--copper)', fontFamily: 'var(--font-ui)' }}>
              Tu primer paso
            </p>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 4vw, 2.8rem)',
              fontWeight: 400,
              color: 'var(--charcoal)',
              lineHeight: 1.1,
            }}>
              Crear<br /><em>Cuenta</em>
            </h1>
          </div>

          <form className="space-y-4">
            {/* Nombre + Apellido en fila */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="nombre" className="block text-xs font-semibold mb-2 uppercase tracking-widest"
                  style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>
                  Nombre
                </label>
                <input type="text" id="nombre" name="nombre" className="input-warm" placeholder="Ana" />
              </div>
              <div>
                <label htmlFor="apellido" className="block text-xs font-semibold mb-2 uppercase tracking-widest"
                  style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>
                  Apellido
                </label>
                <input type="text" id="apellido" name="apellido" className="input-warm" placeholder="García" />
              </div>
            </div>

            <div>
              <label htmlFor="correo" className="block text-xs font-semibold mb-2 uppercase tracking-widest"
                style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>
                Correo Electrónico
              </label>
              <input type="email" id="correo" name="correo" className="input-warm" placeholder="tu@correo.com" />
            </div>

            <div>
              <label htmlFor="telefono" className="block text-xs font-semibold mb-2 uppercase tracking-widest"
                style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>
                Teléfono <span style={{ color: 'var(--text-light)', textTransform: 'none', letterSpacing: 0 }}>(opcional)</span>
              </label>
              <input type="tel" id="telefono" name="telefono" className="input-warm" placeholder="+52 443 000 0000" />
            </div>

            <div>
              <label htmlFor="contrasena" className="block text-xs font-semibold mb-2 uppercase tracking-widest"
                style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>
                Contraseña
              </label>
              <input type="password" id="contrasena" name="contrasena" className="input-warm" placeholder="••••••••" />
            </div>

            <div>
              <label htmlFor="confirmar" className="block text-xs font-semibold mb-2 uppercase tracking-widest"
                style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>
                Confirmar Contraseña
              </label>
              <input type="password" id="confirmar" name="confirmar" className="input-warm" placeholder="••••••••" />
            </div>

            <button type="submit" className="btn-copper w-full text-center mt-2">
              Crear Cuenta
            </button>
          </form>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px" style={{ backgroundColor: 'var(--stone)' }} />
            <span className="text-xs" style={{ color: 'var(--text-light)', fontFamily: 'var(--font-ui)' }}>o</span>
            <div className="flex-1 h-px" style={{ backgroundColor: 'var(--stone)' }} />
          </div>

          <p className="text-center text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" className="font-semibold underline underline-offset-2"
              style={{ color: 'var(--copper)' }}>
              Inicia sesión
            </Link>
          </p>

          <div className="mt-8 pt-8 border-t" style={{ borderColor: 'var(--stone)' }}>
            <Link href="/" className="flex items-center gap-2 text-xs group"
              style={{ color: 'var(--text-light)', fontFamily: 'var(--font-ui)' }}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>

      {/* ── LADO DERECHO — imagen (invertido) ── */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-end overflow-hidden">
        <Image
          src="/img/room1.jpg"
          alt="Habitación Hotel Quinta Dalam"
          fill
          className="object-cover"
          priority
          style={{ transform: 'scale(1.04)', transformOrigin: 'center' }}
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/img/banner.png';
          }}
        />
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to top, rgba(44,36,32,0.95) 0%, rgba(44,36,32,0.2) 60%, rgba(44,36,32,0.05) 100%)'
        }} />
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
          opacity: 0.6,
        }} />
        <div className="relative z-10 p-12 pb-14">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-px w-8" style={{ backgroundColor: 'var(--copper)' }} />
            <span className="text-xs uppercase tracking-[0.3em]" style={{ color: 'var(--copper)', fontFamily: 'var(--font-ui)' }}>
              Únete a nosotros
            </span>
          </div>
          <h2 className="mb-4 leading-tight" style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.2rem, 3.5vw, 3.2rem)',
            fontWeight: 300,
            color: 'var(--cream)',
            letterSpacing: '-0.01em',
          }}>
            Experiencias<br />que quedan<br /><em>para siempre</em>
          </h2>
          <p className="text-sm leading-relaxed max-w-xs" style={{ color: 'rgba(245,240,232,0.55)', fontFamily: 'var(--font-body)' }}>
            Crea tu cuenta y accede a tarifas preferenciales, historial de reservaciones y atención personalizada.
          </p>
          <div className="mt-10 flex items-center gap-2">
            <div className="h-px flex-1 max-w-16" style={{ backgroundColor: 'rgba(200,129,58,0.4)' }} />
            <div className="w-1 h-1 rounded-full" style={{ backgroundColor: 'var(--copper)' }} />
            <div className="h-px flex-1 max-w-16" style={{ backgroundColor: 'rgba(200,129,58,0.4)' }} />
          </div>
        </div>
      </div>
    </main>
  );
}