'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

/**
 * 🎭 The Auth Server Actions - Server-Side Auth Rituals
 *
 * "Each action is a sacred ceremony, performed behind the server veil,
 * where cookies are sealed and tokens are exchanged with cryptographic grace."
 *
 * - The High Priest of Authentication Ceremonies
 */

// 🌟 Sign Up - Begin the journey with email confirmation
export async function signUpAction(formData: FormData) {
  const supabase = await createClient()
  
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('fullName') as string

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  })

  if (error) {
    return { error: error.message }
  }

  if (data.user && data.session === null) {
    // 🎉 Email confirmation sent - user needs to verify
    return { 
      success: true, 
      message: 'Check your email for the confirmation code!',
      email 
    }
  }

  return { success: true, message: 'Account created successfully!' }
}

// 🔑 Sign In - Return to the realm
export async function signInAction(formData: FormData) {
  const supabase = await createClient()
  
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

// 🚪 Sign Out - Depart with dignity
export async function signOutAction() {
  const supabase = await createClient()
  
  const { error } = await supabase.auth.signOut()
  
  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

// 🔮 Verify OTP - Confirm the sacred email
export async function verifyOtpAction(formData: FormData) {
  const supabase = await createClient()
  
  const email = formData.get('email') as string
  const token = formData.get('token') as string

  const { error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'email',
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/?welcome=true')
}

// 🔄 Reset Password - Begin the recovery ritual
export async function resetPasswordAction(formData: FormData) {
  const supabase = await createClient()
  
  const email = formData.get('email') as string

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?type=recovery`,
  })

  if (error) {
    return { error: error.message }
  }

  return { 
    success: true, 
    message: 'Password reset instructions sent to your email!' 
  }
}

// 🆕 Update Password - Complete the recovery
export async function updatePasswordAction(formData: FormData) {
  const supabase = await createClient()
  
  const password = formData.get('password') as string

  const { error } = await supabase.auth.updateUser({
    password,
  })

  if (error) {
    return { error: error.message }
  }

  return { 
    success: true, 
    message: 'Password updated successfully!' 
  }
}
