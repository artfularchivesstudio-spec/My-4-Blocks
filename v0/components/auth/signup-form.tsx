'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signUpAction } from '@/app/auth/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, Loader2, CheckCircle } from 'lucide-react'
import Link from 'next/link'

/**
 * ✨ The Signup Form - Birth of a New Digital Identity
 *
 * "Where anonymous wanderers transform into recognized souls,
 * gaining the power to save their journey and return anytime."
 *
 * - The Midwife of Digital Rebirth
 */

export function SignupForm() {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState<{ message: string; email: string } | null>(null)
  const router = useRouter()

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError(null)

    const result = await signUpAction(formData)
    
    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
    } else if (result?.success && result.email) {
      setSuccess({
        message: result.message,
        email: result.email,
      })
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <Card className="w-full max-w-md border-none shadow-xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <CardTitle className="text-2xl font-serif">Check Your Email</CardTitle>
            <CardDescription>
              We&apos;ve sent a verification code to {success.email}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            {success.message}
          </p>
          <Button 
            onClick={() => router.push(`/verify-otp?email=${encodeURIComponent(success.email)}`)}
            className="w-full"
          >
            Enter Verification Code
          </Button>
          <Button 
            variant="ghost" 
            className="w-full"
            onClick={() => router.push('/login')}
          >
            Already verified? Sign in
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md border-none shadow-xl">
      <CardHeader className="text-center space-y-4">
        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
          <span className="text-2xl">✨</span>
        </div>
        <div>
          <CardTitle className="text-2xl font-serif">Create Your Account</CardTitle>
          <CardDescription>
            Save your conversations and continue your healing journey
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 flex items-start gap-2 text-sm text-destructive">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name (optional)</Label>
            <Input
              id="fullName"
              name="fullName"
              type="text"
              placeholder="Your name"
              className="bg-muted/50"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              className="bg-muted/50"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Create a secure password"
              required
              minLength={6}
              className="bg-muted/50"
            />
            <p className="text-xs text-muted-foreground">
              Must be at least 6 characters
            </p>
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link 
              href="/login" 
              className="text-primary hover:underline font-medium"
            >
              Sign in
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
