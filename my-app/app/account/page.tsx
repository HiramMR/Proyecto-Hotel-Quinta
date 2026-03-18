// ============================================================
// app/account/page.tsx — Página de cuenta del usuario
//
// Muestra el perfil del usuario y sus reservaciones.
// Si no hay sesión activa, redirige al login.
// ============================================================
'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams} from 'next/navigation'
import { useAuth } from '../../lib/auth-context'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'

interface Reservation {
  id: number
  room_id: number
  fecha_llegada: string
  fecha_salida: string
  noches: number
  total: number
  metodo_pago: string
  estado: string
  created_at: string
  payment_intent_id: string | null
  rooms: {
    title: string
    images: string[]
    stars: number
  }
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })
}

const metodoPagoLabel: Record<string, string> = {
  card: 'Tarjeta',
  transfer: 'Transferencia',
  cash: 'Pago en recepción',
}

const estadoColor: Record<string, string> = {
  confirmada: 'rgba(200,129,58,0.12)',
  pagada:     'rgba(60,160,80,0.1)',
  cancelada:  'rgba(200,60,60,0.08)',
  completada: 'rgba(60,160,80,0.1)',
}

const estadoTextColor: Record<string, string> = {
  confirmada: 'var(--copper)',
  pagada:     '#3ca050',
  cancelada:  '#c03c3c',
  completada: '#3ca050',
}

export default function AccountPage() {
  const { user, profile, loading, signOut } = useAuth()
  const router = useRouter()
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loadingRes, setLoadingRes] = useState(true)
  const searchParams = useSearchParams()
  const tabParam = searchParams.get('tab')
  const [activeTab, setActiveTab] = useState<'reservations' | 'profile'>(
    tabParam === 'profile' ? 'profile' : 'reservations'
  )

  // ── Estado para el modal de confirmación de cancelación ──
  const [cancelingId, setCancelingId] = useState<number | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [canceling, setCanceling] = useState(false)
  const [cancelResult, setCancelResult] = useState<{ success: boolean; message: string } | null>(null)

  // Redirigir si no hay sesión
  useEffect(() => {
    if (!loading && !user) router.push('/login')
  }, [user, loading, router])

  // Cargar reservaciones del usuario
  useEffect(() => {
    if (!user) return
    const load = async () => {
      const { data } = await supabase
        .from('reservations')
        .select(`
          *,
          rooms (
            title,
            images,
            stars
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      setReservations(data ?? [])
      setLoadingRes(false)
    }
    load()
  }, [user])

  // ── Verifica si faltan más de 48h para el check-in ──
  const canCancel = (fechaLlegada: string) => {
    const llegada = new Date(fechaLlegada + 'T00:00:00')
    const ahora = new Date()
    const diff = llegada.getTime() - ahora.getTime()
    const horas = diff / (1000 * 60 * 60)
    return horas > 48
  }

  // ── Cancela la reservación y gestiona el reembolso ──
  const handleCancel = async () => {
    if (!cancelingId) return
    setCanceling(true)

    try {
      const res = await fetch('/api/cancel-reservation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reservationId: cancelingId }),
      })
      const data = await res.json()

      if (!res.ok) {
        setCancelResult({ success: false, message: data.error ?? 'Error al cancelar' })
        setCanceling(false)
        return
      }

      // Actualizar estado local
      setReservations(prev =>
        prev.map(r => r.id === cancelingId ? { ...r, estado: 'cancelada' } : r)
      )

      // Mensaje según método de pago
      if (data.refunded) {
        setCancelResult({
          success: true,
          message: 'Reservación cancelada. El reembolso se procesará en 5-10 días hábiles en tu tarjeta.',
        })
      } else {
        setCancelResult({
          success: true,
          message: 'Reservación cancelada. Un representante del hotel se pondrá en contacto contigo para gestionar el reembolso.',
        })
      }
    } catch {
      setCancelResult({ success: false, message: 'Error de conexión. Intenta de nuevo.' })
    }

    setCanceling(false)
    setConfirmOpen(false)
    setCancelingId(null)
  }

  if (loading || !user) return null

  const displayName = profile?.nombre
    ? `${profile.nombre} ${profile.apellido ?? ''}`.trim()
    : user.email ?? ''

  const initial = profile?.nombre
    ? profile.nombre.charAt(0).toUpperCase()
    : user.email?.charAt(0).toUpperCase() ?? '?'

  return (
    <main style={{ backgroundColor: 'var(--cream)', minHeight: '100vh' }}>

      {/* ── HERO ── */}
      <section className="pt-32 pb-12 grain-overlay"
        style={{ backgroundColor: 'var(--charcoal)' }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 30% 60%, rgba(139,94,60,0.3) 0%, transparent 65%)' }} />
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex items-center gap-5">
            {/* Avatar grande */}
            <div className="w-16 h-16 rounded-full flex items-center justify-center font-bold shrink-0"
              style={{ backgroundColor: 'var(--copper)', color: '#fff', fontFamily: 'var(--font-display)', fontSize: '1.8rem', boxShadow: '0 4px 20px rgba(200,129,58,0.4)' }}>
              {initial}
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.25em] mb-1"
                style={{ color: 'var(--copper)', fontFamily: 'var(--font-ui)' }}>
                Mi cuenta
              </p>
              <h1 className="font-display"
                style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 300, color: 'var(--cream)' }}>
                {displayName}
              </h1>
              <p className="text-sm mt-1"
                style={{ color: 'rgba(245,240,232,0.5)', fontFamily: 'var(--font-ui)' }}>
                {user.email}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── TABS ── */}
      <div style={{ backgroundColor: 'var(--cream-dark)', borderBottom: '1px solid var(--stone)' }}>
        <div className="container mx-auto px-6">
          <div className="flex gap-0">
            {[
              { id: 'reservations', label: 'Mis Reservaciones' },
              { id: 'profile',      label: 'Mi Perfil' },
            ].map(tab => (
              <button key={tab.id}
                onClick={() => setActiveTab(tab.id as 'reservations' | 'profile')}
                className="px-6 py-4 text-xs font-semibold uppercase tracking-widest transition-all duration-200"
                style={{
                  fontFamily: 'var(--font-ui)',
                  color: activeTab === tab.id ? 'var(--copper)' : 'var(--text-muted)',
                  borderBottom: activeTab === tab.id ? '2px solid var(--copper)' : '2px solid transparent',
                }}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── CONTENIDO ── */}
      <div className="container mx-auto px-6 py-12 max-w-4xl">

        {/* ── TAB: RESERVACIONES ── */}
        {activeTab === 'reservations' && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-display"
                style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 400, color: 'var(--charcoal)' }}>
                Historial de <em>reservaciones</em>
              </h2>
              <span className="text-xs px-3 py-1 rounded-full"
                style={{ backgroundColor: 'rgba(200,129,58,0.12)', color: 'var(--copper)', fontFamily: 'var(--font-ui)' }}>
                {reservations.length} {reservations.length === 1 ? 'reservación' : 'reservaciones'}
              </span>
            </div>

            {loadingRes ? (
              <div className="text-center py-20">
                <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>Cargando...</p>
              </div>
            ) : reservations.length === 0 ? (
              // Estado vacío
              <div className="text-center py-20">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                  style={{ backgroundColor: 'var(--cream-dark)', border: '1px solid var(--stone)' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                    className="w-7 h-7" style={{ color: 'var(--text-light)' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                  </svg>
                </div>
                <h3 className="font-display text-xl mb-2"
                  style={{ fontFamily: 'var(--font-display)', color: 'var(--charcoal)' }}>
                  Sin reservaciones aún
                </h3>
                <p className="text-sm mb-6"
                  style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-body)', fontStyle: 'italic' }}>
                  Cuando hagas una reservación aparecerá aquí.
                </p>
                <Link href="/rooms" className="btn-copper">Ver habitaciones</Link>
              </div>
            ) : (
              // Lista de reservaciones
              <div className="space-y-4">
                {reservations.map(res => (
                  <div key={res.id} className="p-5 rounded-2xl transition-all duration-300"
                    style={{ backgroundColor: 'var(--cream-dark)', border: '1px solid var(--stone)' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-md)'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.boxShadow = 'none'}>
                    <div className="flex flex-col sm:flex-row gap-4">

                      {/* Imagen de la habitación */}
                      {res.rooms?.images?.[0] && (
                        <div className="relative w-full sm:w-32 h-24 rounded-xl overflow-hidden shrink-0">
                          <img src={res.rooms.images[0]} alt={res.rooms?.title}
                            className="w-full h-full object-cover" />
                        </div>
                      )}

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="font-display text-lg font-semibold"
                            style={{ fontFamily: 'var(--font-display)', color: 'var(--charcoal)' }}>
                            {res.rooms?.title ?? 'Habitación'}
                          </h3>
                          {/* Badge de estado */}
                          <span className="text-xs px-2.5 py-1 rounded-full font-semibold shrink-0 uppercase tracking-wide"
                            style={{
                              backgroundColor: estadoColor[res.estado] ?? estadoColor.confirmada,
                              color: estadoTextColor[res.estado] ?? estadoTextColor.confirmada,
                              fontFamily: 'var(--font-ui)',
                            }}>
                            {res.estado}
                          </span>
                        </div>

                        {/* Fechas */}
                        <div className="flex items-center gap-2 mb-2 text-xs"
                          style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--copper)' }}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                          </svg>
                          {formatDate(res.fecha_llegada)} → {formatDate(res.fecha_salida)}
                          <span style={{ color: 'var(--text-light)' }}>·</span>
                          {res.noches} {res.noches === 1 ? 'noche' : 'noches'}
                        </div>

                        {/* Pago y total */}
                        <div className="flex items-center justify-between">
                          <span className="text-xs"
                            style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>
                            {metodoPagoLabel[res.metodo_pago] ?? res.metodo_pago}
                          </span>
                          <span className="font-display text-xl font-semibold"
                            style={{ fontFamily: 'var(--font-display)', color: 'var(--copper)' }}>
                            ${res.total}
                          </span>
                        </div>

                        {/* Botón cancelar — solo si la reservación está confirmada o pagada */}
                        {(res.estado === 'confirmada' || res.estado === 'pagada') && (
                          <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--stone)' }}>
                            {canCancel(res.fecha_llegada) ? (
                              <button
                                onClick={() => { setCancelingId(res.id); setConfirmOpen(true) }}
                                className="text-xs font-medium transition-colors"
                                style={{ color: '#c03c3c', fontFamily: 'var(--font-ui)' }}
                                onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '0.7'}
                                onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '1'}>
                                Cancelar reservación
                              </button>
                            ) : (
                              // Menos de 48h — no se puede cancelar
                              <p className="text-xs"
                                style={{ color: 'var(--text-light)', fontFamily: 'var(--font-ui)', fontStyle: 'italic' }}>
                                Ya no es posible cancelar (menos de 48h antes del check-in)
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── TAB: PERFIL ── */}
        {activeTab === 'profile' && (
          <div className="max-w-md">
            <h2 className="font-display mb-8"
              style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 400, color: 'var(--charcoal)' }}>
              Mi <em>perfil</em>
            </h2>

            <div className="space-y-4 mb-8">
              {[
                { label: 'Nombre',    value: profile?.nombre   ?? '—' },
                { label: 'Apellido',  value: profile?.apellido ?? '—' },
                { label: 'Correo',    value: user.email        ?? '—' },
                { label: 'Teléfono', value: profile?.telefono ?? '—' },
              ].map(item => (
                <div key={item.label} className="p-4 rounded-xl"
                  style={{ backgroundColor: 'var(--cream-dark)', border: '1px solid var(--stone)' }}>
                  <p className="text-xs uppercase tracking-widest font-semibold mb-1"
                    style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>
                    {item.label}
                  </p>
                  <p className="text-sm font-medium"
                    style={{ color: 'var(--charcoal)', fontFamily: 'var(--font-ui)' }}>
                    {item.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Cerrar sesión */}
            <button onClick={async () => { await signOut(); router.push('/'); }}
              className="flex items-center gap-2 text-sm transition-colors"
              style={{ color: '#c03c3c', fontFamily: 'var(--font-ui)' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '0.7'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '1'}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
              </svg>
              Cerrar sesión
            </button>
          </div>
        )}
      </div>

      {/* ── MODAL DE CONFIRMACIÓN DE CANCELACIÓN ── */}
      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(44,36,32,0.6)', backdropFilter: 'blur(4px)' }}>
          <div className="w-full max-w-sm p-8 rounded-2xl"
            style={{ backgroundColor: 'var(--cream)', border: '1px solid var(--stone)', boxShadow: 'var(--shadow-lg)' }}>
            <h3 className="font-display text-xl mb-3"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--charcoal)' }}>
              ¿Cancelar reservación?
            </h3>
            <p className="text-sm mb-4 leading-relaxed"
              style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-body)', fontStyle: 'italic' }}>
              Esta acción no se puede deshacer. La reservación quedará marcada como cancelada en tu historial.
            </p>
            {/* Info de reembolso según método de pago */}
            {(() => {
              const res = reservations.find(r => r.id === cancelingId)
              if (!res) return null
              return (
                <div className="p-3 rounded-lg mb-5 text-xs leading-relaxed"
                  style={{ backgroundColor: 'rgba(200,129,58,0.07)', border: '1px solid rgba(200,129,58,0.2)', color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>
                  {res.metodo_pago === 'card'
                    ? '💳 El reembolso se procesará automáticamente en tu tarjeta en 5-10 días hábiles.'
                    : res.metodo_pago === 'transfer'
                    ? '🏦 Un representante del hotel te contactará para gestionar el reembolso por transferencia.'
                    : '💵 Si ya realizaste algún pago en recepción, el hotel te lo devolverá directamente.'
                  }
                </div>
              )
            })()}
            <div className="flex gap-3">
              <button onClick={handleCancel} disabled={canceling}
                className="btn-copper flex-1 text-center"
                style={{ backgroundColor: '#c03c3c', boxShadow: 'none', opacity: canceling ? 0.7 : 1 }}>
                {canceling ? 'Cancelando...' : 'Sí, cancelar'}
              </button>
              <button
                onClick={() => { setConfirmOpen(false); setCancelingId(null) }}
                disabled={canceling}
                className="flex-1 py-3 rounded-lg text-sm font-semibold transition-colors"
                style={{ border: '1.5px solid var(--stone)', color: 'var(--charcoal)', fontFamily: 'var(--font-ui)' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--cream-dark)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'}>
                No, mantener
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MENSAJE DE RESULTADO DE CANCELACIÓN ── */}
      {cancelResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(44,36,32,0.6)', backdropFilter: 'blur(4px)' }}>
          <div className="w-full max-w-sm p-8 rounded-2xl text-center"
            style={{ backgroundColor: 'var(--cream)', border: '1px solid var(--stone)', boxShadow: 'var(--shadow-lg)' }}>
            <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: cancelResult.success ? 'rgba(60,160,80,0.1)' : 'rgba(200,60,60,0.08)' }}>
              {cancelResult.success
                ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="#3ca050" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="#c03c3c" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              }
            </div>
            <h3 className="font-display text-lg mb-3"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--charcoal)' }}>
              {cancelResult.success ? 'Reservación cancelada' : 'Error'}
            </h3>
            <p className="text-sm mb-6 leading-relaxed"
              style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-body)', fontStyle: 'italic' }}>
              {cancelResult.message}
            </p>
            <button onClick={() => setCancelResult(null)} className="btn-copper w-full text-center">
              Entendido
            </button>
          </div>
        </div>
      )}
    </main>
  )
}