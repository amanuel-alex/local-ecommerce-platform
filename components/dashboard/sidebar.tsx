'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  Store,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  User,
  CreditCard,
  Heart,
  Bell,
  HelpCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface DashboardSidebarProps {
  role: 'admin' | 'seller' | 'customer'
}

const customerNavItems = [
  { href: '/dashboard/customer', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/customer/orders', label: 'My Orders', icon: ShoppingCart },
  { href: '/dashboard/customer/wishlist', label: 'Wishlist', icon: Heart },
  { href: '/dashboard/customer/addresses', label: 'Addresses', icon: Package },
  { href: '/dashboard/customer/payments', label: 'Payments', icon: CreditCard },
  { href: '/dashboard/customer/notifications', label: 'Notifications', icon: Bell },
  { href: '/dashboard/customer/settings', label: 'Settings', icon: Settings },
  { href: '/dashboard/customer/help', label: 'Help Center', icon: HelpCircle },
]

const sellerNavItems = [
  { href: '/dashboard/seller', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/seller/products', label: 'Products', icon: Package },
  { href: '/dashboard/seller/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/dashboard/seller/customers', label: 'Customers', icon: Users },
  { href: '/dashboard/seller/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/dashboard/seller/store', label: 'Store Settings', icon: Store },
  { href: '/dashboard/seller/settings', label: 'Settings', icon: Settings },
]

const adminNavItems = [
  { href: '/dashboard/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/admin/users', label: 'Users', icon: Users },
  { href: '/dashboard/admin/sellers', label: 'Sellers', icon: Store },
  { href: '/dashboard/admin/products', label: 'Products', icon: Package },
  { href: '/dashboard/admin/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/dashboard/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/dashboard/admin/settings', label: 'Settings', icon: Settings },
]

export default function DashboardSidebar({ role }: DashboardSidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const navItems = role === 'admin' 
    ? adminNavItems 
    : role === 'seller' 
    ? sellerNavItems 
    : customerNavItems

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      toast.success('Signed out successfully')
      router.push('/login')
    } catch (error) {
      toast.error('Error signing out')
    }
  }

  return (
    <aside className={cn(
      "sticky top-0 h-screen border-r bg-background transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className={cn(
          "flex items-center border-b p-4",
          collapsed ? "justify-center" : "justify-between"
        )}>
          {!collapsed && (
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Store className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl">MarketHub</span>
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="ml-auto"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || 
              (item.href !== '/dashboard' && pathname.startsWith(item.href))
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent hover:text-accent-foreground",
                  isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                  collapsed ? "justify-center" : "justify-start"
                )}
              >
                <Icon className="h-4 w-4" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* User Profile & Logout */}
        <div className="border-t p-4">
          <div className={cn(
            "flex items-center gap-3",
            collapsed ? "justify-center" : "justify-start"
          )}>
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-4 w-4 text-primary" />
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">User Profile</p>
                <p className="text-xs text-muted-foreground capitalize">{role}</p>
              </div>
            )}
          </div>
          
          <Button
            variant="ghost"
            size={collapsed ? "icon" : "default"}
            onClick={handleSignOut}
            className={cn(
              "mt-4 w-full",
              collapsed ? "justify-center" : "justify-start"
            )}
          >
            <LogOut className="h-4 w-4" />
            {!collapsed && <span className="ml-2">Sign Out</span>}
          </Button>
        </div>
      </div>
    </aside>
  )
}