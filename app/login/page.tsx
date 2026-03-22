// ============================================================
// app/login/page.tsx — Página de inicio de sesión real
// Usa Supabase Auth para autenticar al usuario.
// Al iniciar sesión exitosamente, redirige al inicio.
// ============================================================
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../lib/auth-context'

export default function LoginPage() {
  const [mounted, setMounted] = useState(false)
  const [correo, setCorreo] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { user, signIn } = useAuth()

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100)
    return () => clearTimeout(t)
  }, [])

  // Si ya hay sesión activa, redirigir al inicio
  useEffect(() => {
    if (user) router.push('/')
  }, [user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    // Validaciones básicas de inicio de sesión
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(correo) || correo.length > 100) {
      setError('Ingresa un correo electrónico válido.')
      return
    }
    if (contrasena.length < 8 || contrasena.length > 16) {
      setError('Credenciales incorrectas.')
      return
    }

    setLoading(true)

    const { error } = await signIn(correo, contrasena)

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push('/')
  }

  return (
    <main className="min-h-screen flex overflow-hidden" style={{ backgroundColor: 'var(--charcoal)' }}>

      {/* ── LADO IZQUIERDO — imagen ── */}
      <div className={`hidden lg:flex lg:w-1/2 relative flex-col justify-end overflow-hidden transition-all duration-1000 ease-out ${mounted ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}>
        <Image src="/img/banner.png" alt="Hotel Quinta Dalam" fill className="object-cover" priority
          style={{ transform: 'scale(1.04)', transformOrigin: 'center' }} />
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(44,36,32,0.95) 0%, rgba(44,36,32,0.3) 50%, rgba(44,36,32,0.1) 100%)' }} />
        <div className="relative z-10 p-12 pb-14">
          <div className={`flex items-center gap-3 mb-8 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            style={{ transitionDelay: '600ms' }}>
            <div className="h-px w-8" style={{ backgroundColor: 'var(--copper)' }} />
            <span className="text-xs uppercase tracking-[0.3em]" style={{ color: 'var(--copper)', fontFamily: 'var(--font-ui)' }}>Desde 1987</span>
          </div>
          <h2 className={`mb-4 leading-tight transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
            style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.2rem, 3.5vw, 3.2rem)', fontWeight: 300, color: 'var(--cream)', transitionDelay: '700ms' }}>
            Un lugar donde<br />el tiempo<br /><em>se detiene</em>
          </h2>
          <p className={`text-sm leading-relaxed max-w-xs transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            style={{ color: 'rgba(245,240,232,0.55)', fontFamily: 'var(--font-body)', transitionDelay: '850ms' }}>
            Accede a tu cuenta para gestionar tus reservaciones y descubrir ofertas exclusivas.
          </p>
        </div>
      </div>

      {/* ── LADO DERECHO — formulario ── */}
      <div className={`w-full lg:w-1/2 flex flex-col justify-center px-6 py-16 lg:px-16 xl:px-24 relative transition-all duration-1000 ease-out ${mounted ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0'}`}
        style={{ backgroundColor: 'var(--cream)' }}>
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

          {/* Formulario */}
          <form className="space-y-5" onSubmit={handleSubmit}>

            {/* Correo */}
            <div className={`transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ transitionDelay: '400ms' }}>
              <label htmlFor="correo" className="block text-xs font-semibold uppercase tracking-widest mb-2"
                style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>
                Correo Electrónico
              </label>
              <input
                type="email"
                id="correo"
                className="input-warm"
                placeholder="tu@correo.com"
                value={correo}
                onChange={e => setCorreo(e.target.value)}
                maxLength={100}
                required
              />
            </div>

            {/* Contraseña */}
            <div className={`transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ transitionDelay: '500ms' }}>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="contrasena" className="text-xs font-semibold uppercase tracking-widest"
                  style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>
                  Contraseña
                </label>
              </div>
              <input
                type="password"
                id="contrasena"
                className="input-warm"
                placeholder="••••••••"
                value={contrasena}
                onChange={e => setContrasena(e.target.value)}
                maxLength={16}
                required
              />
            </div>

            {/* Mensaje de error */}
            {error && (
              <div className="p-3 rounded-lg text-sm"
                style={{ backgroundColor: 'rgba(200,60,60,0.08)', border: '1px solid rgba(200,60,60,0.2)', color: '#c03c3c', fontFamily: 'var(--font-ui)' }}>
                {error}
              </div>
            )}

            {/* Botón submit */}
            <div className={`transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ transitionDelay: '600ms' }}>
              <button
                type="submit"
                className="btn-copper w-full text-center mt-2"
                disabled={loading}
                style={{ opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </button>
            </div>
          </form>

          {/* Separador */}
          <div className="flex items-center gap-4 my-7">
            <div className="flex-1 h-px" style={{ backgroundColor: 'var(--stone)' }} />
            <span className="text-xs" style={{ color: 'var(--text-light)', fontFamily: 'var(--font-ui)' }}>o</span>
            <div className="flex-1 h-px" style={{ backgroundColor: 'var(--stone)' }} />
          </div>

          <p className="text-center text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>
            ¿No tienes cuenta?{' '}
            <Link href="/register" className="font-semibold underline underline-offset-2" style={{ color: 'var(--copper)' }}>
              Regístrate aquí
            </Link>
          </p>

          <div className="mt-10 pt-8 border-t" style={{ borderColor: 'var(--stone)' }}>
            <Link href="/" className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-light)', fontFamily: 'var(--font-ui)' }}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}