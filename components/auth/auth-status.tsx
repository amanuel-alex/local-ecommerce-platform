'use client'

import { useUser } from '@/hooks/use-user'
import { Button } from '@/components/ui/button'
import { User, LogOut, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function AuthStatus() {
  const { user, userData, loading } = useUser()
  const supabase = createClient()
  const router = useRouter()

  const handleSignOut = async () => {
    const toastId = toast.loading('Signing out...')
    
    try {
      await supabase.auth.signOut()
      router.refresh()
      toast.success('Signed out', {
        id: toastId,
        description: 'You have been successfully signed out.',
      })
    } catch (error) {
      toast.error('Error', {
        id: toastId,
        description: 'Failed to sign out',
      })
    }
  }

  if (loading) {
    return (
      <Button variant="ghost" size="icon" disabled>
        <Loader2 className="h-4 w-4 animate-spin" />
      </Button>
    )
  }

  if (!user) {
    return (
      <Button asChild>
        <a href="/login">Sign In</a>
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {userData?.full_name || 'User'}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push('/dashboard')}>
          Dashboard
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push('/profile')}>
          Profile
        </DropdownMenuItem>
        {userData?.role === 'seller' && (
          <DropdownMenuItem onClick={() => router.push('/seller/dashboard')}>
            Seller Dashboard
          </DropdownMenuItem>
        )}
        {userData?.role === 'admin' && (
          <DropdownMenuItem onClick={() => router.push('/admin')}>
            Admin Panel
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}