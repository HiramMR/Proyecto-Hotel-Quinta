// ============================================================
// lib/auth-context.tsx — Contexto global de autenticación
//
// Cambios respecto a la versión anterior:
// - Profile ahora incluye el campo `role`
// - Se expone `isAdmin` para verificar fácilmente si es admin
// ============================================================
'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'

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

  const initAuth = useCallback(() => {
    // 1. Asegurarnos de que siempre existan los usuarios por defecto
    let storedUsers = localStorage.getItem('users')
    if (!storedUsers || JSON.parse(storedUsers).length === 0) {
      const defaultUsers = [
        { id: '1', nombre: 'Admin', apellido: 'Sistema', email: 'admin@quintadalam.com', password: 'admin', telefono: '555-0000', role: 'admin', created_at: new Date().toISOString() },
        { id: '2', nombre: 'Juan', apellido: 'Pérez', email: 'juan@example.com', password: 'password123', telefono: '555-1234', role: 'user', created_at: new Date().toISOString() },
        { id: '3', nombre: 'María', apellido: 'Gómez', email: 'maria@example.com', password: 'password123', telefono: '555-5678', role: 'user', created_at: new Date().toISOString() }
      ]
      localStorage.setItem('users', JSON.stringify(defaultUsers))
      storedUsers = JSON.stringify(defaultUsers)
    }

    const storedUser = localStorage.getItem('currentUser')
    if (storedUser) {
      try {
        const userObj = JSON.parse(storedUser)
        setUser({ id: userObj.id, email: userObj.email })

        const users = JSON.parse(storedUsers)
        const userProfile = users.find((u: any) => u.id === userObj.id)
        
        if (userProfile) {
          setProfile(userProfile)
        } else {
          setProfile(null)
        }
      } catch (e) {
        console.error('Error al cargar sesión local', e)
        setUser(null)
        setProfile(null)
      }
    } else {
      setUser(null)
      setProfile(null)
    }
    setProfileLoaded(true)
    setLoading(false)
  }, [])

  useEffect(() => {
    initAuth()

    // Escuchar cambios en localStorage para sincronizar pestañas
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'currentUser' || e.key === 'users') {
        initAuth()
      }
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [initAuth])

  const signIn = async (email: string, password: string) => {
    // 2. Verificar datos nuevamente en el momento de iniciar sesión
    let storedUsers = localStorage.getItem('users')
    if (!storedUsers || JSON.parse(storedUsers).length === 0) {
      const defaultUsers = [
        { id: '1', nombre: 'Admin', apellido: 'Sistema', email: 'admin@quintadalam.com', password: 'admin', telefono: '555-0000', role: 'admin', created_at: new Date().toISOString() },
        { id: '2', nombre: 'Juan', apellido: 'Pérez', email: 'juan@example.com', password: 'password123', telefono: '555-1234', role: 'user', created_at: new Date().toISOString() },
        { id: '3', nombre: 'María', apellido: 'Gómez', email: 'maria@example.com', password: 'password123', telefono: '555-5678', role: 'user', created_at: new Date().toISOString() }
      ]
      localStorage.setItem('users', JSON.stringify(defaultUsers))
      storedUsers = JSON.stringify(defaultUsers)
    }

    const users = JSON.parse(storedUsers)
    // 3. Ignorar espacios accidentales o mayúsculas
    const userObj = users.find((u: any) => 
      u.email.toLowerCase().trim() === email.toLowerCase().trim() && u.password === password
    )
    
    if (userObj) {
      localStorage.setItem('currentUser', JSON.stringify({ id: userObj.id, email: userObj.email }))
      initAuth()
      return { error: null }
    }
    return { error: { message: 'Credenciales inválidas o usuario no encontrado.' } }
  }

  const signOut = async () => {
    localStorage.removeItem('currentUser')
    initAuth()
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