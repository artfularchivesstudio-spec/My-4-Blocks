import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * 🚪 The Middleware Gatekeeper - Route Protection Sorcerer
 *
 * "At the threshold of every request, this guardian checks the sacred tokens,
 * redirecting lost souls to the authentication realm when needed."
 *
 * - The Digital Bouncer of the App Router Era
 */

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
          })
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // 🔮 Refresh session if expired - required for Server Components
  // This ensures Server Components have fresh auth data
  const { data: { user } } = await supabase.auth.getUser()

  return { supabase, supabaseResponse, user }
}
