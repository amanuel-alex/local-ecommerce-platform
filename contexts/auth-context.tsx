'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface AuthUser {
  id: string
  email: string
  full_name: string
  role: 'admin' | 'seller' | 'customer'
}

interface AuthContextType {
  user: AuthUser | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signUp: (data: {
    email: string
    password: string
    full_name: string
    account_type: 'customer' | 'seller'
  }) => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<void>
  updateProfile: (data: Partial<AuthUser>) => Promise<{ success: boolean; error?: string }>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    // Check active sessions and subscribe to auth changes
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session?.user) {
          await fetchUserProfile(session.user.id)
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error('Auth error:', error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkUser()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          await fetchUserProfile(session.user.id)
        } else {
          setUser(null)
          router.push('/login')
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) throw error

      if (profile) {
        setUser({
          id: profile.id,
          email: profile.email,
          full_name: profile.full_name,
          role: profile.role
        })
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
      toast.error('Failed to load user profile')
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          return { success: false, error: 'Invalid email or password' }
        }
        if (error.message.includes('Email not confirmed')) {
          return { success: false, error: 'Please verify your email first' }
        }
        return { success: false, error: error.message }
      }

      if (data.user) {
        // Fetch user profile after successful login
        await fetchUserProfile(data.user.id)
        toast.success('Login successful!')
        return { success: true }
      }

      return { success: false, error: 'Login failed' }
    } catch (error: any) {
      console.error('Sign in error:', error)
      return { success: false, error: error.message || 'An error occurred during login' }
    } finally {
      setIsLoading(false)
    }
  }

  const signUp = async (userData: {
    email: string
    password: string
    full_name: string
    account_type: 'customer' | 'seller'
  }) => {
    try {
      setIsLoading(true)

      // Validate password strength
      if (userData.password.length < 8) {
        return { success: false, error: 'Password must be at least 8 characters long' }
      }

      // Check if email already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('email')
        .eq('email', userData.email)
        .single()

      if (existingUser) {
        return { success: false, error: 'Email already registered' }
      }

      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            full_name: userData.full_name,
            account_type: userData.account_type,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (authError) {
        if (authError.message.includes('already registered')) {
          return { success: false, error: 'Email already registered' }
        }
        return { success: false, error: authError.message }
      }

      if (authData.user) {
        try {
          // Create user profile
          const { error: profileError } = await supabase
            .from('users')
            .insert({
              id: authData.user.id,
              email: userData.email,
              full_name: userData.full_name,
              role: userData.account_type,
            })

          if (profileError) {
            // If profile creation fails, delete the auth user
            await supabase.auth.admin.deleteUser(authData.user.id)
            throw profileError
          }

          // If seller, create seller profile
          if (userData.account_type === 'seller') {
            const { error: sellerError } = await supabase
              .from('sellers')
              .insert({
                user_id: authData.user.id,
                business_name: `${userData.full_name}'s Business`,
                status: 'pending', // Require admin approval in real project
              })

            if (sellerError) {
              console.error('Seller profile creation error:', sellerError)
              // Continue anyway, seller profile can be created later
            }
          }

          toast.success('Registration successful! Please check your email to verify your account.')
          return { success: true }
        } catch (profileError: any) {
          console.error('Profile creation error:', profileError)
          return { success: false, error: 'Failed to create user profile' }
        }
      }

      return { success: false, error: 'Registration failed' }
    } catch (error: any) {
      console.error('Sign up error:', error)
      return { success: false, error: error.message || 'An error occurred during registration' }
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setIsLoading(true)
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      setUser(null)
      toast.success('Signed out successfully')
      router.push('/login')
    } catch (error: any) {
      toast.error('Error signing out')
      console.error('Sign out error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateProfile = async (data: Partial<AuthUser>) => {
    try {
      const { error } = await supabase
        .from('users')
        .update(data)
        .eq('id', user?.id)

      if (error) throw error

      if (user) {
        setUser({ ...user, ...data })
      }

      toast.success('Profile updated successfully')
      return { success: true }
    } catch (error: any) {
      console.error('Update profile error:', error)
      return { success: false, error: error.message || 'Failed to update profile' }
    }
  }

  const refreshUser = async () => {
    if (user?.id) {
      await fetchUserProfile(user.id)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signIn,
        signUp,
        signOut,
        updateProfile,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}