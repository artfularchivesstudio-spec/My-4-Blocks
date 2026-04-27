import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

/**
 * 🚪 The Middleware Guardian - Route Protection Sorcerer
 *
 * "At the threshold of every request, this guardian checks the sacred tokens,
 * redirecting lost souls to authentication when needed, while allowing
 * anonymous travelers their first three exchanges in peace."
 *
 * - The Digital Bouncer with a Heart of Gold
 */

// 🌟 Routes that require authentication
const PROTECTED_ROUTES = [
  '/dashboard',
  '/history',
  '/settings',
  '/profile',
]

// 🌙 Auth routes that logged-in users shouldn't see
const AUTH_ROUTES = [
  '/login',
  '/signup',
  '/verify-otp',
  '/forgot-password',
  '/reset-password',
]

export async function middleware(request: NextRequest) {
  // 🔮 Update session and get user
  const { supabaseResponse, user } = await updateSession(request)

  const { pathname } = request.nextUrl
  const isAuthenticated = !!user

  // 🛡️ Check if accessing protected route
  const isProtectedRoute = PROTECTED_ROUTES.some(route => 
    pathname.startsWith(route)
  )

  // 🔐 Check if accessing auth route while logged in
  const isAuthRoute = AUTH_ROUTES.some(route => 
    pathname.startsWith(route)
  )

  // 🚫 Redirect unauthenticated users from protected routes
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // 🔄 Redirect authenticated users away from auth pages
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // ✨ All other routes (including /) are publicly accessible
  // The 3-message trial logic is handled client-side in the chat component
  return supabaseResponse
}

/**
 * 📍 Matcher Configuration
 * Only run middleware on routes that need auth checking
 */
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
