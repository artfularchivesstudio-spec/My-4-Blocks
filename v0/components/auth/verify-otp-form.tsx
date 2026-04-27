'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { verifyOtpAction } from '@/app/auth/actions'
import { Button } from '@/components/ui/button'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, Loader2 } from 'lucide-react'

/**
 * 🔮 The OTP Verification Form - Confirming the Sacred Email
 *
 * "Six digits that bridge the gap between anonymity and identity,
 * sealing the covenant between user and service."
 *
 * - The Keymaster of Digital Trust
 */

export function VerifyOtpForm() {
  const [otp, setOtp] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError(null)

    // Append OTP to form data
    formData.append('token', otp)

    const result = await verifyOtpAction(formData)
    
    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
    }
    // Success redirects automatically via the server action
  }

  if (!email) {
    return (
      <Card className="w-full max-w-md border-none shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Invalid Link</CardTitle>
          <CardDescription>
            Please go back and sign up again to receive a new verification code.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => router.push('/signup')} className="w-full">
            Back to Signup
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md border-none shadow-xl">
      <CardHeader className="text-center space-y-4">
        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
          <span className="text-2xl">📧</span>
        </div>
        <div>
          <CardTitle className="text-2xl font-serif">Verify Your Email</CardTitle>
          <CardDescription>
            Enter the 6-digit code sent to {email}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-6">
          <input type="hidden" name="email" value={email} />
          
          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 flex items-start gap-2 text-sm text-destructive">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          
          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={setOtp}
              name="otp-display"
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={isLoading || otp.length !== 6}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Verifying...
              </>
            ) : (
              'Verify Email'
            )}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            Didn&apos;t receive the code?{' '}
            <button 
              type="button"
              onClick={() => router.push('/signup')}
              className="text-primary hover:underline font-medium"
            >
              Try again
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
