"use client";
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth as useAuthContext } from './AuthContext'
import Cookies from 'js-cookie'
// import { UserRole } from '@/lib/roles' // Descomentar cuando el enum esté disponible

export type UserRole = 'user' | 'organizador' | 'admin' // Temporal, reemplazar por el enum

export interface AuthUser {
  id: string
  name: string
  email: string
  role: UserRole
}

export const useAuth = () => {
  const authContext = useAuthContext()
  const [isClient, setIsClient] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Verificar si hay un token en las cookies al montar el componente
  useEffect(() => {
    if (isClient && !authContext.isAuthenticated) {
      const token = Cookies.get('client_token')
      if (token) {
        // El contexto ya debería haber cargado el token, pero por si acaso
        console.log('Token encontrado en cookies, verificando...')
      }
    }
  }, [isClient, authContext.isAuthenticated])

  const handleAuthAction = (action: () => void) => {
    if (!authContext.user) {
      router.push('/login')
    } else {
      action()
    }
  }

  return {
    ...authContext,
    isClient,
    handleAuthAction
  }
} 