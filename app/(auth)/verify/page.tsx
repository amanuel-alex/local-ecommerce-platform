'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Mail, CheckCircle, ArrowRight, RefreshCw } from 'lucide-react'

export default function VerifyPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [resent, setResent] = useState(false)
  const email = searchParams.get('email') || 'your email'

  const handleResend = async () => {
    // In a real app, you would call an API to resend verification
    setResent(true)
    setTimeout(() => setResent(false), 5000)
  }

  return (
    <div className="space-y-8 text-center">
      <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
        <Mail className="w-10 h-10 text-white" />
      </div>
      
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Verify your email</h1>
        
        <div className="space-y-2">
          <p className="text-muted-foreground">
            We&apos;ve sent a verification link to:
          </p>
          <p className="text-lg font-semibold text-primary">{email}</p>
        </div>

        <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-500" />
            <span className="font-medium">Check your inbox</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Click the link in the email we sent to verify your account and get started.
          </p>
        </div>

        <div className="space-y-4 pt-4">
          <p className="text-sm text-muted-foreground">
            Didn&apos;t receive the email?
          </p>
          
          <Button
            variant="outline"
            onClick={handleResend}
            disabled={resent}
            className="w-full"
          >
            {resent ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Email resent!
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Resend verification email
              </>
            )}
          </Button>

          <div className="text-sm">
            <Link href="/register" className="text-primary hover:underline">
              Wrong email address?
            </Link>
          </div>
        </div>
      </div>

      <div className="pt-6 border-t">
        <p className="text-sm text-muted-foreground mb-4">
          Already verified your email?
        </p>
        <Link href="/login">
          <Button className="w-full">
            Continue to Login
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  )
}