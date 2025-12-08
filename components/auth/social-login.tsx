'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Github, Chrome, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export function SocialLogin() {
  const supabase = createClient()
  const [loading, setLoading] = useState<'google' | 'github' | null>(null)

  const handleGoogleLogin = async () => {
    setLoading('google')
    const toastId = toast.loading('Connecting with Google...')
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      
      if (error) throw error
      
      toast.success('Redirecting to Google...', { id: toastId })
    } catch (error: any) {
      toast.error('Google login failed', {
        id: toastId,
        description: error.message,
      })
      setLoading(null)
    }
  }

  const handleGithubLogin = async () => {
    setLoading('github')
    const toastId = toast.loading('Connecting with GitHub...')
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      
      if (error) throw error
      
      toast.success('Redirecting to GitHub...', { id: toastId })
    } catch (error: any) {
      toast.error('GitHub login failed', {
        id: toastId,
        description: error.message,
      })
      setLoading(null)
    }
  }

  return (
    <div className="space-y-3">
      <Button
        type="button"
        variant="outline"
        className="w-full relative"
        onClick={handleGoogleLogin}
        disabled={!!loading}
      >
        {loading === 'google' ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Chrome className="mr-2 h-4 w-4" />
        )}
        Continue with Google
      </Button>

      <Button
        type="button"
        variant="outline"
        className="w-full relative"
        onClick={handleGithubLogin}
        disabled={!!loading}
      >
        {loading === 'github' ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Github className="mr-2 h-4 w-4" />
        )}
        Continue with GitHub
      </Button>
    </div>
  )
}