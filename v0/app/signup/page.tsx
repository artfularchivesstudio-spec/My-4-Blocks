import { SignupForm } from '@/components/auth/signup-form'

/**
 * ✨ The Signup Page - Birthplace of New Identities
 *
 * Where anonymous wanderers become recognized members,
 * gaining the power to save their healing journey.
 */

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      <SignupForm />
    </div>
  )
}
