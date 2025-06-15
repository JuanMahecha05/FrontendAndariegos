import { cookies } from 'next/headers'
import { jwtDecode } from 'jwt-decode'

export type User = {
  name: string
  username: string
  email: string
  roles: string[]
}

export async function getServerSession() {
  const cookieStore = cookies()
  const token = cookieStore.get('access_token')?.value

  if (!token) {
    return null
  }

  try {
    const decoded = jwtDecode<User & { exp: number }>(token)
    const currentTime = Date.now() / 1000

    if (decoded.exp < currentTime) {
      return null
    }

    return {
      user: {
        name: decoded.name,
        username: decoded.username,
        email: decoded.email,
        roles: decoded.roles,
      },
      token,
    }
  } catch (error) {
    return null
  }
}

export async function getAuthHeaders() {
  const session = await getServerSession()
  
  return {
    Authorization: session?.token ? `Bearer ${session.token}` : '',
  }
}

export function isAuthenticated(roles?: string[]) {
  return async () => {
    const session = await getServerSession()
    
    if (!session) {
      return false
    }

    if (roles && roles.length > 0) {
      return roles.some(role => session.user.roles.includes(role))
    }

    return true
  }
} 