'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema } from '@/lib/validations/auth'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SocialLogin } from '@/components/auth/social-login'
import { User, Mail, Lock, Eye, EyeOff, Store } from 'lucide-react'
import { toast } from 'sonner'

type FormData = {
  full_name: string
  email: string
  password: string
  confirm_password: string
  account_type: 'customer' | 'seller'
}

export default function RegisterPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      account_type: 'customer',
    },
  })

  const password = watch('password')

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      // 1. Sign up user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.full_name,
            account_type: data.account_type,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (authError) throw authError

      if (authData.user) {
        // 2. Create user profile
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: authData.user.id,
            email: data.email,
            full_name: data.full_name,
            role: data.account_type,
          })

        if (profileError) throw profileError

        // 3. If seller, create seller profile
        if (data.account_type === 'seller') {
          await supabase.from('sellers').insert({
            user_id: authData.user.id,
            business_name: `${data.full_name}'s Business`,
          })
        }
      }

      toast.success('Account created!', {
        description: 'Please check your email to verify your account.',
        duration: 5000,
      })

      router.push('/verify?email=' + encodeURIComponent(data.email))
    } catch (error: any) {
      toast.error('Registration failed', {
        description: error.message || 'Something went wrong',
        duration: 5000,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold">Create Account</h2>
        <p className="text-muted-foreground mt-2">
          Join thousands of local buyers and sellers
        </p>
      </div>

      <SocialLogin />

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-background text-muted-foreground">
            Or sign up with email
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="full_name">Full Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="full_name"
              placeholder="John Doe"
              className="pl-10"
              {...register('full_name')}
            />
          </div>
          {errors.full_name && (
            <p className="text-sm text-destructive">{errors.full_name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="pl-10"
              {...register('email')}
            />
          </div>
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className="pl-10 pr-10"
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-destructive">{errors.password.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm_password">Confirm Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="confirm_password"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className="pl-10 pr-10"
              {...register('confirm_password')}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-3"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
          </div>
          {errors.confirm_password && (
            <p className="text-sm text-destructive">{errors.confirm_password.message}</p>
          )}
        </div>

        <div className="space-y-3">
          <Label>Account Type</Label>
          <div className="grid grid-cols-2 gap-4">
            <label className="relative">
              <input
                type="radio"
                value="customer"
                className="peer sr-only"
                {...register('account_type')}
              />
              <div className="flex flex-col items-center p-4 rounded-xl border-2 border-gray-200 dark:border-gray-800 peer-checked:border-primary peer-checked:bg-primary/5 cursor-pointer transition-all">
                <User className="w-8 h-8 mb-2 text-gray-600 dark:text-gray-400 peer-checked:text-primary" />
                <span className="font-medium">Customer</span>
                <span className="text-xs text-muted-foreground text-center mt-1">
                  Browse & buy products
                </span>
              </div>
            </label>
            <label className="relative">
              <input
                type="radio"
                value="seller"
                className="peer sr-only"
                {...register('account_type')}
              />
              <div className="flex flex-col items-center p-4 rounded-xl border-2 border-gray-200 dark:border-gray-800 peer-checked:border-primary peer-checked:bg-primary/5 cursor-pointer transition-all">
                <Store className="w-8 h-8 mb-2 text-gray-600 dark:text-gray-400 peer-checked:text-primary" />
                <span className="font-medium">Seller</span>
                <span className="text-xs text-muted-foreground text-center mt-1">
                  Sell your products
                </span>
              </div>
            </label>
          </div>
          {errors.account_type && (
            <p className="text-sm text-destructive">{errors.account_type.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Creating account...' : 'Create Account'}
        </Button>
      </form>

      <div className="text-center text-sm">
        Already have an account?{' '}
        <Link href="/login" className="text-primary font-semibold hover:underline">
          Sign in
        </Link>
      </div>

      <div className="text-center text-xs text-muted-foreground">
        By creating an account, you agree to our{' '}
        <Link href="/terms" className="hover:underline">
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link href="/privacy" className="hover:underline">
          Privacy Policy
        </Link>
      </div>
    </div>
  )
}