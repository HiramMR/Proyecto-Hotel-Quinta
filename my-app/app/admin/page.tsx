// ============================================================
// app/admin/page.tsx — Panel de administración
//
// Solo accesible para usuarios con role = 'admin'.
// Si un usuario normal intenta entrar, se redirige al inicio.
//
// Secciones:
// - Reservaciones: ver todas, cambiar estado
// - Usuarios: ver todos los registrados
// - Habitaciones: agregar, editar, eliminar
// ============================================================
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../lib/auth-context'
import { supabase } from '../../lib/supabase'

interface Reservation {
  id: number
  fecha_llegada: string
  fecha_salida: string
  noches: number
  total: number
  metodo_pago: string
  estado: string
  created_at: string
  profiles: { nombre: string | null; apellido: string | null; telefono: string | null }
  rooms: { title: string }
}

interface UserProfile {
  id: string
  nombre: string | null
  apellido: string | null
  telefono: string | null
  role: string | null
  created_at: string
}

interface Room {
  id: number
  title: string
  description: string
  long_description: string
  price: number
  capacity: number
  stars: number
  popular: boolean
  images: string[]
  amenities: string[]
}

const estadoColor: Record<string, string> = {
  confirmada: 'rgba(200,129,58,0.12)',
  cancelada: 'rgba(200,60,60,0.08)',
  completada: 'rgba(60,160,80,0.1)',
}
const estadoTextColor: Record<string, string> = {
  confirmada: 'var(--copper)',
  cancelada: '#c03c3c',
  completada: '#3ca050',
}
const metodoPagoLabel: Record<string, string> = {
  card: 'Tarjeta',
  transfer: 'Transferencia',
  cash: 'Pago en recepción',
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })
}

const AMENITIES_OPTIONS = [
  '1 Cama', '2 Camas', 'Agua caliente', 'Toallas',
  'Wifi', 'Television', 'Room-service', 'Pet-friendly', 'Minibar'
]

const emptyRoom: Omit<Room, 'id'> = {
  title: '', description: '', long_description: '',
  price: 0, capacity: 1, stars: 4, popular: false,
  images: [], amenities: [],
}

export default function AdminPage() {
  const { user, isAdmin, loading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'reservations' | 'users' | 'rooms'>('reservations')

  // ── Reservaciones ──
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loadingRes, setLoadingRes] = useState(true)

  // ── Usuarios ──
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loadingUsers, setLoadingUsers] = useState(true)

  // ── Habitaciones ──
  const [rooms, setRooms] = useState<Room[]>([])
  const [loadingRooms, setLoadingRooms] = useState(true)

  // ── Modal de habitación (agregar/editar) ──
  const [roomModalOpen, setRoomModalOpen] = useState(false)
  const [editingRoom, setEditingRoom] = useState<Room | null>(null)
  const [roomForm, setRoomForm] = useState<Omit<Room, 'id'>>(emptyRoom)
  const [savingRoom, setSavingRoom] = useState(false)
  const [newImageUrl, setNewImageUrl] = useState('')

  // ── Modal eliminar habitación ──
  const [deleteRoomId, setDeleteRoomId] = useState<number | null>(null)

  // Redirigir si no es admin
  useEffect(() => {
    if (!loading && (!user || !isAdmin)) router.push('/')
  }, [user, isAdmin, loading, router])

  // Cargar reservaciones
  useEffect(() => {
    if (!isAdmin) return
    supabase
      .from('reservations')
      .select(`*, profiles(nombre, apellido, telefono), rooms(title)`)
      .order('created_at', { ascending: false })
      .then(({ data }) => { setReservations(data ?? []); setLoadingRes(false) })
  }, [isAdmin])

  // Cargar usuarios
  useEffect(() => {
    if (!isAdmin) return
    supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => { setUsers(data ?? []); setLoadingUsers(false) })
  }, [isAdmin])

  // Cargar habitaciones
  useEffect(() => {
    if (!isAdmin) return
    supabase
      .from('rooms')
      .select('*')
      .order('id', { ascending: true })
      .then(({ data }) => { setRooms(data ?? []); setLoadingRooms(false) })
  }, [isAdmin])

  // ── Cambiar estado de reservación ──
  const handleEstadoChange = async (id: number, nuevoEstado: string) => {
    await supabase.from('reservations').update({ estado: nuevoEstado }).eq('id', id)
    setReservations(prev => prev.map(r => r.id === id ? { ...r, estado: nuevoEstado } : r))
  }

  // ── Abrir modal para agregar habitación ──
  const openAddRoom = () => {
    setEditingRoom(null)
    setRoomForm(emptyRoom)
    setNewImageUrl('')
    setRoomModalOpen(true)
  }

  // ── Abrir modal para editar habitación ──
  const openEditRoom = (room: Room) => {
    setEditingRoom(room)
    setRoomForm({
      title: room.title,
      description: room.description,
      long_description: room.long_description,
      price: room.price,
      capacity: room.capacity,
      stars: room.stars,
      popular: room.popular,
      images: room.images,
      amenities: room.amenities,
    })
    setNewImageUrl('')
    setRoomModalOpen(true)
  }

  // ── Guardar habitación (agregar o editar) ──
  const handleSaveRoom = async () => {
    setSavingRoom(true)
    if (editingRoom) {
      // Editar existente
      const { data } = await supabase
        .from('rooms').update(roomForm).eq('id', editingRoom.id).select().single()
      if (data) setRooms(prev => prev.map(r => r.id === editingRoom.id ? data : r))
    } else {
      // Agregar nueva
      const { data } = await supabase.from('rooms').insert(roomForm).select().single()
      if (data) setRooms(prev => [...prev, data])
    }
    setSavingRoom(false)
    setRoomModalOpen(false)
  }

  // ── Eliminar habitación ──
  const handleDeleteRoom = async () => {
    if (!deleteRoomId) return
    await supabase.from('rooms').delete().eq('id', deleteRoomId)
    setRooms(prev => prev.filter(r => r.id !== deleteRoomId))
    setDeleteRoomId(null)
  }

  // Toggle amenidad en el formulario
  const toggleAmenity = (a: string) => {
    setRoomForm(prev => ({
      ...prev,
      amenities: prev.amenities.includes(a)
        ? prev.amenities.filter(x => x !== a)
        : [...prev.amenities, a]
    }))
  }

  // Agregar imagen al formulario
  const addImage = () => {
    if (!newImageUrl.trim()) return
    setRoomForm(prev => ({ ...prev, images: [...prev.images, newImageUrl.trim()] }))
    setNewImageUrl('')
  }

  // Eliminar imagen del formulario
  const removeImage = (index: number) => {
    setRoomForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }))
  }

  if (loading || !isAdmin) return null

  return (
    <main style={{ backgroundColor: 'var(--cream)', minHeight: '100vh' }}>

      {/* ── HERO ── */}
      <section className="pt-32 pb-12 grain-overlay"
        style={{ backgroundColor: 'var(--charcoal)' }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 70% 40%, rgba(200,129,58,0.15) 0%, transparent 60%)' }} />
        <div className="container mx-auto px-6 relative z-10">
          <p className="text-xs uppercase tracking-[0.25em] mb-2"
            style={{ color: 'var(--copper)', fontFamily: 'var(--font-ui)' }}>
            Panel de administración
          </p>
          <h1 className="font-display"
            style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 300, color: 'var(--cream)' }}>
            Hotel Quinta <em>Dalam</em>
          </h1>
        </div>
      </section>

      {/* ── TABS ── */}
      <div style={{ backgroundColor: 'var(--cream-dark)', borderBottom: '1px solid var(--stone)' }}>
        <div className="container mx-auto px-6">
          <div className="flex gap-0">
            {[
              { id: 'reservations', label: 'Reservaciones' },
              { id: 'users',        label: 'Usuarios' },
              { id: 'rooms',        label: 'Habitaciones' },
            ].map(tab => (
              <button key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
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
      <div className="container mx-auto px-6 py-12 max-w-6xl">

        {/* ══════════════════════════
            TAB: RESERVACIONES
        ══════════════════════════ */}
        {activeTab === 'reservations' && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-display"
                style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 400, color: 'var(--charcoal)' }}>
                Todas las <em>reservaciones</em>
              </h2>
              <span className="text-xs px-3 py-1 rounded-full"
                style={{ backgroundColor: 'rgba(200,129,58,0.12)', color: 'var(--copper)', fontFamily: 'var(--font-ui)' }}>
                {reservations.length} total
              </span>
            </div>

            {loadingRes ? (
              <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>Cargando...</p>
            ) : reservations.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-body)', fontStyle: 'italic' }}>
                No hay reservaciones aún.
              </p>
            ) : (
              <div className="space-y-3">
                {reservations.map(res => (
                  <div key={res.id} className="p-5 rounded-2xl"
                    style={{ backgroundColor: 'var(--cream-dark)', border: '1px solid var(--stone)' }}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        {/* Habitación y huésped */}
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="font-display text-base font-semibold"
                            style={{ fontFamily: 'var(--font-display)', color: 'var(--charcoal)' }}>
                            {res.rooms?.title ?? '—'}
                          </h3>
                          <span style={{ color: 'var(--text-light)' }}>·</span>
                          <span className="text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>
                            {res.profiles?.nombre
                              ? `${res.profiles.nombre} ${res.profiles.apellido ?? ''}`.trim()
                              : 'Usuario desconocido'}
                          </span>
                        </div>
                        {/* Fechas y pago */}
                        <p className="text-xs mb-1" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>
                          {formatDate(res.fecha_llegada)} → {formatDate(res.fecha_salida)}
                          {' · '}{res.noches} {res.noches === 1 ? 'noche' : 'noches'}
                          {' · '}{metodoPagoLabel[res.metodo_pago] ?? res.metodo_pago}
                        </p>
                        <p className="text-xs" style={{ color: 'var(--text-light)', fontFamily: 'var(--font-ui)' }}>
                          #{res.id} · {new Date(res.created_at).toLocaleDateString('es-MX')}
                        </p>
                      </div>

                      {/* Total + selector de estado */}
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="font-display text-lg font-semibold"
                          style={{ fontFamily: 'var(--font-display)', color: 'var(--copper)' }}>
                          ${res.total}
                        </span>
                        <select
                          value={res.estado}
                          onChange={e => handleEstadoChange(res.id, e.target.value)}
                          className="text-xs px-3 py-1.5 rounded-full font-semibold uppercase tracking-wide"
                          style={{
                            backgroundColor: estadoColor[res.estado] ?? estadoColor.confirmada,
                            color: estadoTextColor[res.estado] ?? estadoTextColor.confirmada,
                            border: 'none',
                            fontFamily: 'var(--font-ui)',
                            cursor: 'pointer',
                          }}>
                          <option value="confirmada">Confirmada</option>
                          <option value="completada">Completada</option>
                          <option value="cancelada">Cancelada</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════
            TAB: USUARIOS
        ══════════════════════════ */}
        {activeTab === 'users' && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-display"
                style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 400, color: 'var(--charcoal)' }}>
                Usuarios <em>registrados</em>
              </h2>
              <span className="text-xs px-3 py-1 rounded-full"
                style={{ backgroundColor: 'rgba(200,129,58,0.12)', color: 'var(--copper)', fontFamily: 'var(--font-ui)' }}>
                {users.length} total
              </span>
            </div>

            {loadingUsers ? (
              <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>Cargando...</p>
            ) : (
              <div className="space-y-3">
                {users.map(u => (
                  <div key={u.id} className="p-4 rounded-2xl flex items-center gap-4"
                    style={{ backgroundColor: 'var(--cream-dark)', border: '1px solid var(--stone)' }}>
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0"
                      style={{ backgroundColor: u.role === 'admin' ? 'var(--copper)' : 'var(--stone)', color: u.role === 'admin' ? '#fff' : 'var(--charcoal)', fontFamily: 'var(--font-display)', fontSize: '1.1rem' }}>
                      {u.nombre?.charAt(0).toUpperCase() ?? '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold"
                        style={{ color: 'var(--charcoal)', fontFamily: 'var(--font-ui)' }}>
                        {u.nombre ? `${u.nombre} ${u.apellido ?? ''}`.trim() : '—'}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>
                        {u.telefono ?? 'Sin teléfono'}
                        {' · '}Registrado el {new Date(u.created_at).toLocaleDateString('es-MX')}
                      </p>
                    </div>
                    {/* Badge de rol */}
                    <span className="text-xs px-2.5 py-1 rounded-full font-semibold uppercase tracking-wide shrink-0"
                      style={{
                        backgroundColor: u.role === 'admin' ? 'rgba(200,129,58,0.12)' : 'rgba(44,36,32,0.06)',
                        color: u.role === 'admin' ? 'var(--copper)' : 'var(--text-muted)',
                        fontFamily: 'var(--font-ui)',
                      }}>
                      {u.role ?? 'user'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════
            TAB: HABITACIONES
        ══════════════════════════ */}
        {activeTab === 'rooms' && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-display"
                style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 400, color: 'var(--charcoal)' }}>
                Gestión de <em>habitaciones</em>
              </h2>
              <button onClick={openAddRoom} className="btn-copper">
                + Agregar habitación
              </button>
            </div>

            {loadingRooms ? (
              <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>Cargando...</p>
            ) : (
              <div className="space-y-3">
                {rooms.map(room => (
                  <div key={room.id} className="p-5 rounded-2xl flex items-center gap-4"
                    style={{ backgroundColor: 'var(--cream-dark)', border: '1px solid var(--stone)' }}>
                    {/* Imagen */}
                    {room.images?.[0] && (
                      <div className="w-20 h-16 rounded-xl overflow-hidden shrink-0">
                        <img src={room.images[0]} alt={room.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-display text-base font-semibold"
                          style={{ fontFamily: 'var(--font-display)', color: 'var(--charcoal)' }}>
                          {room.title}
                        </h3>
                        {room.popular && (
                          <span className="text-xs px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: 'rgba(200,129,58,0.12)', color: 'var(--copper)', fontFamily: 'var(--font-ui)' }}>
                            Popular
                          </span>
                        )}
                      </div>
                      <p className="text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>
                        ${room.price}/noche · {room.capacity} huéspedes · {room.stars} estrellas
                      </p>
                    </div>
                    {/* Acciones */}
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => openEditRoom(room)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                        style={{ backgroundColor: 'rgba(200,129,58,0.1)', color: 'var(--copper)', fontFamily: 'var(--font-ui)', border: '1px solid rgba(200,129,58,0.2)' }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(200,129,58,0.2)'}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(200,129,58,0.1)'}>
                        Editar
                      </button>
                      <button onClick={() => setDeleteRoomId(room.id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                        style={{ backgroundColor: 'rgba(200,60,60,0.08)', color: '#c03c3c', fontFamily: 'var(--font-ui)', border: '1px solid rgba(200,60,60,0.2)' }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(200,60,60,0.15)'}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(200,60,60,0.08)'}>
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════
          MODAL: AGREGAR / EDITAR HABITACIÓN
      ══════════════════════════════════════════ */}
      {roomModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(44,36,32,0.7)', backdropFilter: 'blur(6px)' }}>
          <div className="w-full max-w-2xl rounded-2xl overflow-hidden"
            style={{ backgroundColor: 'var(--cream)', boxShadow: 'var(--shadow-lg)', maxHeight: '90vh', overflowY: 'auto' }}>

            {/* Header del modal */}
            <div className="px-8 pt-8 pb-4 flex items-center justify-between"
              style={{ borderBottom: '1px solid var(--stone)' }}>
              <h3 className="font-display text-xl"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--charcoal)' }}>
                {editingRoom ? 'Editar habitación' : 'Nueva habitación'}
              </h3>
              <button onClick={() => setRoomModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                style={{ backgroundColor: 'rgba(44,36,32,0.08)', color: 'var(--charcoal)' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--stone)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(44,36,32,0.08)'}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Formulario */}
            <div className="px-8 py-6 space-y-5">

              {/* Nombre */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest mb-2"
                  style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>Nombre</label>
                <input type="text" className="input-warm" placeholder="Suite de Lujo"
                  value={roomForm.title}
                  onChange={e => setRoomForm(p => ({ ...p, title: e.target.value }))} />
              </div>

              {/* Descripción corta */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest mb-2"
                  style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>Descripción corta</label>
                <input type="text" className="input-warm" placeholder="Vista panorámica al lago..."
                  value={roomForm.description}
                  onChange={e => setRoomForm(p => ({ ...p, description: e.target.value }))} />
              </div>

              {/* Descripción larga */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest mb-2"
                  style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>Descripción completa</label>
                <textarea rows={4} className="input-warm resize-none" placeholder="Descripción detallada de la habitación..."
                  value={roomForm.long_description}
                  onChange={e => setRoomForm(p => ({ ...p, long_description: e.target.value }))} />
              </div>

              {/* Precio, Capacidad, Estrellas */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest mb-2"
                    style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>Precio/noche</label>
                  <input type="text" className="input-warm" placeholder="250"
                    value={roomForm.price === 0 ? '' : String(roomForm.price)}
                    onChange={e => {
                      const val = e.target.value.replace(/[^0-9]/g, '')
                      setRoomForm(p => ({ ...p, price: val === '' ? 0 : Number(val) }))
                    }} />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest mb-2"
                    style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>Capacidad</label>
                  <input type="text" className="input-warm" placeholder="2"
                    value={roomForm.capacity === 0 ? '' : String(roomForm.capacity)}
                    onChange={e => {
                      const val = e.target.value.replace(/[^0-9]/g, '')
                      setRoomForm(p => ({ ...p, capacity: val === '' ? 0 : Number(val) }))
                    }} />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest mb-2"
                    style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>Estrellas</label>
                  <input type="text" className="input-warm" placeholder="4"
                    value={roomForm.stars === 0 ? '' : String(roomForm.stars)}
                    onChange={e => {
                      const val = e.target.value.replace(/[^0-9]/g, '')
                      setRoomForm(p => ({ ...p, stars: val === '' ? 0 : Number(val) }))
                    }} />
                </div>
              </div>

              {/* Popular */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setRoomForm(p => ({ ...p, popular: !p.popular }))}
                  className="w-10 h-6 rounded-full transition-colors relative"
                  style={{ backgroundColor: roomForm.popular ? 'var(--copper)' : 'var(--stone)' }}>
                  <div className="w-4 h-4 rounded-full bg-white absolute top-1 transition-all"
                    style={{ left: roomForm.popular ? '1.25rem' : '0.25rem' }} />
                </button>
                <span className="text-sm" style={{ color: 'var(--charcoal)', fontFamily: 'var(--font-ui)' }}>
                  Marcar como popular
                </span>
              </div>

              {/* Amenidades */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest mb-3"
                  style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>Amenidades</label>
                <div className="flex flex-wrap gap-2">
                  {AMENITIES_OPTIONS.map(a => (
                    <button key={a} type="button" onClick={() => toggleAmenity(a)}
                      className="px-3 py-1.5 rounded-full text-xs transition-all"
                      style={{
                        fontFamily: 'var(--font-ui)',
                        backgroundColor: roomForm.amenities.includes(a) ? 'rgba(200,129,58,0.12)' : 'var(--cream-dark)',
                        color: roomForm.amenities.includes(a) ? 'var(--copper)' : 'var(--text-muted)',
                        border: `1px solid ${roomForm.amenities.includes(a) ? 'rgba(200,129,58,0.3)' : 'var(--stone)'}`,
                      }}>
                      {a}
                    </button>
                  ))}
                </div>
              </div>

              {/* Imágenes */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest mb-2"
                  style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>Imágenes (rutas)</label>
                <div className="flex gap-2 mb-3">
                  <input type="text" className="input-warm" placeholder="/img/room1.jpg"
                    value={newImageUrl}
                    onChange={e => setNewImageUrl(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addImage() } }} />
                  <button type="button" onClick={addImage}
                    className="px-4 py-2 rounded-lg text-xs font-semibold shrink-0 transition-colors"
                    style={{ backgroundColor: 'var(--copper)', color: '#fff', fontFamily: 'var(--font-ui)' }}>
                    Agregar
                  </button>
                </div>
                {roomForm.images.length > 0 && (
                  <div className="space-y-1">
                    {roomForm.images.map((img, i) => (
                      <div key={i} className="flex items-center justify-between px-3 py-1.5 rounded-lg"
                        style={{ backgroundColor: 'var(--cream-dark)', border: '1px solid var(--stone)' }}>
                        <span className="text-xs truncate" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>{img}</span>
                        <button onClick={() => removeImage(i)} className="text-xs ml-2 shrink-0" style={{ color: '#c03c3c' }}>✕</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer del modal */}
            <div className="px-8 pb-8 flex gap-3">
              <button onClick={handleSaveRoom} className="btn-copper flex-1 text-center"
                disabled={savingRoom} style={{ opacity: savingRoom ? 0.7 : 1 }}>
                {savingRoom ? 'Guardando...' : editingRoom ? 'Guardar cambios' : 'Crear habitación'}
              </button>
              <button onClick={() => setRoomModalOpen(false)}
                className="px-6 py-3 rounded-lg text-sm font-semibold transition-colors"
                style={{ border: '1.5px solid var(--stone)', color: 'var(--charcoal)', fontFamily: 'var(--font-ui)' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--cream-dark)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════
          MODAL: CONFIRMAR ELIMINACIÓN
      ══════════════════════════════════════════ */}
      {deleteRoomId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(44,36,32,0.6)', backdropFilter: 'blur(4px)' }}>
          <div className="w-full max-w-sm p-8 rounded-2xl"
            style={{ backgroundColor: 'var(--cream)', border: '1px solid var(--stone)', boxShadow: 'var(--shadow-lg)' }}>
            <h3 className="font-display text-xl mb-3"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--charcoal)' }}>
              ¿Eliminar habitación?
            </h3>
            <p className="text-sm mb-6 leading-relaxed"
              style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-body)', fontStyle: 'italic' }}>
              Esta acción no se puede deshacer. Se eliminará permanentemente de la base de datos.
            </p>
            <div className="flex gap-3">
              <button onClick={handleDeleteRoom} className="btn-copper flex-1 text-center"
                style={{ backgroundColor: '#c03c3c', boxShadow: 'none' }}>
                Sí, eliminar
              </button>
              <button onClick={() => setDeleteRoomId(null)}
                className="flex-1 py-3 rounded-lg text-sm font-semibold transition-colors"
                style={{ border: '1.5px solid var(--stone)', color: 'var(--charcoal)', fontFamily: 'var(--font-ui)' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--cream-dark)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}