import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * 🏰 The Server Supabase Guardian - For Server Component & Action Magic
 *
 * "Behind the server walls, this guardian validates cookies
 * and maintains the sacred session state with cryptographic precision."
 *
 * - The Vault Keeper of Server-Side Auth Realms
 */

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          } catch (error) {
            // 🌙 The setAll method may fail in Server Components
            // when rendering static pages. This is expected and harmless.
            // The middleware will handle cookie updates for those cases.
          }
        },
      },
    }
  )
}

/**
 * 🔮 Check if user is authenticated (convenience helper)
 */
export async function getUser() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  return { user, error }
}

/**
 * 🎭 Get session for auth state (convenience helper)
 */
export async function getSession() {
  const supabase = await createClient()
  const { data: { session }, error } = await supabase.auth.getSession()
  return { session, error }
}
