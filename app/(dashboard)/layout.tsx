'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, usePathname } from 'next/navigation'
import { toast } from 'sonner'
import DashboardNavbar from '@/components/dashboard/nav'
import DashboardSidebar from '@/components/dashboard/sidebar'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Store, ShoppingCart, Home } from 'lucide-react'
import Link from 'next/link'

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
  const pathname = usePathname()

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

  // Check if we're on the main dashboard page
  const isMainDashboard = pathname === '/dashboard'

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
            />
          </div>
        </div>

        {/* Main Content */}
        <main className={cn(
          "flex-1 p-4 md:p-6 transition-all duration-300",
          sidebarOpen ? "ml-0" : "md:ml-16"
        )}>
          {/* Quick Navigation Bar (only show if not on main dashboard) */}
          {!isMainDashboard && (
            <div className="mb-6 p-3 bg-muted rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm">
                    <Home className="h-4 w-4 mr-2" />
                    Browse Products
                  </Button>
                </Link>
                {user?.role === 'seller' && (
                  <Link href="/dashboard/seller/products">
                    <Button variant="ghost" size="sm">
                      <Store className="h-4 w-4 mr-2" />
                      My Products
                    </Button>
                  </Link>
                )}
                {user?.role === 'customer' && (
                  <Link href="/dashboard/customer/orders">
                    <Button variant="ghost" size="sm">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      My Orders
                    </Button>
                  </Link>
                )}
                {user?.role === 'admin' && (
                  <Link href="/dashboard/admin/users">
                    <Button variant="ghost" size="sm">
                      <Store className="h-4 w-4 mr-2" />
                      Manage Users
                    </Button>
                  </Link>
                )}
              </div>
              {/* Removed the filteredProducts line that was causing the error */}
              {isMainDashboard && (
                <div className="text-sm text-muted-foreground">
                  {/* Product count will be shown in the page component, not here */}
                  Marketplace
                </div>
              )}
            </div>
          )}
          
          {children}
        </main>
      </div>
    </div>
  )
}