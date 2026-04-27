import { VerifyOtpForm } from '@/components/auth/verify-otp-form'
import { Suspense } from 'react'

/**
 * 🔮 The OTP Verification Page - Confirming Identity
 *
 * Where the email covenant is sealed with six sacred digits.
 */

export default function VerifyOtpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      <Suspense fallback={
        <div className="w-full max-w-md h-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      }>
        <VerifyOtpForm />
      </Suspense>
    </div>
  )
}
