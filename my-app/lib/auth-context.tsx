// ============================================================
// lib/auth-context.tsx — Contexto global de autenticación
//
// Proporciona el estado de sesión a todos los componentes
// de la aplicación sin necesidad de pasar props manualmente.
//
// Uso:
//   const { user, profile, loading } = useAuth()
//
// - user: objeto de Supabase con email, id, etc. (null si no hay sesión)
// - profile: datos del perfil (nombre, apellido, teléfono)
// - loading: true mientras se verifica la sesión inicial
// ============================================================
'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from './supabase'
import type { User } from '@supabase/supabase-js'

// ── Tipos ──
interface Profile {
  id: string
  nombre: string | null
  apellido: string | null
  telefono: string | null
}

interface AuthContextType {
  user: User | null
  profile: Profile | null
  loading: boolean
  signOut: () => Promise<void>
}

// ── Crear el contexto ──
const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  signOut: async () => {},
})

// ── Provider — envuelve toda la app en layout.tsx ──
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  // Cargar perfil desde la tabla profiles
  const loadProfile = async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    setProfile(data)
  }

  useEffect(() => {
    // Verificar si hay sesión activa al cargar la app
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) loadProfile(session.user.id)
      setLoading(false)
    })

    // Escuchar cambios de sesión (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        if (session?.user) {
          await loadProfile(session.user.id)
        } else {
          setProfile(null)
        }
        setLoading(false)
      }
    )

    // Limpiar el listener al desmontar
    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

// ── Hook para usar el contexto fácilmente ──
export const useAuth = () => useContext(AuthContext)