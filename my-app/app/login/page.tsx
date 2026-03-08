import Image from 'next/image';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <main className="w-full">
      <section className="relative min-h-screen w-full flex items-center justify-center">
        {/* Fondo */}
        <div className="absolute inset-0">
          <Image
            src="/img/banner.png"
            alt="Hotel Quinta Dalam"
            fill
            className="object-cover"
            priority
          />
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(135deg, rgba(44,36,32,0.75) 0%, rgba(61,43,31,0.6) 100%)'
            }}
          />
        </div>

        {/* Card de login */}
        <div
          className="relative z-10 w-full max-w-md mx-4"
          style={{
            backgroundColor: 'rgba(245,240,232,0.97)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(221,213,197,0.8)',
            borderRadius: '4px 28px 4px 28px',
            boxShadow: 'var(--shadow-lg)',
            padding: '2.5rem',
          }}
        >
          {/* Logo + título */}
          <div className="text-center mb-8">
            <p
              className="text-xs uppercase tracking-[0.25em] mb-3"
              style={{ color: 'var(--copper)', fontFamily: 'var(--font-ui)' }}
            >
              Bienvenido de vuelta
            </p>
            <h1
              className="font-display"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '2.4rem',
                fontWeight: 400,
                color: 'var(--charcoal)',
              }}
            >
              Iniciar Sesión
            </h1>
            <div
              className="w-12 h-px mx-auto mt-4"
              style={{ backgroundColor: 'var(--copper)', opacity: 0.5 }}
            />
          </div>

          {/* Formulario */}
          <form className="space-y-5">
            <div>
              <label
                htmlFor="correo"
                className="block text-xs font-semibold mb-2 uppercase tracking-widest"
                style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}
              >
                Correo Electrónico
              </label>
              <input
                type="email"
                id="correo"
                name="correo"
                className="input-warm"
                placeholder="tu@correo.com"
              />
            </div>

            <div>
              <label
                htmlFor="contrasena"
                className="block text-xs font-semibold mb-2 uppercase tracking-widest"
                style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}
              >
                Contraseña
              </label>
              <input
                type="password"
                id="contrasena"
                name="contrasena"
                className="input-warm"
                placeholder="••••••••"
              />
            </div>

            <button type="submit" className="btn-copper w-full text-center mt-2">
              Iniciar Sesión
            </button>
          </form>

          {/* Links secundarios */}
          <div className="mt-6 text-center space-y-2">
            <a
              href="/forgot-password"
              className="block text-xs transition-colors"
              style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}
            >
              ¿Olvidaste tu contraseña?
            </a>
            <Link
              href="/about"
              className="block text-xs font-medium transition-colors"
              style={{ color: 'var(--copper)', fontFamily: 'var(--font-ui)' }}
            >
              ¿No tienes cuenta? <span className="underline underline-offset-2">Regístrate aquí</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
