'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Mail, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'

export default function VerifyEmailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email')
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [resent, setResent] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    // Check if user is already verified
    const checkVerification = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.email_confirmed_at) {
        router.push('/')
      }
    }
    
    checkVerification()
  }, [])

  const handleResendEmail = async () => {
    if (!email) return
    
    setIsResending(true)
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) throw error
      
      setResent(true)
      toast.success('Verification email resent!')
    } catch (error: any) {
      toast.error(error.message || 'Failed to resend email')
    } finally {
      setIsResending(false)
    }
  }

  const handleCheckVerification = async () => {
    setIsLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user?.email_confirmed_at) {
        toast.success('Email verified successfully!')
        router.push('/dashboard')
      } else {
        toast.info('Email not verified yet. Please check your inbox.')
      }
    } catch (error) {
      toast.error('Failed to check verification status')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex min-h-screen w-screen flex-col items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Verify your email</CardTitle>
          <CardDescription>
            We've sent a verification link to
          </CardDescription>
          <div className="mt-2">
            <div className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-sm font-medium">
              {email || 'your email'}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium">Check your inbox</p>
                <p className="text-sm text-muted-foreground">
                  Click the verification link in the email we sent to {email}
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
              <div>
                <p className="font-medium">Can't find the email?</p>
                <p className="text-sm text-muted-foreground">
                  Check your spam folder or try resending the verification email
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email || ''}
              readOnly
              className="bg-muted"
            />
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col gap-3">
          <Button 
            onClick={handleCheckVerification} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Checking...' : 'I\'ve verified my email'}
          </Button>
          
          <div className="text-center text-sm">
            <button
              onClick={handleResendEmail}
              disabled={isResending || resent}
              className="text-primary hover:underline disabled:opacity-50"
            >
              {isResending ? (
                <span className="flex items-center justify-center gap-2">
                  <RefreshCw className="h-3 w-3 animate-spin" />
                  Resending...
                </span>
              ) : resent ? (
                'Email resent!'
              ) : (
                'Resend verification email'
              )}
            </button>
          </div>
          
          <div className="text-center text-xs text-muted-foreground">
            Having trouble?{' '}
            <button
              onClick={() => router.push('/support')}
              className="hover:underline"
            >
              Contact support
            </button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}