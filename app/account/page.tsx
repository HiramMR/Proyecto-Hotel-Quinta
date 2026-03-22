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
import Link from 'next/link'

interface Reservation {
  id: number
  user_id?: string
  room_id: number
  fecha_llegada: string
  fecha_salida: string
  noches: number
  total: number
  metodo_pago: string
  estado: string
  created_at: string
  payment_intent_id: string | null
  refund_id?: string | null
  refund_requested?: boolean
  comprobante_url: string | null
  profiles?: { nombre: string | null; apellido: string | null; telefono: string | null }
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
  reembolsada: 'rgba(138,126,116,0.15)',
}

const estadoTextColor: Record<string, string> = {
  confirmada: 'var(--copper)',
  pagada:     '#3ca050',
  cancelada:  '#c03c3c',
  completada: '#3ca050',
  reembolsada: 'var(--text-muted)',
}

const defaultReservations: Reservation[] = [
  {
    id: 1, user_id: '2', room_id: 1,
    fecha_llegada: new Date(Date.now() - 86400000 * 20).toISOString().split('T')[0],
    fecha_salida: new Date(Date.now() - 86400000 * 15).toISOString().split('T')[0],
    noches: 5, total: 7250, metodo_pago: 'card', estado: 'confirmada',
    created_at: new Date(Date.now() - 86400000 * 25).toISOString(),
    payment_intent_id: null, refund_id: null, refund_requested: false,
    comprobante_url: null,
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
    comprobante_url: 'uploaded',
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
    comprobante_url: null,
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
    comprobante_url: null,
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
    comprobante_url: null,
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
    comprobante_url: null,
    profiles: { nombre: 'María', apellido: 'Gómez', telefono: '555-5678' },
    rooms: { title: 'Tzintzuntzan', images: ['https://scontent-qro1-1.xx.fbcdn.net/v/t39.30808-6/615280862_122111746593156061_3912196455499954122_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=7b2446&_nc_eui2=AeFlwMyVzMWh7Q0-Q3QgvD_-10j_04sPZ5nXSP_Tiw9nmYPjczFRAzIeN3zHGbtMHmzAH4FXLz8XPmCLRB8CmTbO&_nc_ohc=aijKVwecQN0Q7kNvwFw2yr2&_nc_oc=AdpzmBhhnlin11iiqP3-1Kpdg_FGU2eJLDSie-oSzSJxb7XOuaE-0IIxZgfHRF_EZZR8tPt0lCf-wS3fcwZu7Squ&_nc_zt=23&_nc_ht=scontent-qro1-1.xx&_nc_gid=Ao1jQQjqmnSQZH2An1xJQw&_nc_ss=7a32e&oh=00_AfwWU_fW30lvqElvjKOiZD7AGz7KQHAJPJ_-Fq5lAQie4w&oe=69C53FCD'], stars: 4 }
  }
]

// ── Formulario de edición de perfil ──
function ProfileForm({ user, profile, onSaved }: {
  user: any;
  profile: any;
  onSaved: (updated: any) => void;
}) {
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [form, setForm] = useState({
    nombre:   profile?.nombre   ?? '',
    apellido: profile?.apellido ?? '',
    telefono: profile?.telefono ?? '',
  })

  useEffect(() => {
    setForm({
      nombre:   profile?.nombre   ?? '',
      apellido: profile?.apellido ?? '',
      telefono: profile?.telefono ?? '',
    })
    if (profile?.last_profile_update) {
      setLastUpdate(new Date(profile.last_profile_update))
    }
  }, [profile])

  // Verifica si han pasado al menos 7 días desde el último cambio
  const canEdit = () => {
    if (!lastUpdate) return true
    const diff = Date.now() - lastUpdate.getTime()
    const days = diff / (1000 * 60 * 60 * 24)
    return days >= 7
  }

  const daysUntilNextEdit = () => {
    if (!lastUpdate) return 0
    const diff = Date.now() - lastUpdate.getTime()
    const days = diff / (1000 * 60 * 60 * 24)
    return Math.ceil(7 - days)
  }

  const handleSave = async () => {
    if (!form.nombre.trim()) {
      setSaveError('El nombre es obligatorio.')
      return
    }
    if (!canEdit()) {
      setSaveError(`Debes esperar ${daysUntilNextEdit()} día(s) más para poder actualizar tu perfil.`)
      return
    }
    setSaving(true)
    setSaveError('')
    setSaveSuccess(false)

    const now = new Date().toISOString()
    const storedUsers = localStorage.getItem('users')
    if (storedUsers) {
      try {
        const parsedUsers = JSON.parse(storedUsers)
        const updatedUsers = parsedUsers.map((u: any) => {
          if (u.id === user.id) {
            return {
              ...u,
              nombre: form.nombre.trim(),
              apellido: form.apellido.trim() || null,
              telefono: form.telefono.trim() || null,
              last_profile_update: now,
            }
          }
          return u
        })
        localStorage.setItem('users', JSON.stringify(updatedUsers))
      } catch (e) {
        console.error(e)
      }
    }

    setLastUpdate(new Date(now))
    setSaving(false)
    setSaveSuccess(true)
    setEditing(false)
    onSaved(form)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  const inputStyle = {
    width: '100%',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    border: '1px solid var(--stone)',
    backgroundColor: 'var(--cream)',
    color: 'var(--charcoal)',
    fontFamily: 'var(--font-ui)',
    fontSize: '0.875rem',
    outline: 'none',
  }

  const editAllowed = canEdit()

  return (
    <div className="space-y-4 mb-8">
      {/* Correo — solo lectura siempre */}
      <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--cream-dark)', border: '1px solid var(--stone)' }}>
        <p className="text-xs uppercase tracking-widest font-semibold mb-1"
          style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>Correo</p>
        <p className="text-sm font-medium" style={{ color: 'var(--text-light)', fontFamily: 'var(--font-ui)' }}>
          {user.email}
        </p>
        <p className="text-xs mt-1 italic" style={{ color: 'var(--text-light)', fontFamily: 'var(--font-ui)' }}>
          El correo no se puede cambiar
        </p>
      </div>

      {/* Campos editables */}
      {editing ? (
        <>
          {[
            { label: 'Nombre',    key: 'nombre',   placeholder: 'Tu nombre' },
            { label: 'Apellido',  key: 'apellido', placeholder: 'Tu apellido' },
            { label: 'Teléfono', key: 'telefono', placeholder: '+52 434 000 0000' },
          ].map(field => (
            <div key={field.key}>
              <label className="block text-xs uppercase tracking-widest font-semibold mb-2"
                style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>
                {field.label}
              </label>
              <input
                type="text"
                value={(form as any)[field.key]}
                onChange={e => setForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                placeholder={field.placeholder}
                style={inputStyle}
                onFocus={e => (e.target as HTMLElement).style.borderColor = 'var(--copper)'}
                onBlur={e => (e.target as HTMLElement).style.borderColor = 'var(--stone)'}
              />
            </div>
          ))}

          {saveError && (
            <p className="text-xs" style={{ color: '#c03c3c', fontFamily: 'var(--font-ui)' }}>
              {saveError}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <button onClick={handleSave} disabled={saving}
              className="btn-copper flex-1 text-center"
              style={{ opacity: saving ? 0.7 : 1 }}>
              {saving ? 'Guardando...' : 'Guardar cambios'}
            </button>
            <button onClick={() => { setEditing(false); setSaveError('') }}
              className="flex-1 py-3 rounded-lg text-sm font-semibold transition-colors"
              style={{ border: '1.5px solid var(--stone)', color: 'var(--charcoal)', fontFamily: 'var(--font-ui)' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--cream-dark)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'}>
              Cancelar
            </button>
          </div>
        </>
      ) : (
        <>
          {[
            { label: 'Nombre',    value: profile?.nombre   ?? '—' },
            { label: 'Apellido',  value: profile?.apellido ?? '—' },
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

          {saveSuccess && (
            <p className="text-xs font-semibold" style={{ color: '#3ca050', fontFamily: 'var(--font-ui)' }}>
              ✓ Cambios guardados correctamente
            </p>
          )}

          {/* Botón editar — deshabilitado si no han pasado 7 días */}
          {editAllowed ? (
            <button onClick={() => setEditing(true)} className="btn-copper w-full text-center">
              Editar perfil
            </button>
          ) : (
            <div className="p-4 rounded-xl text-center"
              style={{ backgroundColor: 'var(--cream-dark)', border: '1px solid var(--stone)' }}>
              <p className="text-xs font-semibold mb-1" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>
                Próxima edición disponible en
              </p>
              <p className="text-lg font-semibold" style={{ color: 'var(--copper)', fontFamily: 'var(--font-display)' }}>
                {daysUntilNextEdit()} {daysUntilNextEdit() === 1 ? 'día' : 'días'}
              </p>
              <p className="text-xs mt-1 italic" style={{ color: 'var(--text-light)', fontFamily: 'var(--font-ui)' }}>
                Solo puedes actualizar tu perfil una vez por semana
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
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
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [uploadingId, setUploadingId] = useState<number | null>(null)
  const [uploadResult, setUploadResult] = useState<{ id: number; success: boolean; message: string } | null>(null)

  const [reviews, setReviews] = useState<any[]>([])
  const [reviewingId, setReviewingId] = useState<number | null>(null)
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' })

  // Redirigir si no hay sesión
  useEffect(() => {
    if (!loading && !user) router.push('/login')
  }, [user, loading, router])

  // Cargar reservaciones del usuario
  useEffect(() => {
    if (!user) return
    const stored = localStorage.getItem('reservations')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        const userRes = parsed.filter((r: any) => r.user_id === user.id)
        userRes.sort((a: any, b: any) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
        setReservations(userRes)
      } catch (e) { console.error(e) }
    } else {
      localStorage.setItem('reservations', JSON.stringify(defaultReservations))
      const userRes = defaultReservations.filter((r: any) => r.user_id === user.id)
      userRes.sort((a: any, b: any) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
      setReservations(userRes)
    }
    setLoadingRes(false)
  }, [user])

  useEffect(() => {
    const stored = localStorage.getItem('room_reviews')
    if (stored) {
      try { setReviews(JSON.parse(stored)) } catch (e) {}
    }
  }, [])

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

    setTimeout(() => {
      const storedRes = localStorage.getItem('reservations')
      let refunded = false
      if (storedRes) {
        try {
          const parsedRes = JSON.parse(storedRes)
          const updatedRes = parsedRes.map((r: any) => {
            if (r.id === cancelingId) {
              refunded = r.metodo_pago === 'card'
              return { ...r, estado: refunded ? 'reembolsada' : 'cancelada', refund_requested: !refunded }
            }
            return r
          })
          localStorage.setItem('reservations', JSON.stringify(updatedRes))
        } catch (e) { console.error(e) }
      }

      // Actualizar estado local
      setReservations(prev =>
        prev.map(r => r.id === cancelingId ? { ...r, estado: refunded ? 'reembolsada' : 'cancelada' } : r)
      )

      // Mensaje según método de pago
      if (refunded) {
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

    setCanceling(false)
    setConfirmOpen(false)
    setCancelingId(null)
    }, 800)
  }

  // ── Subir comprobante de transferencia ──
  const handleUploadComprobante = async (reservationId: number, file: File) => {
    if (!user) return
    setUploadingId(reservationId)
    setUploadResult(null)

    setTimeout(() => {
      const storedRes = localStorage.getItem('reservations')
      if (storedRes) {
        try {
          const parsedRes = JSON.parse(storedRes)
          const updatedRes = parsedRes.map((r: any) => r.id === reservationId ? { ...r, comprobante_url: 'uploaded' } : r)
          localStorage.setItem('reservations', JSON.stringify(updatedRes))
        } catch (e) { console.error(e) }
      }
      setUploadResult({ id: reservationId, success: true, message: 'Comprobante enviado correctamente. El hotel lo revisará pronto.' })
      setReservations(prev => prev.map(r => r.id === reservationId ? { ...r, comprobante_url: 'uploaded' } : r))
      setUploadingId(null)
    }, 1000)
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
                {reservations.map(res => {
                  const isExpanded = expandedId === res.id
                  return (
                  <div key={res.id} className="rounded-2xl transition-all duration-300 overflow-hidden"
                    style={{ backgroundColor: 'var(--cream-dark)', border: `1px solid ${isExpanded ? 'var(--copper)' : 'var(--stone)'}` }}>

                    {/* ── CABECERA — siempre visible, click para expandir ── */}
                    <div className="p-5 cursor-pointer flex flex-col sm:flex-row gap-4"
                      onClick={() => setExpandedId(isExpanded ? null : res.id)}>

                      {/* Imagen */}
                      {res.rooms?.images?.[0] && (
                        <div className="relative w-full sm:w-32 h-24 rounded-xl overflow-hidden shrink-0">
                          <img src={res.rooms.images[0]} alt={res.rooms?.title} className="w-full h-full object-cover" />
                        </div>
                      )}

                      {/* Info resumida */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="font-display text-lg font-semibold"
                            style={{ fontFamily: 'var(--font-display)', color: 'var(--charcoal)' }}>
                            {res.rooms?.title ?? 'Habitación'}
                          </h3>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-xs px-2.5 py-1 rounded-full font-semibold uppercase tracking-wide"
                              style={{ backgroundColor: estadoColor[res.estado] ?? estadoColor.confirmada, color: estadoTextColor[res.estado] ?? estadoTextColor.confirmada, fontFamily: 'var(--font-ui)' }}>
                              {res.estado}
                            </span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"
                              className="w-4 h-4 transition-transform duration-300"
                              style={{ color: 'var(--text-muted)', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mb-2 text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--copper)' }}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                          </svg>
                          {formatDate(res.fecha_llegada)} → {formatDate(res.fecha_salida)}
                          <span style={{ color: 'var(--text-light)' }}>·</span>
                          {res.noches} {res.noches === 1 ? 'noche' : 'noches'}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>
                            {metodoPagoLabel[res.metodo_pago] ?? res.metodo_pago}
                          </span>
                          <span className="font-display text-xl font-semibold" style={{ fontFamily: 'var(--font-display)', color: 'var(--copper)' }}>
                            ${res.total}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* ── DETALLE EXPANDIDO ── */}
                    {isExpanded && (
                      <div className="px-5 pb-5" style={{ borderTop: '1px solid var(--stone)' }}>
                        <div className="pt-5 space-y-3">

                          {/* Info detallada */}
                          <div className="grid grid-cols-2 gap-3 text-xs" style={{ fontFamily: 'var(--font-ui)' }}>
                            {[
                              { label: 'Reservación', value: `#${res.id}` },
                              { label: 'A nombre de', value: displayName },
                              { label: 'Check-in', value: formatDate(res.fecha_llegada) },
                              { label: 'Check-out', value: formatDate(res.fecha_salida) },
                              { label: 'Noches', value: String(res.noches) },
                              { label: 'Costo por noche', value: `$${Math.round(res.total / res.noches)}` },
                              { label: 'Total', value: `$${res.total}` },
                              { label: 'Método de pago', value: metodoPagoLabel[res.metodo_pago] ?? res.metodo_pago },
                            ].map(item => (
                              <div key={item.label} className="p-3 rounded-lg" style={{ backgroundColor: 'var(--cream)', border: '1px solid var(--stone)' }}>
                                <p style={{ color: 'var(--text-muted)', marginBottom: '2px' }}>{item.label}</p>
                                <p className="font-semibold" style={{ color: 'var(--charcoal)' }}>{item.value}</p>
                              </div>
                            ))}
                          </div>

                          {/* Comprobante de transferencia */}
                          {res.metodo_pago === 'transfer' && res.estado === 'confirmada' && (
                            <div className="p-4 rounded-xl mt-2"
                              style={{ backgroundColor: 'rgba(200,129,58,0.06)', border: '1px solid rgba(200,129,58,0.2)' }}>
                              {res.comprobante_url ? (
                                <div className="flex items-center gap-2">
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 shrink-0" style={{ color: '#3ca050' }}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                  </svg>
                                  <p className="text-xs" style={{ color: '#3ca050', fontFamily: 'var(--font-ui)', fontWeight: 600 }}>
                                    Comprobante enviado — el hotel lo revisará pronto
                                  </p>
                                </div>
                              ) : (
                                <>
                                  <p className="text-xs font-semibold mb-1" style={{ color: 'var(--copper)', fontFamily: 'var(--font-ui)' }}>
                                    📎 Sube tu comprobante de transferencia
                                  </p>
                                  <p className="text-xs mb-3" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-body)', fontStyle: 'italic' }}>
                                    Para confirmar tu pago, sube una foto o PDF de tu comprobante. El hotel lo revisará y marcará tu reservación como pagada.
                                  </p>
                                  {uploadResult?.id === res.id && (
                                    <p className="text-xs mb-3 font-semibold" style={{ color: uploadResult.success ? '#3ca050' : '#c03c3c', fontFamily: 'var(--font-ui)' }}>
                                      {uploadResult.message}
                                    </p>
                                  )}
                                  <label className="btn-copper cursor-pointer inline-block text-center"
                                    style={{ opacity: uploadingId === res.id ? 0.7 : 1 }}>
                                    {uploadingId === res.id ? 'Subiendo...' : 'Seleccionar archivo'}
                                    <input
                                      type="file"
                                      accept="image/jpeg,image/png,image/webp,application/pdf"
                                      className="hidden"
                                      disabled={uploadingId === res.id}
                                      onChange={e => {
                                        const file = e.target.files?.[0]
                                        if (file) handleUploadComprobante(res.id, file)
                                      }}
                                    />
                                  </label>
                                  <p className="text-xs mt-2" style={{ color: 'var(--text-light)', fontFamily: 'var(--font-ui)' }}>
                                    Formatos: JPG, PNG, WEBP, PDF · Máximo 5 MB
                                  </p>
                                </>
                              )}
                            </div>
                          )}

                          {/* Mensaje de contacto */}
                          <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--cream)', border: '1px solid var(--stone)' }}>
                            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-body)', fontStyle: 'italic' }}>
                              ¿Tienes dudas o alguna queja sobre tu reservación? No dudes en contactarnos.
                            </p>
                            <Link href="/contact" className="inline-flex items-center gap-1.5 text-xs font-semibold mt-2 transition-colors"
                              style={{ color: 'var(--copper)', fontFamily: 'var(--font-ui)' }}
                              onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '0.7'}
                              onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '1'}>
                              Ir a contacto
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                              </svg>
                            </Link>
                          </div>

                          {/* Valorar habitación si ya terminó */}
                          {(() => {
                            const isFinished = res.estado === 'completada' || (['confirmada', 'pagada'].includes(res.estado) && res.fecha_salida < new Date().toISOString().split('T')[0]);
                            const existingReview = reviews.find(r => r.reservation_id === res.id);
                            
                            if (isFinished && !existingReview) {
                              if (reviewingId === res.id) {
                                return (
                                  <div className="p-4 rounded-xl mt-2 space-y-3" style={{ backgroundColor: 'var(--cream)', border: '1px solid var(--copper)' }}>
                                    <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--copper)', fontFamily: 'var(--font-ui)' }}>Valorar habitación</p>
                                    <div className="flex gap-2">
                                      {[1,2,3,4,5].map(star => (
                                        <button key={star} onClick={() => setReviewForm({...reviewForm, rating: star})}>
                                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={star <= reviewForm.rating ? "currentColor" : "none"} stroke="currentColor" className="w-6 h-6" style={{ color: 'var(--copper)' }}>
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354l-4.543 2.826c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                                          </svg>
                                        </button>
                                      ))}
                                    </div>
                                    <textarea className="input-warm text-xs resize-none" rows={3} placeholder="¿Qué te pareció tu estancia?" value={reviewForm.comment} onChange={e => setReviewForm({...reviewForm, comment: e.target.value})} />
                                    <div className="flex gap-2">
                                      <button className="btn-copper flex-1 py-2 text-[11px]" onClick={() => {
                                        const stored = localStorage.getItem('room_reviews') || '[]'
                                        const parsed = JSON.parse(stored)
                                        parsed.push({ reservation_id: res.id, room_id: res.room_id, user_id: user?.id, user_name: displayName, rating: reviewForm.rating, comment: reviewForm.comment, date: new Date().toISOString() })
                                        localStorage.setItem('room_reviews', JSON.stringify(parsed))
                                        setReviews(parsed)
                                        setReviewingId(null)
                                      }}>Enviar valoración</button>
                                      <button className="flex-1 text-[11px] font-semibold py-2 rounded-lg transition-colors hover:bg-(--cream-dark)" style={{ border: '1px solid var(--stone)', color: 'var(--charcoal)' }} onClick={() => setReviewingId(null)}>Cancelar</button>
                                    </div>
                                  </div>
                                )
                              }
                              return (
                                <div className="p-4 rounded-xl mt-2 flex justify-between items-center" style={{ backgroundColor: 'rgba(200,129,58,0.06)', border: '1px solid rgba(200,129,58,0.2)' }}>
                                  <div>
                                    <p className="text-xs font-semibold mb-1" style={{ color: 'var(--copper)', fontFamily: 'var(--font-ui)' }}>🌟 Valora tu estancia</p>
                                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Cuéntanos qué te pareció esta habitación.</p>
                                  </div>
                                  <button className="btn-copper text-[10px] px-3 py-1.5" onClick={() => { setReviewingId(res.id); setReviewForm({ rating: 5, comment: '' }) }}>Valorar</button>
                                </div>
                              )
                            } else if (existingReview) {
                              return (
                                <div className="p-4 rounded-xl mt-2" style={{ backgroundColor: 'var(--cream-dark)', border: '1px solid var(--stone)' }}>
                                  <div className="flex justify-between items-center mb-2">
                                    <p className="text-xs font-semibold" style={{ color: 'var(--charcoal)', fontFamily: 'var(--font-ui)' }}>Tu valoración</p>
                                    <div className="flex gap-0.5">
                                      {[1,2,3,4,5].map(star => (
                                        <svg key={star} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={star <= existingReview.rating ? "currentColor" : "none"} stroke="currentColor" className="w-3.5 h-3.5" style={{ color: 'var(--copper)' }}>
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354l-4.543 2.826c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                                        </svg>
                                      ))}
                                    </div>
                                  </div>
                                  {existingReview.comment && <p className="text-xs italic" style={{ color: 'var(--text-muted)' }}>"{existingReview.comment}"</p>}
                                </div>
                              )
                            }
                            return null;
                          })()}

                          {/* Botón cancelar */}
                          {(res.estado === 'confirmada' || res.estado === 'pagada') && res.fecha_salida >= new Date().toISOString().split('T')[0] && (
                            <div className="pt-2">
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
                                <p className="text-xs" style={{ color: 'var(--text-light)', fontFamily: 'var(--font-ui)', fontStyle: 'italic' }}>
                                  Ya no es posible cancelar (menos de 48h antes del check-in)
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  )
                })}
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

            <ProfileForm user={user} profile={profile} onSaved={(updated) => {
              // Actualizar el profile en el contexto local
              window.location.reload()
            }} />

            {/* Cerrar sesión */}
            <button onClick={async () => { await signOut(); router.push('/'); }}
              className="flex items-center gap-2 text-sm transition-colors mt-8"
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