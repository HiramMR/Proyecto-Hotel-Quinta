// ============================================================
// lib/auth-context.tsx — Contexto global de autenticación
//
// Cambios respecto a la versión anterior:
// - Profile ahora incluye el campo `role`
// - Se expone `isAdmin` para verificar fácilmente si es admin
// ============================================================
'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase } from './supabase'

interface User {
  id: string;
  email?: string;
}

interface Profile {
  id: string
  nombre: string | null
  apellido: string | null
  telefono: string | null
  role: string | null
  last_profile_update: string | null
}

interface AuthContextType {
  user: User | null
  profile: Profile | null
  loading: boolean
  profileLoaded: boolean
  isAdmin: boolean
  signOut: () => Promise<void>
  signIn: (email: string, password: string) => Promise<{ error: { message: string } | null }>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  profileLoaded: false,
  isAdmin: false,
  signOut: async () => {},
  signIn: async () => ({ error: { message: 'Not implemented' } }),
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [profileLoaded, setProfileLoaded] = useState(false)

  const initAuth = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (session?.user) {
      setUser({ id: session.user.id, email: session.user.email })
      
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()
        
      setProfile(profileData)
    } else {
      setUser(null)
      setProfile(null)
    }
    
    setProfileLoaded(true)
    setLoading(false)
  }, [])

  useEffect(() => {
    initAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      initAuth()
    })
    return () => subscription.unsubscribe()
  }, [initAuth])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (!error) await initAuth()
    return { error }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
  }

  // isAdmin: true solo si el perfil tiene role = 'admin'
  const isAdmin = profile?.role === 'admin'

  return (
    <AuthContext.Provider value={{ user, profile, loading, profileLoaded, isAdmin, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)