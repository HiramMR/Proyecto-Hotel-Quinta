export default function AboutPage() {
  const team = [
    { name: 'María Ramírez', role: 'Directora General', initial: 'M' },
    { name: 'Carlos Fuentes', role: 'Chef Ejecutivo', initial: 'C' },
    { name: 'Ana Lozano', role: 'Gerente de Experiencia', initial: 'A' },
  ];

  return (
    <main style={{ backgroundColor: 'var(--cream)', minHeight: '100vh' }}>

      {/* Hero */}
      <section
        className="relative flex items-end pb-16 pt-40 grain-overlay overflow-hidden"
        style={{ backgroundColor: 'var(--charcoal)' }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 30% 60%, rgba(139,94,60,0.25) 0%, transparent 65%)' }}
        />
        <div className="container mx-auto px-6 relative z-10">
          <p className="text-xs uppercase tracking-[0.3em] mb-3" style={{ color: 'var(--copper)', fontFamily: 'var(--font-ui)' }}>
            Nuestra historia
          </p>
          <h1
            className="font-display"
            style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem,6vw,5rem)', fontWeight: 300, color: 'var(--cream)' }}
          >
            Quiénes somos
          </h1>
        </div>
      </section>

      {/* Historia */}
      <section className="py-20">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] mb-4" style={{ color: 'var(--copper)', fontFamily: 'var(--font-ui)' }}>
                Desde nuestros orígenes
              </p>
              <h2
                className="font-display mb-6"
                style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem,3vw,2.8rem)', fontWeight: 400, color: 'var(--charcoal)' }}
              >
                Un refugio con<br /><em>alma michoacana</em>
              </h2>
              <p className="text-sm leading-relaxed mb-4" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                Hotel Quinta Dalam nació del deseo de ofrecer algo diferente: un espacio donde la arquitectura colonial de Pátzcuaro dialoga con el confort contemporáneo, frente a las aguas tranquilas del lago más hermoso de México.
              </p>
              <p className="text-sm leading-relaxed" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-muted)' }}>
                Cada rincón del hotel ha sido diseñado para que sientas la calidez de Michoacán: materiales locales, artesanías purépechas y una hospitalidad que viene del corazón.
              </p>
            </div>

            {/* Valores */}
            <div className="space-y-4">
              {[
                { title: 'Autenticidad', desc: 'Cada detalle refleja la cultura y tradición de Pátzcuaro.' },
                { title: 'Calidez', desc: 'Tratamos a cada huésped como parte de nuestra familia.' },
                { title: 'Naturaleza', desc: 'El lago y el bosque son parte esencial de la experiencia.' },
              ].map((v, i) => (
                <div
                  key={i}
                  className="flex gap-4 p-5"
                  style={{
                    border: '1px solid var(--stone)',
                    borderRadius: '4px 16px 4px 16px',
                    backgroundColor: 'var(--cream-dark)',
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold"
                    style={{ backgroundColor: 'var(--copper)', color: '#fff', fontFamily: 'var(--font-ui)' }}
                  >
                    {i + 1}
                  </div>
                  <div>
                    <h4
                      className="font-display text-lg font-semibold mb-1"
                      style={{ fontFamily: 'var(--font-display)', color: 'var(--charcoal)' }}
                    >
                      {v.title}
                    </h4>
                    <p className="text-xs leading-relaxed" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                      {v.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Equipo */}
      <section className="py-20" style={{ backgroundColor: 'var(--cream-dark)' }}>
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <p className="text-xs uppercase tracking-[0.25em] mb-3" style={{ color: 'var(--copper)', fontFamily: 'var(--font-ui)' }}>
            Las personas detrás
          </p>
          <h2
            className="font-display mb-12"
            style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem,3vw,2.5rem)', fontWeight: 400, color: 'var(--charcoal)' }}
          >
            Nuestro <em>equipo</em>
          </h2>
          <div className="flex flex-wrap justify-center gap-8">
            {team.map((member, i) => (
              <div key={i} className="text-center">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold"
                  style={{
                    backgroundColor: 'var(--wood-dark)',
                    color: 'var(--copper)',
                    fontFamily: 'var(--font-display)',
                    border: '2px solid var(--stone)',
                  }}
                >
                  {member.initial}
                </div>
                <h4
                  className="font-display text-lg font-semibold"
                  style={{ fontFamily: 'var(--font-display)', color: 'var(--charcoal)' }}
                >
                  {member.name}
                </h4>
                <p className="text-xs uppercase tracking-wider mt-1" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>
                  {member.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}
