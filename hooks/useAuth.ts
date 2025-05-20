"use client";
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
// import { UserRole } from '@/lib/roles' // Descomentar cuando el enum esté disponible

export type UserRole = 'user' | 'organizador' | 'admin' // Temporal, reemplazar por el enum

export interface AuthUser {
  id: string
  name: string
  email: string
  role: UserRole
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Simulación: obtener usuario y rol desde localStorage o JWT
    const stored = localStorage.getItem('authUser')
    if (stored) {
      setUser(JSON.parse(stored))
    }
    setLoading(false)
  }, [])

  const login = (userData: AuthUser) => {
    setUser(userData)
    localStorage.setItem('authUser', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('authUser')
  }

  const handleAuthAction = (action: () => void) => {
    if (!user) {
      router.push('/login')
    } else {
      action()
    }
  }

  return {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
    handleAuthAction
  }
} 