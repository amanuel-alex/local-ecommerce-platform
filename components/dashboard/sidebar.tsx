'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  BarChart3,
  Bell,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  FileText,
  Heart,
  HelpCircle,
  MapPin,
  Package,
  Settings,
  ShoppingBag,
  Store,
  User,
  Users
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface DashboardSidebarProps {
  role: 'admin' | 'seller' | 'customer'
  sidebarOpen: boolean
  onToggle: () => void
}

export default function DashboardSidebar({ 
  role, 
  sidebarOpen, 
  onToggle 
}: DashboardSidebarProps) {
  const pathname = usePathname()

  
  // Customer navigation
  const customerNav = [
    { title: 'My Orders', href: '/customer/orders', icon: ShoppingBag },
    { title: 'Wishlist', href: '/customer/wishlist', icon: Heart },
    { title: 'Campaigns', href: '/customer/campaigns', icon: BarChart3 },
  ]

  // Customer settings
  const customerSettings = [
    { title: 'Profile', href: '/customer/profile', icon: User },
    { title: 'Addresses', href: '/customer/addresses', icon: MapPin },
    { title: 'Payments', href: '/customer/payments', icon: CreditCard },
    { title: 'Settings', href: '/customer/settings', icon: Settings },
  ]

  // Seller navigation
  const sellerNav = [
    { title: 'Store', href: '/seller/store', icon: Store },
    { title: 'Products', href: '/seller/products', icon: Package },
    { title: 'Orders', href: '/seller/orders', icon: ShoppingBag },
    { title: 'Customers', href: '/seller/customers', icon: Users },
    { title: 'Analytics', href: '/seller/analytics', icon: BarChart3 },
  ]

  // Seller settings
  const sellerSettings = [
    { title: 'Store Settings', href: '/seller/settings', icon: Settings },
    { title: 'Notifications', href: '/seller/notifications', icon: Bell },
  ]

  // Admin navigation
  const adminNav = [
    { title: 'Users', href: '/admin/users', icon: Users },
    { title: 'Sellers', href: '/admin/sellers', icon: Store },
    { title: 'Products', href: '/admin/products', icon: Package },
    { title: 'Orders', href: '/admin/orders', icon: ShoppingBag },
    { title: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  ]

  // Admin settings
  const adminSettings = [
    { title: 'System Settings', href: '/admin/settings', icon: Settings },
    { title: 'Logs', href: '/admin/logs', icon: FileText },
    { title: 'Help & Support', href: '/admin/support', icon: HelpCircle },
  ]

  // Get navigation items based on role
  const getNavItems = () => {
    switch (role) {
      case 'admin':
        return [...adminNav]
      case 'seller':
        return [ ...sellerNav]
      case 'customer':
        return [ ...customerNav]
      
    }
  }

  // Get settings items based on role
  const getSettingsItems = () => {
    switch (role) {
      case 'admin':
        return adminSettings
      case 'seller':
        return sellerSettings
      case 'customer':
        return customerSettings
      default:
        return []
    }
  }

  const navItems = getNavItems()
  const settingsItems = getSettingsItems()

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard'
    }
    return pathname.startsWith(href)
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Toggle Button */}
      <div className="p-4 border-b">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="w-full justify-start"
        >
          {sidebarOpen ? (
            <>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Collapse
            </>
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent hover:text-accent-foreground",
                  !sidebarOpen && "justify-center"
                )}
                title={!sidebarOpen ? item.title : undefined}
              >
                <Icon className={cn("h-4 w-4", sidebarOpen && "mr-3")} />
                {sidebarOpen && item.title}
              </Link>
            )
          })}
        </nav>

        {settingsItems.length > 0 && (
          <div className="mt-8 px-3">
            <div className={cn(
              "px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider",
              !sidebarOpen && "text-center"
            )}>
              {sidebarOpen ? "Settings" : "⚙️"}
            </div>
            <nav className="space-y-1 mt-2">
              {settingsItems.map((item) => {
                const Icon = item.icon
                const active = isActive(item.href)
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      active
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-accent hover:text-accent-foreground",
                      !sidebarOpen && "justify-center"
                    )}
                    title={!sidebarOpen ? item.title : undefined}
                  >
                    <Icon className={cn("h-4 w-4", sidebarOpen && "mr-3")} />
                    {sidebarOpen && item.title}
                  </Link>
                )
              })}
            </nav>
          </div>
        )}
      </div>

      {/* Role Badge */}
      <div className="p-4 border-t">
        <div className={cn(
          "flex items-center justify-center",
          !sidebarOpen && "flex-col"
        )}>
          <div className={cn(
            "px-2 py-1 rounded-full text-xs font-medium",
            role === 'admin' && "bg-red-100 text-red-800",
            role === 'seller' && "bg-blue-100 text-blue-800",
            role === 'customer' && "bg-green-100 text-green-800"
          )}>
            {sidebarOpen ? role.toUpperCase() : role.charAt(0).toUpperCase()}
          </div>
          {sidebarOpen && (
            <span className="ml-2 text-sm text-muted-foreground">
              {role === 'admin' && 'Administrator'}
              {role === 'seller' && 'Seller Account'}
              {role === 'customer' && 'Customer Account'}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}