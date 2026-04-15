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

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../lib/auth-context'
import DatePicker from '../components/DatePicker'

interface Reservation {
  id: number
  user_id?: string
  room_id?: number
  fecha_llegada: string
  fecha_salida: string
  noches: number
  total: number
  metodo_pago: string
  estado: string
  created_at: string
  payment_intent_id: string | null
  refund_id: string | null
  refund_requested: boolean | null
  profiles: { nombre: string | null; apellido: string | null; telefono: string | null }
  rooms: { title: string; images: string[], stars?: number }
}

interface UserProfile {
  id: string
  nombre: string | null
  apellido: string | null
  telefono: string | null
  role: string | null
  created_at: string
  email?: string
  password?: string
}

interface Room {
  id: number
  title: string
  description: string
  longDescription: string
  price: number
  capacity: number
  stars: number
  popular: boolean
  images: string[]
  amenities: string[]
}

interface Testimonio {
  id: string
  nombre: string
  ciudad: string
  estrellas: number
  texto: string
  inicial: string
  status: 'approved' | 'pending'
}

const estadoColor: Record<string, string> = {
  confirmada: 'rgba(200,129,58,0.12)',
  pagada:     'rgba(60,160,80,0.1)',
  cancelada:  'rgba(200,60,60,0.08)',
  completada: 'rgba(60,160,80,0.1)',
  reembolsada: 'rgba(138,126,116,0.15)',
}
const estadoTextColor: Record<string, string> = {
  confirmada: 'var(--copper)',
  pagada:     '#3ca050',
  cancelada:  '#c03c3c',
  completada: '#3ca050',
  reembolsada: 'var(--text-muted)',
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
  title: '', description: '', longDescription: '',
  price: 0, capacity: 1, stars: 4, popular: false,
  images: [], amenities: [],
}

const defaultUsers: UserProfile[] = [
  { id: '1', nombre: 'Admin', apellido: 'Sistema', email: 'admin@quintadalam.com', password: 'Admin123', telefono: '555-0000', role: 'admin', created_at: new Date().toISOString() },
  { id: '2', nombre: 'Juan', apellido: 'Pérez', email: 'juan@example.com', password: 'Password123', telefono: '555-1234', role: 'user', created_at: new Date().toISOString() },
  { id: '3', nombre: 'María', apellido: 'Gómez', email: 'maria@example.com', password: 'Password123', telefono: '555-5678', role: 'user', created_at: new Date().toISOString() }
]

const defaultReservations: Reservation[] = [
  {
    id: 1, user_id: '2', room_id: 1,
    fecha_llegada: new Date(Date.now() - 86400000 * 20).toISOString().split('T')[0],
    fecha_salida: new Date(Date.now() - 86400000 * 15).toISOString().split('T')[0],
    noches: 5, total: 7250, metodo_pago: 'card', estado: 'confirmada',
    created_at: new Date(Date.now() - 86400000 * 25).toISOString(),
    payment_intent_id: null, refund_id: null, refund_requested: false,
    profiles: { nombre: 'Juan', apellido: 'Pérez', telefono: '555-1234' },
    rooms: { title: 'Tzintzuntzan', images: ['https://scontent-qro1-1.xx.fbcdn.net/v/t39.30808-6/615280862_122111746593156061_3912196455499954122_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=7b2446&_nc_eui2=AeFlwMyVzMWh7Q0-Q3QgvD_-10j_04sPZ5nXSP_Tiw9nmYPjczFRAzIeN3zHGbtMHmzAH4FXLz8XPmCLRB8CmTbO&_nc_ohc=aijKVwecQN0Q7kNvwFw2yr2&_nc_oc=AdpzmBhhnlin11iiqP3-1Kpdg_FGU2eJLDSie-oSzSJxb7XOuaE-0IIxZgfHRF_EZZR8tPt0lCf-wS3fcwZu7Squ&_nc_zt=23&_nc_ht=scontent-qro1-1.xx&_nc_gid=Ao1jQQjqmnSQZH2An1xJQw&_nc_ss=7a32e&oh=00_AfwWU_fW30lvqElvjKOiZD7AGz7KQHAJPJ_-Fq5lAQie4w&oe=69C53FCD'], stars: 4 }
  },
  {
    id: 2, user_id: '2', room_id: 2,
    fecha_llegada: new Date(Date.now() - 86400000 * 15).toISOString().split('T')[0],
    fecha_salida: new Date(Date.now() - 86400000 * 13).toISOString().split('T')[0],
    noches: 2, total: 2600, metodo_pago: 'transfer', estado: 'pagada',
    created_at: new Date(Date.now() - 86400000 * 20).toISOString(),
    payment_intent_id: null, refund_id: null, refund_requested: false,
    profiles: { nombre: 'Juan', apellido: 'Pérez', telefono: '555-1234' },
    rooms: { title: 'Paracho', images: ['https://scontent-qro1-1.xx.fbcdn.net/v/t39.30808-6/615280862_122111746593156061_3912196455499954122_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=7b2446&_nc_eui2=AeFlwMyVzMWh7Q0-Q3QgvD_-10j_04sPZ5nXSP_Tiw9nmYPjczFRAzIeN3zHGbtMHmzAH4FXLz8XPmCLRB8CmTbO&_nc_ohc=aijKVwecQN0Q7kNvwFw2yr2&_nc_oc=AdpzmBhhnlin11iiqP3-1Kpdg_FGU2eJLDSie-oSzSJxb7XOuaE-0IIxZgfHRF_EZZR8tPt0lCf-wS3fcwZu7Squ&_nc_zt=23&_nc_ht=scontent-qro1-1.xx&_nc_gid=Ao1jQQjqmnSQZH2An1xJQw&_nc_ss=7a32e&oh=00_AfwWU_fW30lvqElvjKOiZD7AGz7KQHAJPJ_-Fq5lAQie4w&oe=69C53FCD'], stars: 4 }
  },
  {
    id: 3, user_id: '2', room_id: 3,
    fecha_llegada: new Date(Date.now() - 86400000 * 10).toISOString().split('T')[0],
    fecha_salida: new Date(Date.now() - 86400000 * 8).toISOString().split('T')[0],
    noches: 2, total: 2400, metodo_pago: 'cash', estado: 'completada',
    created_at: new Date(Date.now() - 86400000 * 12).toISOString(),
    payment_intent_id: null, refund_id: null, refund_requested: false,
    profiles: { nombre: 'Juan', apellido: 'Pérez', telefono: '555-1234' },
    rooms: { title: 'Yunuén', images: ['https://scontent-qro1-1.xx.fbcdn.net/v/t39.30808-6/615280862_122111746593156061_3912196455499954122_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=7b2446&_nc_eui2=AeFlwMyVzMWh7Q0-Q3QgvD_-10j_04sPZ5nXSP_Tiw9nmYPjczFRAzIeN3zHGbtMHmzAH4FXLz8XPmCLRB8CmTbO&_nc_ohc=aijKVwecQN0Q7kNvwFw2yr2&_nc_oc=AdpzmBhhnlin11iiqP3-1Kpdg_FGU2eJLDSie-oSzSJxb7XOuaE-0IIxZgfHRF_EZZR8tPt0lCf-wS3fcwZu7Squ&_nc_zt=23&_nc_ht=scontent-qro1-1.xx&_nc_gid=Ao1jQQjqmnSQZH2An1xJQw&_nc_ss=7a32e&oh=00_AfwWU_fW30lvqElvjKOiZD7AGz7KQHAJPJ_-Fq5lAQie4w&oe=69C53FCD'], stars: 5 }
  },
  {
    id: 4, user_id: '2', room_id: 4,
    fecha_llegada: new Date(Date.now() - 86400000 * 5).toISOString().split('T')[0],
    fecha_salida: new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0],
    noches: 2, total: 3000, metodo_pago: 'transfer', estado: 'cancelada',
    created_at: new Date(Date.now() - 86400000 * 6).toISOString(),
    payment_intent_id: null, refund_id: null, refund_requested: true,
    profiles: { nombre: 'Juan', apellido: 'Pérez', telefono: '555-1234' },
    rooms: { title: 'Pátzcuaro', images: ['https://scontent-qro1-1.xx.fbcdn.net/v/t39.30808-6/615280862_122111746593156061_3912196455499954122_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=7b2446&_nc_eui2=AeFlwMyVzMWh7Q0-Q3QgvD_-10j_04sPZ5nXSP_Tiw9nmYPjczFRAzIeN3zHGbtMHmzAH4FXLz8XPmCLRB8CmTbO&_nc_ohc=aijKVwecQN0Q7kNvwFw2yr2&_nc_oc=AdpzmBhhnlin11iiqP3-1Kpdg_FGU2eJLDSie-oSzSJxb7XOuaE-0IIxZgfHRF_EZZR8tPt0lCf-wS3fcwZu7Squ&_nc_zt=23&_nc_ht=scontent-qro1-1.xx&_nc_gid=Ao1jQQjqmnSQZH2An1xJQw&_nc_ss=7a32e&oh=00_AfwWU_fW30lvqElvjKOiZD7AGz7KQHAJPJ_-Fq5lAQie4w&oe=69C53FCD'], stars: 4 }
  },
  {
    id: 5, user_id: '2', room_id: 5,
    fecha_llegada: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
    fecha_salida: new Date(Date.now() - 86400000 * 1).toISOString().split('T')[0],
    noches: 1, total: 1100, metodo_pago: 'card', estado: 'reembolsada',
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    payment_intent_id: null, refund_id: 're_123', refund_requested: false,
    profiles: { nombre: 'Juan', apellido: 'Pérez', telefono: '555-1234' },
    rooms: { title: 'Coeneo', images: ['https://scontent-qro1-1.xx.fbcdn.net/v/t39.30808-6/615280862_122111746593156061_3912196455499954122_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=7b2446&_nc_eui2=AeFlwMyVzMWh7Q0-Q3QgvD_-10j_04sPZ5nXSP_Tiw9nmYPjczFRAzIeN3zHGbtMHmzAH4FXLz8XPmCLRB8CmTbO&_nc_ohc=aijKVwecQN0Q7kNvwFw2yr2&_nc_oc=AdpzmBhhnlin11iiqP3-1Kpdg_FGU2eJLDSie-oSzSJxb7XOuaE-0IIxZgfHRF_EZZR8tPt0lCf-wS3fcwZu7Squ&_nc_zt=23&_nc_ht=scontent-qro1-1.xx&_nc_gid=Ao1jQQjqmnSQZH2An1xJQw&_nc_ss=7a32e&oh=00_AfwWU_fW30lvqElvjKOiZD7AGz7KQHAJPJ_-Fq5lAQie4w&oe=69C53FCD'], stars: 4 }
  },
  {
    id: 6, user_id: '3', room_id: 1,
    fecha_llegada: new Date(Date.now() - 86400000 * 30).toISOString().split('T')[0],
    fecha_salida: new Date(Date.now() - 86400000 * 27).toISOString().split('T')[0],
    noches: 3, total: 4350, metodo_pago: 'card', estado: 'completada',
    created_at: new Date(Date.now() - 86400000 * 35).toISOString(),
    payment_intent_id: null, refund_id: null, refund_requested: false,
    profiles: { nombre: 'María', apellido: 'Gómez', telefono: '555-5678' },
    rooms: { title: 'Tzintzuntzan', images: ['https://scontent-qro1-1.xx.fbcdn.net/v/t39.30808-6/615280862_122111746593156061_3912196455499954122_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=7b2446&_nc_eui2=AeFlwMyVzMWh7Q0-Q3QgvD_-10j_04sPZ5nXSP_Tiw9nmYPjczFRAzIeN3zHGbtMHmzAH4FXLz8XPmCLRB8CmTbO&_nc_ohc=aijKVwecQN0Q7kNvwFw2yr2&_nc_oc=AdpzmBhhnlin11iiqP3-1Kpdg_FGU2eJLDSie-oSzSJxb7XOuaE-0IIxZgfHRF_EZZR8tPt0lCf-wS3fcwZu7Squ&_nc_zt=23&_nc_ht=scontent-qro1-1.xx&_nc_gid=Ao1jQQjqmnSQZH2An1xJQw&_nc_ss=7a32e&oh=00_AfwWU_fW30lvqElvjKOiZD7AGz7KQHAJPJ_-Fq5lAQie4w&oe=69C53FCD'], stars: 4 }
  }
]

export default function AdminPage() {
  const { user, isAdmin, loading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'reservations' | 'refunds' | 'users' | 'rooms' | 'testimonios'>('reservations')

  // ── Reservaciones ──
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loadingRes, setLoadingRes] = useState(true)

  // ── Usuarios ──
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loadingUsers, setLoadingUsers] = useState(true)

  // ── Habitaciones ──
  const [rooms, setRooms] = useState<Room[]>([])
  const [loadingRooms, setLoadingRooms] = useState(true)

  // ── Testimonios ──
  const [testimonios, setTestimonios] = useState<Testimonio[]>([])
  const [loadingTestimonios, setLoadingTestimonios] = useState(true)

  // ── Modal de habitación (agregar/editar) ──
  const [roomModalOpen, setRoomModalOpen] = useState(false)
  const [editingRoom, setEditingRoom] = useState<Room | null>(null)
  const [roomForm, setRoomForm] = useState<Omit<Room, 'id'>>(emptyRoom)
  const [savingRoom, setSavingRoom] = useState(false)
  const [newImageUrl, setNewImageUrl] = useState('')
  const [roomFormError, setRoomFormError] = useState('')

  // ── Filtros ──
  const [resFilterUser, setResFilterUser] = useState('')
  const [resFilterRoom, setResFilterRoom] = useState('')
  const [resFilterLlegada, setResFilterLlegada] = useState('')
  const [resFilterSalida, setResFilterSalida] = useState('')
  const [resSortOrder, setResSortOrder] = useState<'desc' | 'asc'>('desc')
  
  const [userSearch, setUserSearch] = useState('')
  const [userFilterRole, setUserFilterRole] = useState('')

  // ── Modal agregar reservación ──
  const [resModalOpen, setResModalOpen] = useState(false)
  const [resForm, setResForm] = useState({
    hasAccount: true, guestName: '', guestPhone: '',
    user_id: '', room_id: '', fecha_llegada: '', fecha_salida: '', metodo_pago: 'cash', estado: 'confirmada'
  })
  const [resFormError, setResFormError] = useState('')
  const [showLlegada, setShowLlegada] = useState(false)
  const [showSalida, setShowSalida] = useState(false)
  const [showFilterLlegada, setShowFilterLlegada] = useState(false)
  const [showFilterSalida, setShowFilterSalida] = useState(false)

  // ── Scroll Refs para Modal ──
  const resLlegadaRef = useRef<HTMLDivElement>(null)
  const resSalidaRef = useRef<HTMLDivElement>(null)

  // ── Modal de usuario (agregar/editar/eliminar) ──
  const [userModalOpen, setUserModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null)
  const [userForm, setUserForm] = useState({
    nombre: '', apellido: '', email: '', telefono: '', role: 'user', password: ''
  })
  const [userFormError, setUserFormError] = useState('')
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null)

  // ── Modal eliminar habitación ──
  const [deleteRoomId, setDeleteRoomId] = useState<number | null>(null)

  // Redirigir si no es admin
  useEffect(() => {
    if (!loading && (!user || !isAdmin)) router.push('/')
  }, [user, isAdmin, loading, router])

  // Cargar reservaciones
  useEffect(() => {
    if (loading || !isAdmin) return
    const stored = localStorage.getItem('reservations')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        parsed.sort((a: any, b: any) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
        setReservations(parsed)
      } catch (e) { console.error(e) }
    } else {
      localStorage.setItem('reservations', JSON.stringify(defaultReservations))
      setReservations(defaultReservations)
    }
    setLoadingRes(false)
  }, [isAdmin, loading])

  // Cargar usuarios
  useEffect(() => {
    if (loading || !isAdmin) return
    const stored = localStorage.getItem('users')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        parsed.sort((a: any, b: any) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
        setUsers(parsed)
      } catch (e) { console.error(e) }
    } else {
      localStorage.setItem('users', JSON.stringify(defaultUsers))
      setUsers(defaultUsers)
    }
    setLoadingUsers(false)
  }, [isAdmin, loading])

  // Cargar habitaciones
  useEffect(() => {
    if (loading || !isAdmin) return
    const stored = localStorage.getItem('rooms')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        parsed.sort((a: any, b: any) => a.id - b.id)
        setRooms(parsed)
      } catch (e) { console.error(e) }
    } else {
      setRooms([])
    }
    setLoadingRooms(false)
  }, [isAdmin, loading])

  // Cargar testimonios
  useEffect(() => {
    if (loading || !isAdmin) return
    const stored = localStorage.getItem('testimonios')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        parsed.sort((a: any, b: any) => (a.status === 'pending' ? -1 : 1)) // Mostrar pendientes primero
        setTestimonios(parsed)
      } catch (e) { console.error(e) }
    }
    setLoadingTestimonios(false)
  }, [isAdmin, loading])

  // ── Utilidades ──
  const calculateNights = (llegada: string, salida: string) => {
    if (!llegada || !salida) return 0;
    const a = new Date(llegada + 'T00:00:00');
    const b = new Date(salida + 'T00:00:00');
    const diff = Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  // ── Cambiar estado de reservación ──
  const handleEstadoChange = async (id: number, nuevoEstado: string) => {
    const stored = localStorage.getItem('reservations')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        const updated = parsed.map((r: any) => r.id === id ? { ...r, estado: nuevoEstado } : r)
        localStorage.setItem('reservations', JSON.stringify(updated))
      } catch (e) { console.error(e) }
    }
    setReservations(prev => prev.map(r => r.id === id ? { ...r, estado: nuevoEstado } : r))
  }

  // ── Filtros aplicados ──
  let filteredReservations = reservations.filter(r => {
    const matchRoom = resFilterRoom ? r.room_id?.toString() === resFilterRoom : true;
    const matchUser = resFilterUser ? (
      r.profiles?.nombre?.toLowerCase().includes(resFilterUser.toLowerCase()) || 
      r.profiles?.apellido?.toLowerCase().includes(resFilterUser.toLowerCase()) ||
      r.id.toString().includes(resFilterUser)
    ) : true;
    
    const matchDate = (() => {
      if (!resFilterLlegada && !resFilterSalida) return true;
      if (resFilterLlegada && !resFilterSalida) return r.fecha_salida >= resFilterLlegada;
      if (!resFilterLlegada && resFilterSalida) return r.fecha_llegada <= resFilterSalida;
      if (resFilterLlegada && resFilterSalida) {
        return r.fecha_llegada < resFilterSalida && r.fecha_salida > resFilterLlegada;
      }
      return true;
    })();
    return matchRoom && matchUser && matchDate;
  });

  filteredReservations.sort((a, b) => {
    const timeA = new Date(a.created_at).getTime();
    const timeB = new Date(b.created_at).getTime();
    return resSortOrder === 'desc' ? timeB - timeA : timeA - timeB;
  });

  const filteredUsers = users.filter(u => {
    const matchName = (() => {
      if (!userSearch) return true;
      const searchTerms = userSearch.toLowerCase().split(' ').filter(Boolean);
      const userText = `${u.nombre || ''} ${u.apellido || ''} ${u.email || ''}`.toLowerCase();
      return searchTerms.every(term => userText.includes(term));
    })();
    const matchRole = userFilterRole ? u.role === userFilterRole : true;
    return matchName && matchRole;
  });

  // ── Abrir modal para agregar habitación ──
  const openAddRoom = () => {
    setEditingRoom(null)
    setRoomForm(emptyRoom)
    setNewImageUrl('')
    setRoomFormError('')
    setRoomModalOpen(true)
  }

  // ── Abrir modal para editar habitación ──
  const openEditRoom = (room: Room) => {
    setEditingRoom(room)
    setRoomForm({
      title: room.title,
      description: room.description,
      longDescription: room.longDescription,
      price: room.price,
      capacity: room.capacity,
      stars: room.stars,
      popular: room.popular,
      images: room.images,
      amenities: room.amenities,
    })
    setNewImageUrl('')
    setRoomFormError('')
    setRoomModalOpen(true)
  }

  // ── Guardar habitación (agregar o editar) ──
  const handleSaveRoom = async () => {
    // Validaciones
    if (!roomForm.title.trim() || roomForm.title.trim().length < 3) {
      return setRoomFormError('El nombre debe tener al menos 3 caracteres.')
    }
    if (!roomForm.description.trim() || roomForm.description.trim().length < 10) {
      return setRoomFormError('La descripción corta debe tener al menos 10 caracteres.')
    }
    if (!roomForm.longDescription.trim() || roomForm.longDescription.trim().length < 20) {
      return setRoomFormError('La descripción completa debe tener al menos 20 caracteres.')
    }
    if (roomForm.price <= 0) {
      return setRoomFormError('El precio debe ser mayor a 0.')
    }
    if (roomForm.capacity <= 0) {
      return setRoomFormError('La capacidad debe ser de al menos 1 huésped.')
    }
    if (roomForm.stars < 1 || roomForm.stars > 5) {
      return setRoomFormError('Las estrellas deben estar entre 1 y 5.')
    }
    if (roomForm.images.length === 0) {
      return setRoomFormError('Agrega al menos una imagen de la habitación.')
    }

    setRoomFormError('')
    setSavingRoom(true)
    const stored = localStorage.getItem('rooms')
    let parsedRooms: Room[] = stored ? JSON.parse(stored) : []

    if (editingRoom) {
      // Editar existente
      parsedRooms = parsedRooms.map(r => r.id === editingRoom.id ? { ...roomForm, id: editingRoom.id } as Room : r)
      setRooms(parsedRooms)
    } else {
      // Agregar nueva
      const newId = parsedRooms.length > 0 ? Math.max(...parsedRooms.map(r => r.id)) + 1 : 1
      const newRoom = { ...roomForm, id: newId } as Room
      parsedRooms.push(newRoom)
      setRooms(parsedRooms)
    }
    localStorage.setItem('rooms', JSON.stringify(parsedRooms))
    setSavingRoom(false)
    setRoomModalOpen(false)
  }

  // ── Eliminar habitación ──
  const handleDeleteRoom = async () => {
    if (!deleteRoomId) return
    const stored = localStorage.getItem('rooms')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        const updated = parsed.filter((r: Room) => r.id !== deleteRoomId)
        localStorage.setItem('rooms', JSON.stringify(updated))
      } catch (e) { console.error(e) }
    }
    setRooms(prev => prev.filter(r => r.id !== deleteRoomId))
    setDeleteRoomId(null)
  }

  // ── Guardar reservación manual ──
  const handleSaveRes = () => {
    if (resForm.hasAccount) {
      if (!resForm.user_id) return setResFormError('Selecciona un huésped.')
    } else {
      if (!resForm.guestName.trim()) return setResFormError('Ingresa el nombre del huésped.')
      if (!resForm.guestPhone.trim()) return setResFormError('Ingresa el teléfono del huésped.')
    }
    if (!resForm.room_id) return setResFormError('Selecciona una habitación.')
    if (!resForm.fecha_llegada || !resForm.fecha_salida) return setResFormError('Selecciona las fechas.')
    const noches = calculateNights(resForm.fecha_llegada, resForm.fecha_salida)
    if (noches <= 0) return setResFormError('La fecha de salida debe ser posterior a la llegada.')

    const room = rooms.find(r => r.id.toString() === resForm.room_id)
    if (!room) return setResFormError('Habitación inválida.')

    let guestInfo;
    let userIdToUse;
    if (resForm.hasAccount) {
      const guest = users.find(u => u.id === resForm.user_id)
      if (!guest) return setResFormError('Usuario inválido.')
      guestInfo = { nombre: guest.nombre, apellido: guest.apellido, telefono: guest.telefono }
      userIdToUse = guest.id
    } else {
      guestInfo = { nombre: resForm.guestName, apellido: '', telefono: resForm.guestPhone }
      userIdToUse = `guest_${Date.now()}`
    }

    const newRes: Reservation = {
      id: Date.now(),
      user_id: userIdToUse,
      room_id: room.id,
      fecha_llegada: resForm.fecha_llegada,
      fecha_salida: resForm.fecha_salida,
      noches,
      total: room.price * noches,
      metodo_pago: resForm.metodo_pago,
      estado: resForm.estado,
      created_at: new Date().toISOString(),
      payment_intent_id: null,
      refund_id: null,
      refund_requested: false,
      profiles: guestInfo,
      rooms: { title: room.title, images: room.images, stars: room.stars }
    }

    const stored = localStorage.getItem('reservations')
    const parsed = stored ? JSON.parse(stored) : []
    const updated = [newRes, ...parsed]
    localStorage.setItem('reservations', JSON.stringify(updated))
    setReservations(prev => [newRes, ...prev])
    setResModalOpen(false)
  }

  // ── Guardar usuario ──
  const handleSaveUser = () => {
    if (!userForm.nombre?.trim()) return setUserFormError('El nombre es obligatorio.')
    if (!userForm.email?.trim()) return setUserFormError('El correo es obligatorio.')
    if (!editingUser && !userForm.password?.trim()) return setUserFormError('La contraseña es obligatoria.')

    if (editingUser && editingUser.id === user?.id && userForm.role !== 'admin') {
      return setUserFormError('No puedes quitarte el rol de administrador a ti mismo.')
    }

    const stored = localStorage.getItem('users')
    let parsedUsers: UserProfile[] = stored ? JSON.parse(stored) : []

    if (editingUser) {
      parsedUsers = parsedUsers.map(u => u.id === editingUser.id ? { ...u, ...userForm } as UserProfile : u)
      setUsers(prev => prev.map(u => u.id === editingUser.id ? { ...u, ...userForm } as UserProfile : u))
    } else {
      const newUser: UserProfile = {
        id: Date.now().toString(),
        ...userForm,
        created_at: new Date().toISOString()
      }
      parsedUsers = [newUser, ...parsedUsers]
      setUsers(prev => [newUser, ...prev])
    }
    localStorage.setItem('users', JSON.stringify(parsedUsers))
    setUserModalOpen(false)
  }

  // ── Eliminar usuario ──
  const handleDeleteUser = () => {
    if (!deleteUserId || deleteUserId === user?.id) return
    const stored = localStorage.getItem('users')
    if (stored) {
      const parsed = JSON.parse(stored)
      const updated = parsed.filter((u: UserProfile) => u.id !== deleteUserId)
      localStorage.setItem('users', JSON.stringify(updated))
    }
    setUsers(prev => prev.filter(u => u.id !== deleteUserId))
    setDeleteUserId(null)
  }

  // ── Aprobar / Rechazar testimonios ──
  const handleApproveTestimonio = (id: string) => {
    const updated = testimonios.map(t => t.id === id ? { ...t, status: 'approved' as const } : t)
    setTestimonios(updated)
    localStorage.setItem('testimonios', JSON.stringify(updated))
  }

  const handleRejectTestimonio = (id: string) => {
    const updated = testimonios.filter(t => t.id !== id)
    setTestimonios(updated)
    localStorage.setItem('testimonios', JSON.stringify(updated))
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
              { id: 'refunds',      label: 'Reembolsos' },
              { id: 'users',        label: 'Usuarios' },
              { id: 'rooms',        label: 'Habitaciones' },
              { id: 'testimonios',  label: 'Testimonios' },
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <h2 className="font-display"
                  style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 400, color: 'var(--charcoal)' }}>
                  Todas las <em>reservaciones</em>
                </h2>
                <span className="text-xs px-3 py-1 rounded-full mt-2 inline-block"
                  style={{ backgroundColor: 'rgba(200,129,58,0.12)', color: 'var(--copper)', fontFamily: 'var(--font-ui)' }}>
                  {filteredReservations.length} resultados
                </span>
              </div>
              <button onClick={() => { setResForm({ hasAccount: true, guestName: '', guestPhone: '', user_id: '', room_id: '', fecha_llegada: '', fecha_salida: '', metodo_pago: 'cash', estado: 'confirmada' }); setResFormError(''); setResModalOpen(true); }} className="btn-copper whitespace-nowrap w-full sm:w-auto">
                + Agregar reservación
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 mb-8 p-4 rounded-xl"
              style={{ backgroundColor: 'var(--cream-dark)', border: '1px solid var(--stone)' }}>
              <input type="text" placeholder="Buscar huésped o folio..." className="input-warm text-sm py-2 px-3"
                value={resFilterUser} onChange={e => setResFilterUser(e.target.value)} />
              
              <select className="input-warm text-sm py-2 px-3" value={resFilterRoom} onChange={e => setResFilterRoom(e.target.value)}>
                <option value="">Cualquier habitación</option>
                {rooms.map(r => (
                  <option key={r.id} value={r.id.toString()}>{r.title}</option>
                ))}
              </select>

              <div style={{ position: 'relative', zIndex: showFilterLlegada ? 10 : 'auto' }}>
                <DatePicker
                  label="Desde"
                  value={resFilterLlegada}
                  onChange={v => { setResFilterLlegada(v); setShowFilterLlegada(false); }}
                  isOpen={showFilterLlegada}
                  onToggle={() => { setShowFilterLlegada(!showFilterLlegada); setShowFilterSalida(false); }}
                />
              </div>
              <div style={{ position: 'relative', zIndex: showFilterSalida ? 10 : 'auto' }}>
                <DatePicker
                  label="Hasta"
                  value={resFilterSalida}
                  onChange={v => { setResFilterSalida(v); setShowFilterSalida(false); }}
                  isOpen={showFilterSalida}
                  onToggle={() => { setShowFilterSalida(!showFilterSalida); setShowFilterLlegada(false); }}
                  minDate={resFilterLlegada}
                />
              </div>
              
              <select className="input-warm text-sm py-2 px-3" value={resSortOrder} onChange={e => setResSortOrder(e.target.value as 'desc' | 'asc')}>
                <option value="desc">Más recientes</option>
                <option value="asc">Más antiguas</option>
              </select>
            </div>

            {loadingRes ? (
              <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>Cargando...</p>
            ) : reservations.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-body)', fontStyle: 'italic' }}>
                No hay reservaciones aún.
              </p>
            ) : (
              <div className="space-y-3">
                {filteredReservations.map(res => (
                  <div key={res.id} className="p-5 rounded-2xl"
                    style={{ backgroundColor: 'var(--cream-dark)', border: '1px solid var(--stone)' }}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex gap-4 flex-1 min-w-0">
                        {/* Imagen */}
                        {res.rooms?.images?.[0] && (
                          <div className="relative w-20 h-16 rounded-xl overflow-hidden shrink-0">
                            <img src={res.rooms.images[0]} alt={res.rooms?.title}
                              className="w-full h-full object-cover" />
                          </div>
                        )}
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
                          <option value="pagada">Pagada</option>
                          <option value="completada">Completada</option>
                          <option value="cancelada">Cancelada</option>
                          <option value="reembolsada">Reembolsada</option>
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
            TAB: REEMBOLSOS
        ══════════════════════════ */}
        {activeTab === 'refunds' && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="font-display"
                  style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 400, color: 'var(--charcoal)' }}>
                  Solicitudes de <em>reembolso</em>
                </h2>
                <p className="text-sm mt-1" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-body)', fontStyle: 'italic' }}>
                  Reembolsos manuales pendientes por transferencia o efectivo.
                </p>
              </div>
              <span className="text-xs px-3 py-1 rounded-full"
                style={{ backgroundColor: 'rgba(200,60,60,0.08)', color: '#c03c3c', fontFamily: 'var(--font-ui)' }}>
                {reservations.filter(r => r.refund_requested && r.estado === 'cancelada').length} pendientes
              </span>
            </div>

            {loadingRes ? (
              <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>Cargando...</p>
            ) : reservations.filter(r => r.refund_requested && r.estado === 'cancelada').length === 0 ? (
              <div className="text-center py-20">
                <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: 'rgba(60,160,80,0.1)', border: '1px solid rgba(60,160,80,0.2)' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#3ca050" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <p className="text-sm" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-body)', fontStyle: 'italic' }}>
                  No hay solicitudes de reembolso pendientes.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {reservations
                  .filter(r => r.refund_requested && r.estado === 'cancelada')
                  .map(res => (
                    <div key={res.id} className="p-6 rounded-2xl"
                      style={{ backgroundColor: 'var(--cream-dark)', border: '1.5px solid rgba(200,60,60,0.2)' }}>
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="flex-1">
                          {/* Header */}
                          <div className="flex items-center gap-2 mb-3 flex-wrap">
                            <span className="text-xs px-2.5 py-1 rounded-full font-semibold uppercase tracking-wide"
                              style={{ backgroundColor: 'rgba(200,60,60,0.08)', color: '#c03c3c', fontFamily: 'var(--font-ui)' }}>
                              Reembolso pendiente
                            </span>
                            <span className="text-xs px-2.5 py-1 rounded-full font-semibold"
                              style={{ backgroundColor: 'var(--cream)', color: 'var(--text-muted)', fontFamily: 'var(--font-ui)', border: '1px solid var(--stone)' }}>
                              #{res.id}
                            </span>
                          </div>

                          {/* Info reservación */}
                          <h3 className="font-display text-lg font-semibold mb-1"
                            style={{ fontFamily: 'var(--font-display)', color: 'var(--charcoal)' }}>
                            {res.rooms?.title ?? '—'}
                          </h3>
                          <p className="text-xs mb-3" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>
                            {formatDate(res.fecha_llegada)} → {formatDate(res.fecha_salida)} · {res.noches} noches
                          </p>

                          {/* Info cliente */}
                          <div className="p-3 rounded-lg mb-3"
                            style={{ backgroundColor: 'var(--cream)', border: '1px solid var(--stone)' }}>
                            <p className="text-xs font-semibold uppercase tracking-widest mb-2"
                              style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>
                              Datos del cliente
                            </p>
                            <p className="text-sm font-semibold" style={{ color: 'var(--charcoal)', fontFamily: 'var(--font-ui)' }}>
                              {res.profiles?.nombre
                                ? `${res.profiles.nombre} ${res.profiles.apellido ?? ''}`.trim()
                                : 'Usuario desconocido'}
                            </p>
                            {res.profiles?.telefono && (
                              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>
                                📞 {res.profiles.telefono}
                              </p>
                            )}
                            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>
                              Método: <strong>{metodoPagoLabel[res.metodo_pago] ?? res.metodo_pago}</strong>
                            </p>
                          </div>
                        </div>

                        {/* Monto y botón */}
                        <div className="pt-24.5 flex flex-col items-end gap-3 shrink-0">
                          {/* Botón marcar como reembolsado */}
                          <button
                            onClick={async () => {
                              const stored = localStorage.getItem('reservations')
                              if (stored) {
                                try {
                                  const parsed = JSON.parse(stored)
                                  const updated = parsed.map((r: any) => r.id === res.id ? { ...r, refund_requested: false, estado: 'reembolsada' } : r)
                                  localStorage.setItem('reservations', JSON.stringify(updated))
                                } catch (e) { console.error(e) }
                              }
                              setReservations(prev =>
                                prev.map(r => r.id === res.id ? { ...r, refund_requested: false, estado: 'reembolsada' } : r)
                              )
                            }}
                            className="text-xs px-4 py-2 rounded-lg font-semibold transition-all"
                            style={{
                              backgroundColor: 'rgba(60,160,80,0.1)',
                              color: '#3ca050',
                              border: '1px solid rgba(60,160,80,0.3)',
                              fontFamily: 'var(--font-ui)',
                            }}
                            onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(60,160,80,0.2)'}
                            onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(60,160,80,0.1)'}>
                            ✓ Marcar como reembolsado
                          </button>
                          {/* Monto */}
                          <div className="text-right">
                            <p className="text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>Monto a reembolsar</p>
                            <span className="font-display text-2xl font-semibold"
                              style={{ fontFamily: 'var(--font-display)', color: 'var(--copper)' }}>
                              ${res.total}
                            </span>
                          </div>
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <h2 className="font-display"
                  style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 400, color: 'var(--charcoal)' }}>
                  Usuarios <em>registrados</em>
                </h2>
                <span className="text-xs px-3 py-1 rounded-full mt-2 inline-block"
                  style={{ backgroundColor: 'rgba(200,129,58,0.12)', color: 'var(--copper)', fontFamily: 'var(--font-ui)' }}>
                  {filteredUsers.length} resultados
                </span>
              </div>
              <button onClick={() => { setEditingUser(null); setUserForm({ nombre: '', apellido: '', email: '', telefono: '', role: 'user', password: '' }); setUserFormError(''); setUserModalOpen(true); }} className="btn-copper whitespace-nowrap w-full sm:w-auto">
                + Agregar usuario
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mb-8 p-4 rounded-xl"
              style={{ backgroundColor: 'var(--cream-dark)', border: '1px solid var(--stone)'}}>
              <input type="text" placeholder="Buscar por nombre o correo..." className="input-warm text-sm py-2 px-3 min-w-130 flex-1"
                value={userSearch} onChange={e => setUserSearch(e.target.value)} />
              
              <select className="input-warm text-sm py-2 px-3 w-full sm:w-48" value={userFilterRole} onChange={e => setUserFilterRole(e.target.value)}>
                <option value="">Todos los roles</option>
                <option value="admin">Administrador</option>
                <option value="user">Usuario</option>
              </select>
            </div>

            {loadingUsers ? (
              <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>Cargando...</p>
            ) : (
              <div className="space-y-3">
                {filteredUsers.map(u => (
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
                        {u.email ?? 'Sin correo'} · {u.telefono ?? 'Sin teléfono'}
                        {' · '}Registrado el {new Date(u.created_at).toLocaleDateString('es-MX')}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <span className="text-xs px-2.5 py-1 rounded-full font-semibold uppercase tracking-wide"
                        style={{
                          backgroundColor: u.role === 'admin' ? 'rgba(200,129,58,0.12)' : 'rgba(44,36,32,0.06)',
                          color: u.role === 'admin' ? 'var(--copper)' : 'var(--text-muted)',
                          fontFamily: 'var(--font-ui)',
                        }}>
                        {u.role ?? 'user'}
                      </span>
                      <div className="flex gap-2">
                        <button onClick={() => { setEditingUser(u); setUserForm({ nombre: u.nombre||'', apellido: u.apellido||'', email: u.email||'', telefono: u.telefono||'', role: u.role||'user', password: u.password||'' }); setUserFormError(''); setUserModalOpen(true); }} className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors" style={{ backgroundColor: 'rgba(200,129,58,0.1)', color: 'var(--copper)', fontFamily: 'var(--font-ui)', border: '1px solid rgba(200,129,58,0.2)' }} onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(200,129,58,0.2)'} onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(200,129,58,0.1)'}>Editar</button>
                        {u.id !== user?.id && (
                          <button onClick={() => setDeleteUserId(u.id)} className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors" style={{ backgroundColor: 'rgba(200,60,60,0.08)', color: '#c03c3c', fontFamily: 'var(--font-ui)', border: '1px solid rgba(200,60,60,0.2)' }} onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(200,60,60,0.15)'} onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(200,60,60,0.08)'}>Eliminar</button>
                        )}
                      </div>
                    </div>
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

        {/* ══════════════════════════
            TAB: TESTIMONIOS
        ══════════════════════════ */}
        {activeTab === 'testimonios' && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-display"
                style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 400, color: 'var(--charcoal)' }}>
                Gestión de <em>testimonios</em>
              </h2>
              <span className="text-xs px-3 py-1 rounded-full"
                style={{ backgroundColor: 'rgba(200,129,58,0.12)', color: 'var(--copper)', fontFamily: 'var(--font-ui)' }}>
                {testimonios.filter(t => t.status === 'pending').length} pendientes
              </span>
            </div>

            {loadingTestimonios ? (
              <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>Cargando...</p>
            ) : testimonios.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-body)', fontStyle: 'italic' }}>
                No hay testimonios aún.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {testimonios.map(t => (
                  <div key={t.id} className="p-5 rounded-2xl flex flex-col gap-3"
                    style={{ backgroundColor: 'var(--cream-dark)', border: `1px solid ${t.status === 'pending' ? 'var(--copper)' : 'var(--stone)'}` }}>
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="w-8 h-8 rounded-full flex items-center justify-center font-bold"
                            style={{ backgroundColor: 'var(--stone)', color: 'var(--charcoal)', fontFamily: 'var(--font-display)', fontSize: '0.9rem' }}>
                            {t.inicial}
                          </span>
                          <div>
                            <p className="text-sm font-semibold" style={{ color: 'var(--charcoal)', fontFamily: 'var(--font-ui)' }}>{t.nombre}</p>
                            <p className="text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>{t.ciudad}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <div className="flex">
                          {Array.from({ length: t.estrellas }).map((_, s) => (
                            <svg key={s} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3" style={{ color: 'var(--copper)' }}>
                              <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354l-4.543 2.826c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                            </svg>
                          ))}
                        </div>
                        {t.status === 'pending' && (
                          <span className="text-[9px] px-2 py-0.5 rounded-full uppercase tracking-widest font-semibold mt-1" style={{ backgroundColor: 'rgba(200,129,58,0.1)', color: 'var(--copper)' }}>
                            Pendiente
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-sm italic text-(--text-muted) flex-1 line-clamp-4">"{t.texto}"</p>
                    <div className="flex gap-2 mt-2 pt-3" style={{ borderTop: '1px solid var(--stone)' }}>
                      {t.status === 'pending' && (
                        <button onClick={() => handleApproveTestimonio(t.id)} className="flex-1 py-1.5 text-xs font-semibold bg-(--copper) text-white rounded-lg hover:bg-(--copper-dark) transition-colors">
                          Aprobar
                        </button>
                      )}
                      <button onClick={() => handleRejectTestimonio(t.id)} className="flex-1 py-1.5 text-xs font-semibold bg-transparent border border-(--text-light) text-(--text-muted) rounded-lg hover:bg-(--stone) transition-colors">
                        {t.status === 'pending' ? 'Rechazar' : 'Eliminar'}
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
                <input type="text" className="input-warm" placeholder="Vista panorámica al manantial..."
                  value={roomForm.description}
                  onChange={e => setRoomForm(p => ({ ...p, description: e.target.value }))} />
              </div>

              {/* Descripción larga */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest mb-2"
                  style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>Descripción completa</label>
                <textarea rows={4} className="input-warm resize-none" placeholder="Descripción detallada de la habitación..."
                  value={roomForm.longDescription}
                  onChange={e => setRoomForm(p => ({ ...p, longDescription: e.target.value }))} />
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
              <div className="p-4 rounded-xl flex items-center justify-between"
                style={{ backgroundColor: 'var(--cream-dark)', border: '1px solid var(--stone)' }}>
                <div>
                  <label className="block text-sm font-semibold mb-1" style={{ color: 'var(--charcoal)', fontFamily: 'var(--font-ui)' }}>
                    Destacar habitación
                  </label>
                  <p className="text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>
                    Se mostrará en la sección principal de la página de inicio.
                  </p>
                </div>
                <button type="button" onClick={() => setRoomForm(p => ({ ...p, popular: !p.popular }))}
                  className="w-12 h-7 rounded-full transition-colors relative shrink-0"
                  style={{ backgroundColor: roomForm.popular ? 'var(--copper)' : 'var(--stone)' }}>
                  <div className="w-5 h-5 rounded-full bg-white absolute top-1 transition-all"
                    style={{ left: roomForm.popular ? '1.5rem' : '0.25rem', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }} />
                </button>
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

            {/* Error de validación */}
            {roomFormError && (
              <div className="px-8 pb-4">
                <p className="text-sm p-3 rounded-lg" style={{ backgroundColor: 'rgba(200,60,60,0.08)', color: '#c03c3c', border: '1px solid rgba(200,60,60,0.2)', fontFamily: 'var(--font-ui)' }}>{roomFormError}</p>
              </div>
            )}

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
          MODAL: AGREGAR RESERVACIÓN
      ══════════════════════════════════════════ */}
      {resModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(44,36,32,0.7)', backdropFilter: 'blur(6px)' }}>
          <div className="w-full max-w-2xl rounded-2xl overflow-hidden"
            style={{ backgroundColor: 'var(--cream)', boxShadow: 'var(--shadow-lg)', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="px-8 pt-8 pb-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--stone)' }}>
              <h3 className="font-display text-xl" style={{ fontFamily: 'var(--font-display)', color: 'var(--charcoal)' }}>Nueva reservación</h3>
              <button onClick={() => setResModalOpen(false)} className="w-8 h-8 rounded-full flex items-center justify-center transition-colors" style={{ backgroundColor: 'rgba(44,36,32,0.08)', color: 'var(--charcoal)' }}>✕</button>
            </div>
            <div className="px-8 py-6 space-y-5">
              <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: 'var(--cream-dark)', border: '1px solid var(--stone)' }}>
                <span className="text-sm font-semibold" style={{ color: 'var(--charcoal)', fontFamily: 'var(--font-ui)' }}>Huésped con cuenta registrada</span>
                <button type="button" onClick={() => setResForm(p => ({ ...p, hasAccount: !p.hasAccount }))}
                  className="w-10 h-6 rounded-full transition-colors relative shrink-0"
                  style={{ backgroundColor: resForm.hasAccount ? 'var(--copper)' : 'var(--stone)' }}>
                  <div className="w-4 h-4 rounded-full bg-white absolute top-1 transition-all"
                    style={{ left: resForm.hasAccount ? '1.25rem' : '0.25rem', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }} />
                </button>
              </div>
              
              {resForm.hasAccount ? (
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>Huésped</label>
                  <select className="input-warm" value={resForm.user_id} onChange={e => setResForm(p => ({ ...p, user_id: e.target.value }))}>
                    <option value="">Selecciona un huésped...</option>
                    {users.map(u => (
                      <option key={u.id} value={u.id}>{u.nombre} {u.apellido} ({u.email})</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>Nombre del huésped</label><input type="text" className="input-warm" value={resForm.guestName} onChange={e => setResForm(p => ({ ...p, guestName: e.target.value }))} /></div>
                  <div><label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>Teléfono</label><input type="text" className="input-warm" value={resForm.guestPhone} onChange={e => setResForm(p => ({ ...p, guestPhone: e.target.value }))} /></div>
                </div>
              )}
              
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>Habitación</label>
                <select className="input-warm" value={resForm.room_id} onChange={e => setResForm(p => ({ ...p, room_id: e.target.value }))}>
                  <option value="">Selecciona una habitación...</option>
                  {rooms.map(r => (
                    <option key={r.id} value={r.id.toString()}>{r.title} - ${r.price}/noche</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3" style={{ position: 'relative' }}>
                <div style={{ position: 'relative', zIndex: showLlegada ? 100 : 1 }} ref={resLlegadaRef}>
                  <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>Llegada</label>
                  <DatePicker
                    label="Llegada"
                    value={resForm.fecha_llegada}
                    onChange={v => { setResForm(p => ({ ...p, fecha_llegada: v })); setShowLlegada(false); }}
                    isOpen={showLlegada}
                    onToggle={() => {
                      const opening = !showLlegada;
                      setShowLlegada(opening);
                      setShowSalida(false);
                      if (opening) setTimeout(() => resLlegadaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
                    }}
                  />
                </div>
                <div style={{ position: 'relative', zIndex: showSalida ? 100 : 1 }} ref={resSalidaRef}>
                  <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>Salida</label>
                  <DatePicker
                    label="Salida"
                    value={resForm.fecha_salida}
                    onChange={v => { setResForm(p => ({ ...p, fecha_salida: v })); setShowSalida(false); }}
                    isOpen={showSalida}
                    onToggle={() => {
                      const opening = !showSalida;
                      setShowSalida(opening);
                      setShowLlegada(false);
                      if (opening) setTimeout(() => resSalidaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
                    }}
                    minDate={resForm.fecha_llegada}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>Método de pago</label>
                  <select className="input-warm" value={resForm.metodo_pago} onChange={e => setResForm(p => ({ ...p, metodo_pago: e.target.value }))}>
                    <option value="cash">Pago en recepción</option>
                    <option value="transfer">Transferencia</option>
                    <option value="card">Tarjeta</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>Estado inicial</label>
                  <select className="input-warm" value={resForm.estado} onChange={e => setResForm(p => ({ ...p, estado: e.target.value }))}>
                    <option value="confirmada">Confirmada</option>
                    <option value="pagada">Pagada</option>
                    <option value="completada">Completada</option>
                  </select>
                </div>
              </div>
            </div>
            {resFormError && (
              <div className="px-8 pb-4">
                <p className="text-sm p-3 rounded-lg" style={{ backgroundColor: 'rgba(200,60,60,0.08)', color: '#c03c3c', border: '1px solid rgba(200,60,60,0.2)', fontFamily: 'var(--font-ui)' }}>{resFormError}</p>
              </div>
            )}
            <div className="px-8 pb-8 flex gap-3">
              <button onClick={handleSaveRes} className="btn-copper flex-1 text-center">Crear reservación</button>
              <button onClick={() => setResModalOpen(false)} className="px-6 py-3 rounded-lg text-sm font-semibold transition-colors" style={{ border: '1.5px solid var(--stone)', color: 'var(--charcoal)', fontFamily: 'var(--font-ui)' }}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════
          MODAL: AGREGAR / EDITAR USUARIO
      ══════════════════════════════════════════ */}
      {userModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(44,36,32,0.7)', backdropFilter: 'blur(6px)' }}>
          <div className="w-full max-w-2xl rounded-2xl overflow-hidden"
            style={{ backgroundColor: 'var(--cream)', boxShadow: 'var(--shadow-lg)', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="px-8 pt-8 pb-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--stone)' }}>
              <h3 className="font-display text-xl" style={{ fontFamily: 'var(--font-display)', color: 'var(--charcoal)' }}>
                {editingUser ? 'Editar usuario' : 'Nuevo usuario'}
              </h3>
              <button onClick={() => setUserModalOpen(false)} className="w-8 h-8 rounded-full flex items-center justify-center transition-colors" style={{ backgroundColor: 'rgba(44,36,32,0.08)', color: 'var(--charcoal)' }}>✕</button>
            </div>
            <div className="px-8 py-6 space-y-5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>Nombre</label>
                  <input type="text" className="input-warm" value={userForm.nombre} onChange={e => setUserForm(p => ({ ...p, nombre: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>Apellido</label>
                  <input type="text" className="input-warm" value={userForm.apellido} onChange={e => setUserForm(p => ({ ...p, apellido: e.target.value }))} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>Correo electrónico</label>
                  <input type="email" className="input-warm" value={userForm.email} onChange={e => setUserForm(p => ({ ...p, email: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>Teléfono</label>
                  <input type="text" className="input-warm" value={userForm.telefono} onChange={e => setUserForm(p => ({ ...p, telefono: e.target.value }))} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>Rol</label>
                  <select className="input-warm" value={userForm.role} onChange={e => setUserForm(p => ({ ...p, role: e.target.value }))} disabled={editingUser?.id === user?.id} style={{ opacity: editingUser?.id === user?.id ? 0.7 : 1, cursor: editingUser?.id === user?.id ? 'not-allowed' : 'auto' }}>
                    <option value="user">Usuario</option>
                    <option value="admin">Administrador</option>
                  </select>
                  {editingUser?.id === user?.id && (
                    <p className="text-[10px] mt-1" style={{ color: 'var(--text-light)', fontStyle: 'italic' }}>No puedes cambiar tu propio rol.</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>Contraseña {editingUser && '(Opcional)'}</label>
                  <input type="password" className="input-warm" placeholder={editingUser ? 'Dejar en blanco para no cambiar' : ''} value={userForm.password} onChange={e => setUserForm(p => ({ ...p, password: e.target.value }))} />
                </div>
              </div>
            </div>
            {userFormError && (
              <div className="px-8 pb-4">
                <p className="text-sm p-3 rounded-lg" style={{ backgroundColor: 'rgba(200,60,60,0.08)', color: '#c03c3c', border: '1px solid rgba(200,60,60,0.2)', fontFamily: 'var(--font-ui)' }}>{userFormError}</p>
              </div>
            )}
            <div className="px-8 pb-8 flex gap-3">
              <button onClick={handleSaveUser} className="btn-copper flex-1 text-center">Guardar usuario</button>
              <button onClick={() => setUserModalOpen(false)} className="px-6 py-3 rounded-lg text-sm font-semibold transition-colors" style={{ border: '1.5px solid var(--stone)', color: 'var(--charcoal)', fontFamily: 'var(--font-ui)' }}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════
          MODAL: CONFIRMAR ELIMINACIÓN DE USUARIO
      ══════════════════════════════════════════ */}
      {deleteUserId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(44,36,32,0.6)', backdropFilter: 'blur(4px)' }}>
          <div className="w-full max-w-sm p-8 rounded-2xl"
            style={{ backgroundColor: 'var(--cream)', border: '1px solid var(--stone)', boxShadow: 'var(--shadow-lg)' }}>
            <h3 className="font-display text-xl mb-3" style={{ fontFamily: 'var(--font-display)', color: 'var(--charcoal)' }}>
              ¿Eliminar usuario?
            </h3>
            <p className="text-sm mb-6 leading-relaxed" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-body)', fontStyle: 'italic' }}>
              Esta acción no se puede deshacer. Las reservaciones asociadas podrían quedar sin usuario asignado.
            </p>
            <div className="flex gap-3">
              <button onClick={handleDeleteUser} className="btn-copper flex-1 text-center" style={{ backgroundColor: '#c03c3c', boxShadow: 'none' }}>
                Sí, eliminar
              </button>
              <button onClick={() => setDeleteUserId(null)} className="flex-1 py-3 rounded-lg text-sm font-semibold transition-colors" style={{ border: '1.5px solid var(--stone)', color: 'var(--charcoal)', fontFamily: 'var(--font-ui)' }} onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--cream-dark)'} onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'}>
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