'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signInAction } from '@/app/auth/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'

/**
 * 🔑 The Login Form - Gateway to the Authenticated Realm
 *
 * "A simple, elegant portal for returning souls to reclaim their digital identity."
 *
 * - The Gentle Guardian of Returning Souls
 */

export function LoginForm() {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError(null)

    const result = await signInAction(formData)
    
    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
    }
    // Success redirects automatically via the server action
  }

  return (
    <Card className="w-full max-w-md border-none shadow-xl">
      <CardHeader className="text-center space-y-4">
        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
          <span className="text-2xl">🔑</span>
        </div>
        <div>
          <CardTitle className="text-2xl font-serif">Welcome Back</CardTitle>
          <CardDescription>
            Continue your journey with the Four Blocks
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
              placeholder="Enter your password"
              required
              className="bg-muted/50"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link 
              href="/signup" 
              className="text-primary hover:underline font-medium"
            >
              Create one
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
