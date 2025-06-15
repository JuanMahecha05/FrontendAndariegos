import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtDecode } from 'jwt-decode'

// Rutas que requieren autenticación
const protectedRoutes = [
  '/eventos-admin',
  '/editar-tour',
  '/crear-tour',
  '/eventos-reservados'
]

// Rutas que solo pueden acceder usuarios no autenticados
const authRoutes = ['/login', '/register']

export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value
  const { pathname } = request.nextUrl

  // Verificar si la ruta actual requiere autenticación
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))

  if (isProtectedRoute) {
    if (!token) {
      // Redirigir a login si no hay token
      return NextResponse.redirect(new URL('/login', request.url))
    }

    try {
      // Verificar si el token es válido
      const decoded = jwtDecode(token)
      const currentTime = Date.now() / 1000

      if (decoded.exp && decoded.exp < currentTime) {
        // Token expirado
        return NextResponse.redirect(new URL('/login', request.url))
      }
    } catch (error) {
      // Token inválido
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  if (isAuthRoute && token) {
    // Redirigir a home si ya está autenticado
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
} 