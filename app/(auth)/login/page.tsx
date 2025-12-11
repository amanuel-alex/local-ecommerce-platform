'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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
import { SocialLogin } from '@/components/auth/social-login'
import { toast } from 'sonner'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'

// Define form data interface
interface LoginFormData {
  email: string
  password: string
  remember?: boolean
}

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Initialize form with proper typing
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

  // Get user role and redirect accordingly
  const redirectBasedOnRole = async (userId: string) => {
    try {
      const role = await getUserRoleClient(userId)
      
      // CORRECT PATHS - Based on your folder structure with (dashboard) route group
      switch (role) {
        case 'admin':
          router.push('/admin')  // This goes to app/(dashboard)/admin/page.tsx
          break
        case 'seller':
          router.push('/seller')  // This goes to app/(dashboard)/seller/page.tsx
          break
        case 'customer':
          router.push('/customer')  // This goes to app/(dashboard)/customer/page.tsx
          break
        default:
          router.push('/')
      }
      router.refresh()
    } catch (error) {
      console.error('Error determining user role:', error)
      router.push('/')
    }
  }

  // Typed submit handler
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
        // Store remember me preference
        if (data.remember) {
          localStorage.setItem('rememberMe', 'true')
        }
        
        toast.success('Welcome back!', {
          id: toastId,
          description: 'Successfully logged in.',
        })
        
        // Redirect based on role
        await redirectBasedOnRole(authData.user.id)
      }
    } catch (error: any) {
      toast.error('Login failed', {
        id: toastId,
        description: error.message || 'Invalid email or password',
      })
    } finally {
      setLoading(false)
    }
  }

  // Check for existing session on component mount
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
    <div className="container mx-auto flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="space-y-8 rounded-lg border bg-card p-8 shadow-lg">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight">Welcome Back</h2>
            <p className="text-muted-foreground mt-2">
              Sign in to your account to continue
            </p>
          </div>
{/* 
          <SocialLogin onLoginSuccess={async (userId) => {
            if (userId) {
              await redirectBasedOnRole(userId)
            }
          }} /> */}

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-card text-muted-foreground">
                Or continue with email
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                Remember me for 30 days
              </Label>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
              size="lg"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                  Signing in...
                </div>
              ) : (
                'Sign in'
              )}
            </Button>
          </form>

          <div className="text-center text-sm">
            Don&apos;t have an account?{' '}
            <Link 
              href="/register" 
              className="text-primary font-semibold hover:underline"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}