import { type EmailOtpType } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'
import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * 🔮 The Email Confirmation Handler - Sealing the Digital Covenant
 *
 * "When Supabase sends a confirmation email, this endpoint receives
 * the sacred token and exchanges it for an authenticated session."
 *
 * - The Exchange Master of Email Verification
 */

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/'

  if (token_hash && type) {
    const supabase = await createClient()

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })

    if (!error) {
      // 🎉 Verification successful - redirect with welcome
      const redirectUrl = new URL(next, request.url)
      redirectUrl.searchParams.set('verified', 'true')
      return redirect(redirectUrl.toString())
    }
  }

  // 💥 Verification failed - redirect to error page or retry
  return redirect('/login?error=verification_failed')
}
