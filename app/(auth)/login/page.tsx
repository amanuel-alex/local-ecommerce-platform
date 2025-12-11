'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
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
import { Eye, EyeOff, Mail, Lock, Sparkles, ArrowRight, Store, Shield, User } from 'lucide-react'
import { motion } from 'framer-motion'

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
      toast.error('Login failed', {
        id: toastId,
        description: error.message || 'Invalid email or password',
      })
    } finally {
      setLoading(false)
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      <div className="relative container mx-auto px-4 py-12 flex items-center justify-center min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-6xl"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <Link href="/" className="inline-flex items-center gap-3 mb-4 group">
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
                  <Store className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
              </div>
              <div className="text-left">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  MarketHub
                </h1>
                <p className="text-sm text-muted-foreground">Professional E-commerce Platform</p>
              </div>
            </Link>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Connect with buyers and sellers in your community
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Benefits */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-3xl font-bold mb-4">Welcome Back!</h2>
                <p className="text-muted-foreground">
                  Sign in to access your personalized dashboard, track orders, and manage your store.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Customer Dashboard</h3>
                    <p className="text-sm text-muted-foreground">Track orders, manage wishlist, and browse campaigns</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border">
                  <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                    <Store className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Seller Platform</h3>
                    <p className="text-sm text-muted-foreground">Manage products, track sales, and run campaigns</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border">
                  <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-amber-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Admin Tools</h3>
                    <p className="text-sm text-muted-foreground">Monitor platform activity and manage users</p>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20">
                <h4 className="font-semibold mb-2">New to MarketHub?</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Join our community of buyers and sellers. Create your account in just 2 minutes.
                </p>
                <Button asChild variant="outline" className="w-full group">
                  <Link href="/register">
                    Create Account
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </motion.div>

            {/* Right Side - Login Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-3xl blur-3xl" />
              
              <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-gray-800 shadow-2xl p-8">
                {/* Form Header */}
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary mb-4 shadow-lg">
                    <Lock className="w-7 h-7 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold">Sign In to Your Account</h2>
                  <p className="text-muted-foreground mt-2">
                    Enter your credentials to continue
                  </p>
                </div>

                {/* Social Login */}
                <div className="mb-6">
                  <SocialLogin onLoginSuccess={async (userId) => {
                    if (userId) {
                      await redirectBasedOnRole(userId)
                    }
                  }} />
                </div>

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-3 bg-white dark:bg-gray-900 text-muted-foreground">
                      Or continue with email
                    </span>
                  </div>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  {/* Email Field */}
                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email Address
                    </Label>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="you@example.com"
                          className="pl-10 h-12 rounded-lg border-gray-300 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
                          disabled={loading}
                          {...register('email')}
                        />
                      </div>
                    </div>
                    {errors.email && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <span>⚠️</span> {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Password Field */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-sm font-medium">
                        Password
                      </Label>
                      <Link
                        href="/forgot-password"
                        className="text-sm text-primary hover:text-primary/80 transition-colors"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          className="pl-10 pr-10 h-12 rounded-lg border-gray-300 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
                          disabled={loading}
                          {...register('password')}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          disabled={loading}
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>
                    {errors.password && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <span>⚠️</span> {errors.password.message}
                      </p>
                    )}
                  </div>

                  {/* Remember Me */}
                  <div className="flex items-center space-x-3">
                    <Checkbox 
                      id="remember" 
                      disabled={loading}
                      className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      {...register('remember')} 
                    />
                    <Label
                      htmlFor="remember"
                      className="text-sm text-muted-foreground cursor-pointer"
                    >
                      Remember this device for 30 days
                    </Label>
                  </div>

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    className="w-full h-12 rounded-lg bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 group"
                    disabled={loading}
                    size="lg"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent mr-3" />
                        Signing in...
                      </div>
                    ) : (
                      <>
                        Sign In
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                </form>

                {/* Sign Up Link */}
                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800 text-center">
                  <p className="text-muted-foreground">
                    Don&apos;t have an account?{' '}
                    <Link 
                      href="/register" 
                      className="text-primary font-semibold hover:text-primary/80 transition-colors"
                    >
                      Sign up now
                    </Link>
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Footer Note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-12 text-center text-sm text-muted-foreground"
          >
            <p>By continuing, you agree to our <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.</p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}