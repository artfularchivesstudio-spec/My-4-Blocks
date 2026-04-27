import { LoginForm } from '@/components/auth/login-form'

/**
 * 🔑 The Login Page - Public Gateway for Returning Souls
 *
 * A clean, centered auth page that welcomes users back to their journey.
 */

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      <LoginForm />
    </div>
  )
}
