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
  HelpCircle,
  Home,
  ShoppingBag
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface DashboardSidebarProps {
  role: 'admin' | 'seller' | 'customer'
}

// Common item for all roles - Main Products Page
const commonNavItems = [
  { href: '/dashboard', label: 'Browse Products', icon: ShoppingBag },
]

const customerNavItems = [
  { href: '/dashboard', label: 'Browse Products', icon: ShoppingBag },
  { href: '/dashboard/customer', label: 'My Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/customer/orders', label: 'My Orders', icon: ShoppingCart },
  { href: '/dashboard/customer/wishlist', label: 'Wishlist', icon: Heart },
  { href: '/dashboard/customer/addresses', label: 'Addresses', icon: Package },
  { href: '/dashboard/customer/payments', label: 'Payments', icon: CreditCard },
  { href: '/dashboard/customer/notifications', label: 'Notifications', icon: Bell },
  { href: '/dashboard/customer/settings', label: 'Settings', icon: Settings },
  { href: '/dashboard/customer/help', label: 'Help Center', icon: HelpCircle },
]

const sellerNavItems = [
  { href: '/dashboard', label: 'Browse Products', icon: ShoppingBag },
  { href: '/dashboard/seller', label: 'Seller Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/seller/products', label: 'My Products', icon: Package },
  { href: '/dashboard/seller/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/dashboard/seller/customers', label: 'Customers', icon: Users },
  { href: '/dashboard/seller/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/dashboard/seller/store', label: 'Store Settings', icon: Store },
  { href: '/dashboard/seller/settings', label: 'Settings', icon: Settings },
]

const adminNavItems = [
  { href: '/dashboard', label: 'Browse Products', icon: ShoppingBag },
  { href: '/dashboard/admin', label: 'Admin Dashboard', icon: LayoutDashboard },
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

  const getNavItems = () => {
    switch (role) {
      case 'admin':
        return adminNavItems
      case 'seller':
        return sellerNavItems
      default:
        return customerNavItems
    }
  }

  const navItems = getNavItems()

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      toast.success('Signed out successfully')
      router.push('/login')
    } catch (error) {
      toast.error('Error signing out')
    }
  }

  // Check if current path is the main dashboard/products page
  const isMainDashboard = pathname === '/dashboard'

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
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <ShoppingBag className="h-5 w-5 text-white" />
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
            
            // Check if this item is active
            let isActive = false
            if (item.href === '/dashboard') {
              // For main dashboard, check exact match
              isActive = pathname === '/dashboard'
            } else {
              // For other pages, check if path starts with the href
              isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            }
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent hover:text-accent-foreground",
                  isActive ? "bg-accent text-accent-foreground font-medium" : "text-muted-foreground",
                  collapsed ? "justify-center" : "justify-start",
                  // Highlight main products page differently
                  item.href === '/dashboard' && "border-l-4 border-primary"
                )}
              >
                <Icon className="h-4 w-4" />
                {!collapsed && (
                  <div className="flex-1 flex items-center justify-between">
                    <span>{item.label}</span>
                    {item.href === '/dashboard' && isMainDashboard && (
                      <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                        Main
                      </span>
                    )}
                  </div>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Quick Actions (Only show when not collapsed) */}
        {!collapsed && (
          <div className="px-4 py-3 border-t">
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Quick Actions</p>
              <div className="grid grid-cols-2 gap-2">
                <Link href="/dashboard">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start h-8 text-xs"
                  >
                    <ShoppingBag className="h-3 w-3 mr-1" />
                    Shop
                  </Button>
                </Link>
                {role === 'seller' && (
                  <Link href="/dashboard/seller/products/new">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start h-8 text-xs"
                    >
                      <Package className="h-3 w-3 mr-1" />
                      Add Product
                    </Button>
                  </Link>
                )}
                {role === 'customer' && (
                  <Link href="/dashboard/customer/orders">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start h-8 text-xs"
                    >
                      <ShoppingCart className="h-3 w-3 mr-1" />
                      My Orders
                    </Button>
                  </Link>
                )}
                {role === 'admin' && (
                  <Link href="/dashboard/admin/users">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start h-8 text-xs"
                    >
                      <Users className="h-3 w-3 mr-1" />
                      Manage Users
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}

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