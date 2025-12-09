'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema } from '@/lib/validations/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SocialLogin } from '@/components/auth/social-login'
import { User, Mail, Lock, Eye, EyeOff, Store, AlertCircle } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'

type FormData = {
  full_name: string
  email: string
  password: string
  confirm_password: string
  account_type: 'customer' | 'seller'
}

export default function RegisterPage() {
  const router = useRouter()
  const { signUp } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
    setIsLoading(true)
    setError(null)

    try {
      const result = await signUp({
        email: data.email,
        password: data.password,
        full_name: data.full_name,
        account_type: data.account_type
      })
      
      if (result.success) {
        router.push(`/verify?email=${encodeURIComponent(data.email)}`)
      } else {
        setError(result.error || 'Registration failed')
      }
    } catch (error: any) {
      setError(error.message || 'An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex min-h-screen w-screen flex-col items-center justify-center py-8">
      <div className="mx-auto flex w-full flex-col justify-center space-y-8 sm:w-[500px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-3xl font-bold">Create Account</h1>
          <p className="text-muted-foreground">
            Join thousands of local buyers and sellers
          </p>
        </div>

        {error && (
          <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-md flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}

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
                disabled={isLoading}
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
                disabled={isLoading}
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
                disabled={isLoading}
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3"
                disabled={isLoading}
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
            <p className="text-xs text-muted-foreground">
              Must be at least 8 characters long
            </p>
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
                disabled={isLoading}
                {...register('confirm_password')}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3"
                disabled={isLoading}
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
                  disabled={isLoading}
                  {...register('account_type')}
                />
                <div className="flex flex-col items-center p-4 rounded-xl border-2 border-gray-200 dark:border-gray-800 peer-checked:border-primary peer-checked:bg-primary/5 cursor-pointer transition-all hover:border-primary/50">
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
                  disabled={isLoading}
                  {...register('account_type')}
                />
                <div className="flex flex-col items-center p-4 rounded-xl border-2 border-gray-200 dark:border-gray-800 peer-checked:border-primary peer-checked:bg-primary/5 cursor-pointer transition-all hover:border-primary/50">
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

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Creating account...' : 'Create Account'}
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
    </div>
  )
}