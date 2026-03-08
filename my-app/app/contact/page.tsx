export default function ContactPage() {
  return (
    <main style={{ backgroundColor: 'var(--cream)', minHeight: '100vh' }}>
      {/* Hero mínimo */}
      <section
        className="relative flex items-end pb-16 pt-40 grain-overlay"
        style={{ backgroundColor: 'var(--wood-dark)' }}
      >
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{ background: 'radial-gradient(ellipse at 70% 50%, rgba(200,129,58,0.4) 0%, transparent 70%)' }}
        />
        <div className="container mx-auto px-6 relative z-10">
          <p className="text-xs uppercase tracking-[0.3em] mb-3" style={{ color: 'var(--copper)', fontFamily: 'var(--font-ui)' }}>
            Estamos aquí para ti
          </p>
          <h1
            className="font-display"
            style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem,6vw,5rem)', fontWeight: 300, color: 'var(--cream)' }}
          >
            Contáctanos
          </h1>
        </div>
      </section>

      {/* Contenido */}
      <section className="py-20">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Info */}
            <div>
              <p
                className="text-xs uppercase tracking-[0.25em] mb-4"
                style={{ color: 'var(--copper)', fontFamily: 'var(--font-ui)' }}
              >
                Información de contacto
              </p>
              <h2
                className="font-display mb-6"
                style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 400, color: 'var(--charcoal)' }}
              >
                Nos encantaría<br /><em>escucharte</em>
              </h2>
              <p className="text-sm leading-relaxed mb-8" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                Ya sea para hacer una reservación, consultar disponibilidad o simplemente para saber más sobre nosotros, estamos a tu disposición.
              </p>
              <div className="space-y-4">
                {[
                  { icon: '📍', label: 'Dirección', value: 'Pátzcuaro, Michoacán, México' },
                  { icon: '📞', label: 'Teléfono', value: '+52 (434) 000-0000' },
                  { icon: '✉️', label: 'Correo', value: 'contacto@quintadalam.mx' },
                ].map(item => (
                  <div key={item.label} className="flex items-start gap-4">
                    <span className="text-xl mt-0.5">{item.icon}</span>
                    <div>
                      <p className="text-xs uppercase tracking-widest font-semibold mb-1" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>
                        {item.label}
                      </p>
                      <p className="text-sm" style={{ color: 'var(--charcoal)', fontFamily: 'var(--font-body)' }}>
                        {item.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Formulario */}
            <div
              className="p-8"
              style={{
                backgroundColor: 'var(--cream-dark)',
                border: '1px solid var(--stone)',
                borderRadius: '4px 24px 4px 24px',
                boxShadow: 'var(--shadow-md)',
              }}
            >
              <h3
                className="font-display mb-6"
                style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 400, color: 'var(--charcoal)' }}
              >
                Envíanos un mensaje
              </h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold mb-2 uppercase tracking-widest" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>
                    Nombre completo
                  </label>
                  <input type="text" className="input-warm" placeholder="Tu nombre" />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-2 uppercase tracking-widest" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>
                    Correo electrónico
                  </label>
                  <input type="email" className="input-warm" placeholder="tu@correo.com" />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-2 uppercase tracking-widest" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>
                    Teléfono
                  </label>
                  <input type="tel" className="input-warm" placeholder="+52 ..." />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-2 uppercase tracking-widest" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>
                    Mensaje
                  </label>
                  <textarea
                    rows={4}
                    className="input-warm resize-none"
                    placeholder="¿En qué podemos ayudarte?"
                  />
                </div>
                <button type="submit" className="btn-copper w-full text-center mt-2">
                  Enviar Mensaje
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
