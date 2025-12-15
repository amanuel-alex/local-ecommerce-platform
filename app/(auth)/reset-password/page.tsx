'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { forgotPasswordSchema } from '@/lib/validations/auth'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Mail, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface ForgotPasswordFormData {
  email: string
}

export default function ForgotPasswordPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit: SubmitHandler<ForgotPasswordFormData> = async (data) => {
    setLoading(true)
    const toastId = toast.loading('Sending reset email...')

    try {
      // IMPORTANT: Use password reset with redirect
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) throw error

      setEmailSent(true)
      toast.success('Reset email sent!', {
        id: toastId,
        description: 'Check your email for the reset link.',
      })
    } catch (error: any) {
      toast.error('Failed to send reset email', {
        id: toastId,
        description: error.message || 'Please try again.',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {emailSent ? 'Check Your Email' : 'Reset Your Password'}
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            {emailSent 
              ? 'We sent a reset link to your email'
              : 'Enter your email to receive a reset link'
            }
          </p>
        </div>

        {!emailSent ? (
          <>
            {/* Forgot Password Form */}
            <div className="bg-card rounded-lg border p-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
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

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                      Sending...
                    </span>
                  ) : 'Send Reset Link'}
                </Button>
              </form>
            </div>

            {/* Back to Login */}
            <div className="mt-6 text-center">
              <Link 
                href="/login" 
                className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Sign In
              </Link>
            </div>
          </>
        ) : (
          /* Success Message */
          <div className="bg-card rounded-lg border p-6">
            <div className="space-y-4">
              <div className="rounded-lg bg-primary/10 p-4 text-center">
                <p className="font-medium">
                  Reset link sent to your email
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Click the link in the email to reset your password.
                  The link expires in 24 hours.
                </p>
              </div>

              <div className="text-sm text-muted-foreground">
                <p className="font-medium mb-1">Didn't receive the email?</p>
                <ul className="space-y-1">
                  <li>• Check your spam folder</li>
                  <li>• Make sure you entered the correct email</li>
                  <li>• Wait a few minutes and try again</li>
                </ul>
              </div>

              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setEmailSent(false)}
                >
                  Try Another Email
                </Button>
                <Button asChild className="flex-1">
                  <Link href="/login">Back to Sign In</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}