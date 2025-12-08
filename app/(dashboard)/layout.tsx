'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import DashboardNavbar from '@/components/dashboard/nav'
import DashboardSidebar from '@/components/dashboard/sidebar'
import { cn } from '@/lib/utils'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      
      // Get user role
      const { data: userData } = await supabase
        .from('users')
        .select('role, full_name')
        .eq('id', user.id)
        .single()

      if (!userData) {
        router.push('/complete-profile')
        return
      }

      setUser({ 
        ...user, 
        role: userData.role,
        user_metadata: {
          ...user.user_metadata,
          full_name: userData.full_name
        }
      })
    } catch (error) {
      toast.error('Error loading dashboard')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNavbar user={user} />
      <div className="flex">
        {/* Sidebar */}
        <div className={cn(
          "transition-all duration-300 ease-in-out",
          sidebarOpen ? "w-64" : "w-0 md:w-16"
        )}>
          <div className="sticky top-16 h-[calc(100vh-4rem)]">
            <DashboardSidebar 
              role={user?.role} 
              // Pass toggle function if needed
            />
          </div>
        </div>

        {/* Main Content */}
        <main className={cn(
          "flex-1 p-4 md:p-6 transition-all duration-300",
          sidebarOpen ? "ml-0" : "md:ml-16"
        )}>
          {children}
        </main>
      </div>
    </div>
  )
}