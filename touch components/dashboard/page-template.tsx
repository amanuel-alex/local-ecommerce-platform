'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

interface DashboardPageProps {
  title: string
  description?: string
  children: React.ReactNode
  requireAuth?: boolean
  allowedRoles?: ('admin' | 'seller' | 'customer')[]
}

export default function DashboardPage({
  title,
  description,
  children,
  requireAuth = true,
  allowedRoles = ['admin', 'seller', 'customer']
}: DashboardPageProps) {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [hasAccess, setHasAccess] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    if (requireAuth) {
      checkAccess()
    } else {
      setLoading(false)
      setHasAccess(true)
    }
  }, [])

  const checkAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      // Get user role from database
      const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()

      if (!userData) {
        toast.error('User profile not found')
        router.push('/complete-profile')
        return
      }

      // Check if user has required role
      if (!allowedRoles.includes(userData.role)) {
        toast.error('Access denied')
        router.push('/dashboard')
        return
      }

      setUser({ ...user, role: userData.role })
      setHasAccess(true)
    } catch (error) {
      toast.error('Error checking access')
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!hasAccess) {
    return null
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          {description && (
            <p className="text-muted-foreground mt-2">{description}</p>
          )}
        </div>
      </div>

      {/* Page Content */}
      <div className="bg-card rounded-lg border shadow-sm">
        {children}
      </div>
    </div>
  )
}