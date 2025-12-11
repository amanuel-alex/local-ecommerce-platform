'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, usePathname } from 'next/navigation'
import { toast } from 'sonner'
import DashboardNavbar from '@/components/dashboard/nav'
import DashboardSidebar from '@/components/dashboard/sidebar'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Store, ShoppingCart, Home, Users, Settings } from 'lucide-react'
import Link from 'next/link'

interface DashboardLayoutProps {
  children: React.ReactNode
  role: 'admin' | 'seller' | 'customer'
  user: any
}

export default function DashboardLayout({ 
  children, 
  role,
  user 
}: DashboardLayoutProps) {
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
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser) {
        router.push('/login') // Changed from '/auth/login' to '/login'
        return
      }
      
      // Verify user role matches the layout role
      const { data: userData, error } = await supabase
        .from('users')
        .select('role, full_name')
        .eq('id', authUser.id)
        .single()

      if (error) {
        console.error('Error fetching user data:', error)
        router.push('/complete-profile')
        return
      }

      if (!userData) {
        router.push('/complete-profile')
        return
      }

      // Check if user has access to this dashboard
      if (userData.role !== role) {
        toast.error('You do not have access to this dashboard')
        // Redirect to correct dashboard
        switch (userData.role) {
          case 'admin':
            router.push('/admin')
            break
          case 'seller':
            router.push('/seller')
            break
          case 'customer':
            router.push('/customer')
            break
          default:
            router.push('/')
        }
        return
      }

      // User is authenticated and has correct role
    } catch (error) {
      console.error('Error loading dashboard:', error)
      toast.error('Error loading dashboard')
      router.push('/login')
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

  // Get quick navigation links based on role
  const getQuickNavLinks = () => {
    const baseLinks = [
      {
        href: '/product-show',
        label: 'Browse Products',
        icon: Home,
        variant: 'ghost' as const
      }
    ]

    if (role === 'seller') {
      return [
        ...baseLinks,
        {
          href: '/seller/products', // Fixed: Added leading slash
          label: 'My Products',
          icon: Store,
          variant: 'ghost' as const
        },
        {
          href: '/seller/orders',
          label: 'Orders',
          icon: ShoppingCart,
          variant: 'ghost' as const
        },
        {
          href: '/seller/settings',
          label: 'Store Settings',
          icon: Settings,
          variant: 'ghost' as const
        }
      ]
    }

    if (role === 'admin') {
      return [
        ...baseLinks,
        {
          href: '/admin/users',
          label: 'Users',
          icon: Users,
          variant: 'ghost' as const
        },
        {
          href: '/admin/sellers',
          label: 'Sellers',
          icon: Store,
          variant: 'ghost' as const
        },
        {
          href: '/admin/settings',
          label: 'Settings',
          icon: Settings,
          variant: 'ghost' as const
        }
      ]
    }

    // Customer
    return [
      ...baseLinks,
      {
        href: '/customer/orders',
        label: 'My Orders',
        icon: ShoppingCart,
        variant: 'ghost' as const
      },
      {
        href: '/customer/wishlist',
        label: 'Wishlist',
        icon: Store,
        variant: 'ghost' as const
      }
    ]
  }

  const quickNavLinks = getQuickNavLinks()
  const isMainDashboard = pathname === '/product-show'

  return (
    <div className="min-h-screen bg-background">
      <DashboardNavbar user={user} />
      <div className="flex">
        {/* Sidebar */}
        <div className={cn(
          "transition-all duration-300 ease-in-out border-r",
          sidebarOpen ? "w-64" : "w-0 md:w-16"
        )}>
          <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
            <DashboardSidebar 
              role={role}
              sidebarOpen={sidebarOpen}
              onToggle={toggleSidebar}
            />
          </div>
        </div>

        {/* Main Content */}
        <main className={cn(
          "flex-1 p-4 md:p-6 transition-all duration-300",
          sidebarOpen ? "ml-0" : "md:ml-16"
        )}>
          {/* Quick Navigation Bar */}
          {!isMainDashboard && (
            <div className="mb-6 p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 flex-wrap">
                {quickNavLinks.map((link) => {
                  const Icon = link.icon
                  const isActive = pathname === link.href || pathname.startsWith(link.href)
                  
                  return (
                    <Link key={link.href} href={link.href}>
                      <Button 
                        variant={isActive ? "secondary" : "ghost"}
                        size="sm"
                        className="gap-2"
                      >
                        <Icon className="h-4 w-4" />
                        {link.label}
                      </Button>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}
          
          {children}
        </main>
      </div>
    </div>
  )
}