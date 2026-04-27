'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { getBrowserClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

/**
 * 🎭 The Auth Context - Client-Side Auth State Sorcery
 *
 * "A React context that breathes with the user's session,
 * updating in real-time as the auth state dances across the app."
 *
 * - The Living Breath of Authentication Awareness
 */

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  refreshUser: async () => {},
})

export function useAuth() {
  return useContext(AuthContext)
}

interface AuthProviderProps {
  children: React.ReactNode
  initialUser?: User | null
}

export function AuthProvider({ children, initialUser = null }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(initialUser)
  const [isLoading, setIsLoading] = useState(!initialUser)
  const supabase = getBrowserClient()

  const refreshUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
  }

  useEffect(() => {
    // 🌟 Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          setUser(session?.user ?? null)
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
        }
      }
    )

    // 🔮 Initial session check (if no initialUser provided)
    if (!initialUser) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setUser(session?.user ?? null)
        setIsLoading(false)
      })
    }

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, initialUser])

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
