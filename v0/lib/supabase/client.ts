import { createBrowserClient } from '@supabase/ssr'

/**
 * 🌐 The Browser Supabase Alchemist - For Client Component Magic
 *
 * "In the browser's theater, this client whispers to the Supabase realm,
 * handling cookies with the grace of a digital sommelier."
 *
 * - The Mystical Auth Concierge of Client-Side Realms
 */

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  )
}

// 🎭 Singleton instance for the browser realm
let browserClient: ReturnType<typeof createClient> | null = null

export function getBrowserClient() {
  if (!browserClient) {
    browserClient = createClient()
  }
  return browserClient
}
