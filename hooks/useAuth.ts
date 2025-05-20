import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Verificar si hay un token en localStorage
    const token = localStorage.getItem('token')
    setIsAuthenticated(!!token)
    setIsLoading(false)
  }, [])

  const handleAuthAction = (action: () => void) => {
    if (!isAuthenticated) {
      router.push('/login')
    } else {
      action()
    }
  }

  return {
    isAuthenticated,
    isLoading,
    handleAuthAction
  }
} 