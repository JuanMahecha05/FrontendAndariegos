// lib/client-actions.ts
import { jwtDecode } from 'jwt-decode'
import { decryptToken, isValidJWT } from './utils'

const API_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL

export async function login(formData: { identifier: string; password: string }) {
  const { identifier, password } = formData

  if (!identifier || !password) {
    throw new Error('Email y contraseña son requeridos')
  }

  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ identifier, password }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Error al iniciar sesión')
    }

    const { access_token, user } = data

    let processedToken = access_token
    if (!isValidJWT(access_token)) {
      processedToken = decryptToken(access_token)
    }

    const decodedToken = jwtDecode(processedToken)
    const roles = (decodedToken as any).roles || ['USER']

    const transformedUser = {
      name: user.name,
      username: user.username,
      email: user.email,
      roles: roles,
      id: user._id
    }

    return { success: true, token: processedToken, user: transformedUser }
  } catch (error: any) {
    throw new Error(error.message || 'Error al iniciar sesión')
  }
}
