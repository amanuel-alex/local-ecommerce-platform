'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { resetPasswordSchema } from '@/lib/validations/auth'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Lock, CheckCircle } from 'lucide-react'
import Link from 'next/link'

interface ResetPasswordFormData {
  password: string
  confirmPassword: string
}

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [validToken, setValidToken] = useState(false)
  const [email, setEmail] = useState<string>('')

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  })

  // Check if we have a valid reset token
  useEffect(() => {
    const checkResetToken = async () => {
      const token = searchParams.get('token')
      const type = searchParams.get('type')
      
      if (token && type === 'recovery') {
        try {
          // Verify the token with Supabase
          const { data, error } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: 'recovery',
          })

          if (error) {
            toast.error('Invalid or expired reset link')
            router.push('/forgot-password')
            return
          }

          if (data.user?.email) {
            setEmail(data.user.email)
            setValidToken(true)
          }
        } catch (error) {
          console.error('Token verification error:', error)
          toast.error('Invalid or expired reset link')
          router.push('/forgot-password')
        }
      } else {
        toast.error('Invalid reset link')
        router.push('/forgot-password')
      }
    }

    checkResetToken()
  }, [searchParams, router, supabase.auth])

  const onSubmit: SubmitHandler<ResetPasswordFormData> = async (data) => {
    if (!validToken || !email) {
      toast.error('Invalid reset link')
      router.push('/forgot-password')
      return
    }

    setLoading(true)
    const toastId = toast.loading('Updating password...')

    try {
      // Update password using the token from URL
      const { error } = await supabase.auth.updateUser({
        password: data.password,
      })

      if (error) throw error

      toast.success('Password updated successfully!', {
        id: toastId,
        description: 'You can now sign in with your new password.',
      })

      // Redirect to login after successful password reset
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } catch (error: any) {
      toast.error('Failed to update password', {
        id: toastId,
        description: error.message || 'Please try again.',
      })
    } finally {
      setLoading(false)
    }
  }

  if (!validToken) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 mb-4">
              <Lock className="h-8 w-8 text-destructive" />
            </div>
            <h1 className="text-2xl font-semibold mb-2">Invalid Reset Link</h1>
            <p className="text-muted-foreground">
              This password reset link is invalid or has expired.
            </p>
          </div>
          <Button asChild className="w-full">
            <Link href="/forgot-password">Request New Reset Link</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Lock className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Set New Password</h1>
          <p className="text-sm text-muted-foreground mt-2">
            For: <span className="font-medium">{email}</span>
          </p>
        </div>

        {/* Password Reset Form */}
        <div className="bg-card rounded-lg border p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* New Password */}
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter new password"
                  className="pl-10"
                  disabled={loading}
                  {...register('password')}
                />
              </div>
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <CheckCircle className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                  className="pl-10"
                  disabled={loading}
                  {...register('confirmPassword')}
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Password Requirements */}
            <div className="rounded-lg bg-muted p-3 text-sm">
              <p className="font-medium mb-1">Password requirements:</p>
              <ul className="space-y-1 text-muted-foreground">
                <li>• At least 8 characters</li>
                <li>• One uppercase letter</li>
                <li>• One lowercase letter</li>
                <li>• One number</li>
              </ul>
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
                  Updating Password...
                </span>
              ) : 'Reset Password'}
            </Button>
          </form>
        </div>

        {/* Back to Login Link */}
        <div className="mt-6 text-center">
          <Link 
            href="/login" 
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}