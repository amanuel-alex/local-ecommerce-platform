'use client'

import { Button } from '@/components/ui/button'
import { FcGoogle } from 'react-icons/fc'
import { FaGithub } from 'react-icons/fa'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'

interface SocialLoginProps {
  onLoginSuccess?: (userId: string) => void
}

export function SocialLogin({ onLoginSuccess }: SocialLoginProps) {
  const supabase = createClient()

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    const toastId = toast.loading(`Connecting with ${provider}...`)
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) throw error
      
      toast.success('Redirecting...', {
        id: toastId,
        description: `Connecting with ${provider}`,
      })
      
    } catch (error: any) {
      toast.error('Login failed', {
        id: toastId,
        description: error.message || 'Something went wrong',
      })
    }
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      <Button
        type="button"
        variant="outline"
        className="h-12 rounded-lg border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
        onClick={() => handleSocialLogin('google')}
      >
        <FcGoogle className="mr-2 h-5 w-5" />
        Google
      </Button>
      <Button
        type="button"
        variant="outline"
        className="h-12 rounded-lg border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
        onClick={() => handleSocialLogin('github')}
      >
        <FaGithub className="mr-2 h-5 w-5" />
        GitHub
      </Button>
    </div>
  )
}