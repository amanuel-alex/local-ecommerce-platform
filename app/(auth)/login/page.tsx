'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema } from '@/lib/validations/auth'
import { createClient } from '@/lib/supabase/client'
import { getUserRoleClient } from '@/lib/utils/auth-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'

interface LoginFormData {
  email: string
  password: string
  remember?: boolean
}

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Check for error query parameter
  useEffect(() => {
    const error = searchParams.get('error')
    if (error === 'auth_callback_failed') {
      toast.error('Authentication failed', {
        description: 'Please try logging in again.'
      })
    }
  }, [searchParams])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      remember: false,
    },
  })

  const redirectBasedOnRole = async (userId: string) => {
    try {
      const role = await getUserRoleClient(userId)
      
      // Clear loading state
      setLoading(false)
      
      switch (role) {
        case 'admin': 
          router.push('/admin')
          break
        case 'seller': 
          router.push('/seller')
          break
        case 'customer': 
          router.push('/customer')
          break
        default: 
          router.push('/')
      }
    } catch (error) {
      console.error('Error determining user role:', error)
      setLoading(false)
      // Fallback redirect based on user metadata
      router.push('/')
    }
  }

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    setLoading(true)
    const toastId = toast.loading('Signing in...')
    
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (error) throw error

      if (authData.user) {
        if (data.remember) {
          localStorage.setItem('rememberMe', 'true')
        }
        
        toast.success('Welcome back!', {
          id: toastId,
          description: 'Successfully logged in.',
        })
        
        await redirectBasedOnRole(authData.user.id)
      }
    } catch (error: any) {
      setLoading(false)
      toast.error('Login failed', {
        id: toastId,
        description: error.message || 'Invalid email or password',
      })
    }
  }

  // Check for existing session
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          await redirectBasedOnRole(session.user.id)
        }
      } catch (error) {
        console.error('Session check error:', error)
      }
    }
    
    checkSession()
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Enter your credentials to sign in
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-card rounded-lg border p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="pl-10"
                  disabled={loading}
                  {...register('email')}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                  disabled={loading}
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="remember" 
                disabled={loading}
                {...register('remember')} 
              />
              <Label
                htmlFor="remember"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Remember me
              </Label>
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                  Signing in...
                </span>
              ) : 'Sign in'}
            </Button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 pt-6 border-t text-center text-sm">
            Don't have an account?{' '}
            <Link 
              href="/register" 
              className="text-primary font-medium hover:underline"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}