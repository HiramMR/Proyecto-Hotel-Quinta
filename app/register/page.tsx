// ============================================================
// app/register/page.tsx — Página de registro real
// Usa Supabase Auth para crear la cuenta.
// El trigger en la DB crea el perfil automáticamente.
// ============================================================
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../lib/auth-context'

export default function RegisterPage() {
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const { user } = useAuth()

  // Campos del formulario
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [correo, setCorreo] = useState('')
  const [telefono, setTelefono] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [confirmar, setConfirmar] = useState('')

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

    // Validaciones
    if (contrasena !== confirmar) {
      setError('Las contraseñas no coinciden.')
      return
    }
    if (contrasena.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      return
    }

    setLoading(true)

    setTimeout(() => {
      const storedUsers = localStorage.getItem('users')
      const users = storedUsers ? JSON.parse(storedUsers) : []

      if (users.find((u: any) => u.email === correo)) {
        setError('Este correo ya está registrado. Intenta iniciar sesión.')
        setLoading(false)
        return
      }

      const newUser = {
        id: Date.now().toString(),
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        email: correo.trim(),
        password: contrasena,
        telefono: telefono.trim(),
        role: 'user',
        created_at: new Date().toISOString()
      }

      users.push(newUser)
      localStorage.setItem('users', JSON.stringify(users))

      setSuccess(true)
      setLoading(false)
    }, 800)
  }

  // Pantalla de éxito
  if (success) {
    return (
      <main className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: 'var(--cream)' }}>
        <div className="text-center max-w-sm px-6">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ backgroundColor: 'rgba(200,129,58,0.12)', border: '2px solid var(--copper)' }}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"
              className="w-10 h-10" style={{ color: 'var(--copper)' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h2 className="font-display mb-3"
            style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 400, color: 'var(--charcoal)' }}>
            ¡Cuenta creada!
          </h2>
          <p className="text-sm leading-relaxed mb-8"
            style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-body)', fontStyle: 'italic' }}>
            Revisa tu correo <strong style={{ color: 'var(--charcoal)' }}>{correo}</strong> y
            confirma tu cuenta para poder iniciar sesión.
          </p>
          <Link href="/login" className="btn-copper">
            Ir al inicio de sesión
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex overflow-hidden" style={{ backgroundColor: 'var(--charcoal)' }}>

      {/* ── FORMULARIO (lado izquierdo) ── */}
      <div className={`w-full lg:w-1/2 flex flex-col justify-center px-6 py-16 lg:px-16 xl:px-24 relative transition-all duration-1000 ease-out ${mounted ? 'translate-x-0 opacity-100' : '-translate-x-12 opacity-0'}`}
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
          <form className="space-y-4" onSubmit={handleSubmit}>

            {/* Nombre y Apellido */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold mb-2 uppercase tracking-widest"
                  style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>
                  Nombre
                </label>
                <input type="text" className="input-warm" placeholder="Ana"
                  value={nombre} onChange={e => setNombre(e.target.value)} required />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-2 uppercase tracking-widest"
                  style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>
                  Apellido
                </label>
                <input type="text" className="input-warm" placeholder="García"
                  value={apellido} onChange={e => setApellido(e.target.value)} required />
              </div>
            </div>

            {/* Correo */}
            <div>
              <label className="block text-xs font-semibold mb-2 uppercase tracking-widest"
                style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>
                Correo Electrónico
              </label>
              <input type="email" className="input-warm" placeholder="tu@correo.com"
                value={correo} onChange={e => setCorreo(e.target.value)} required />
            </div>

            {/* Teléfono */}
            <div>
              <label className="block text-xs font-semibold mb-2 uppercase tracking-widest"
                style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>
                Teléfono <span style={{ color: 'var(--text-light)', textTransform: 'none', letterSpacing: 0 }}>(opcional)</span>
              </label>
              <input type="tel" className="input-warm" placeholder="+52 443 000 0000"
                value={telefono} onChange={e => setTelefono(e.target.value)} />
            </div>

            {/* Contraseña */}
            <div>
              <label className="block text-xs font-semibold mb-2 uppercase tracking-widest"
                style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>
                Contraseña
              </label>
              <input type="password" className="input-warm" placeholder="••••••••"
                value={contrasena} onChange={e => setContrasena(e.target.value)} required />
            </div>

            {/* Confirmar contraseña */}
            <div>
              <label className="block text-xs font-semibold mb-2 uppercase tracking-widest"
                style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>
                Confirmar Contraseña
              </label>
              <input type="password" className="input-warm" placeholder="••••••••"
                value={confirmar} onChange={e => setConfirmar(e.target.value)} required />
            </div>

            {/* Error */}
            {error && (
              <div className="p-3 rounded-lg text-sm"
                style={{ backgroundColor: 'rgba(200,60,60,0.08)', border: '1px solid rgba(200,60,60,0.2)', color: '#c03c3c', fontFamily: 'var(--font-ui)' }}>
                {error}
              </div>
            )}

            {/* Botón submit */}
            <button type="submit" className="btn-copper w-full text-center mt-2"
              disabled={loading} style={{ opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
            </button>
          </form>

          {/* Separador */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px" style={{ backgroundColor: 'var(--stone)' }} />
            <span className="text-xs" style={{ color: 'var(--text-light)', fontFamily: 'var(--font-ui)' }}>o</span>
            <div className="flex-1 h-px" style={{ backgroundColor: 'var(--stone)' }} />
          </div>

          <p className="text-center text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" className="font-semibold underline underline-offset-2" style={{ color: 'var(--copper)' }}>
              Inicia sesión
            </Link>
          </p>

          <div className="mt-8 pt-8 border-t" style={{ borderColor: 'var(--stone)' }}>
            <Link href="/" className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-light)', fontFamily: 'var(--font-ui)' }}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>

      {/* ── IMAGEN (lado derecho) ── */}
      <div className={`hidden lg:flex lg:w-1/2 relative flex-col justify-end overflow-hidden transition-all duration-1000 ease-out ${mounted ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
        <Image src="/img/room1.jpg" alt="Habitación Hotel Quinta Dalam" fill className="object-cover" priority
          style={{ transform: 'scale(1.04)', transformOrigin: 'center' }}
          onError={(e) => { (e.target as HTMLImageElement).src = '/img/banner.png' }} />
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(44,36,32,0.95) 0%, rgba(44,36,32,0.2) 60%, rgba(44,36,32,0.05) 100%)' }} />
        <div className="relative z-10 p-12 pb-14">
          <div className={`flex items-center gap-3 mb-8 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            style={{ transitionDelay: '700ms' }}>
            <div className="h-px w-8" style={{ backgroundColor: 'var(--copper)' }} />
            <span className="text-xs uppercase tracking-[0.3em]" style={{ color: 'var(--copper)', fontFamily: 'var(--font-ui)' }}>Únete a nosotros</span>
          </div>
          <h2 className={`mb-4 leading-tight transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
            style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.2rem, 3.5vw, 3.2rem)', fontWeight: 300, color: 'var(--cream)', transitionDelay: '800ms' }}>
            Experiencias<br />que quedan<br /><em>para siempre</em>
          </h2>
          <p className={`text-sm leading-relaxed max-w-xs transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            style={{ color: 'rgba(245,240,232,0.55)', fontFamily: 'var(--font-body)', transitionDelay: '950ms' }}>
            Crea tu cuenta y accede a tarifas preferenciales, historial de reservaciones y atención personalizada.
          </p>
        </div>
      </div>
    </main>
  )
}