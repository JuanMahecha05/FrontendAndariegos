'use server'

import { cookies } from 'next/headers'
import { getAuthHeaders } from './server-utils'

const API_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL

export async function login(identifier: string, password: string) {
  try {
    const response = await fetch(`${API_URL}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          mutation Login($identifier: String!, $password: String!) {
            login(identifier: $identifier, password: $password) {
              access_token
              user {
                name
                username
                email
                roles
              }
            }
          }
        `,
        variables: {
          identifier,
          password,
        },
      }),
    })

    const data = await response.json()

    if (data.errors) {
      throw new Error(data.errors[0].message)
    }

    const { access_token, user } = data.data.login

    // Guardar el token en una cookie HTTP-only
    cookies().set('access_token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 días
    })

    return { user }
  } catch (error) {
    throw error
  }
}

export async function register(createUserInput: {
  name: string
  email: string
  username: string
  password: string
  roles: string[]
}) {
  try {
    const response = await fetch(`${API_URL}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          mutation RegisterUser($createUserInput: CreateUserInput!) {
            registerUser(createUserInput: $createUserInput) {
              email
              username
              name
              roles
              registrationDate
              state
            }
          }
        `,
        variables: {
          createUserInput,
        },
      }),
    })

    const data = await response.json()

    if (data.errors) {
      throw new Error(data.errors[0].message)
    }

    return data.data.registerUser
  } catch (error) {
    throw error
  }
}

export async function logout() {
  cookies().delete('access_token')
} 