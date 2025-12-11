'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { 
  Home, 
  ShoppingBag, 
  Heart, 
  Settings, 
  User,
  Store, 
  Package, 
  BarChart3, 
  Users,
  Shield,
  CreditCard,
  MapPin,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  FileText,
  Bell,
  HelpCircle
} from 'lucide-react'

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

  // Common navigation items
  const commonNav = [
    { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  ]

  // Customer navigation
  const customerNav = [
    { title: 'My Orders', href: '/dashboard/customer/orders', icon: ShoppingBag },
    { title: 'Wishlist', href: '/dashboard/customer/wishlist', icon: Heart },
    { title: 'Campaigns', href: '/dashboard/customer/campaigns', icon: BarChart3 },
  ]

  // Customer settings
  const customerSettings = [
    { title: 'Profile', href: '/dashboard/customer/profile', icon: User },
    { title: 'Addresses', href: '/dashboard/customer/addresses', icon: MapPin },
    { title: 'Payments', href: '/dashboard/customer/payments', icon: CreditCard },
    { title: 'Settings', href: '/dashboard/customer/settings', icon: Settings },
  ]

  // Seller navigation
  const sellerNav = [
    { title: 'Store', href: '/dashboard/seller/store', icon: Store },
    { title: 'Products', href: '/dashboard/seller/products', icon: Package },
    { title: 'Orders', href: '/dashboard/seller/orders', icon: ShoppingBag },
    { title: 'Customers', href: '/dashboard/seller/customers', icon: Users },
    { title: 'Analytics', href: '/dashboard/seller/analytics', icon: BarChart3 },
  ]

  // Seller settings
  const sellerSettings = [
    { title: 'Store Settings', href: '/dashboard/seller/settings', icon: Settings },
    { title: 'Notifications', href: '/dashboard/seller/notifications', icon: Bell },
  ]

  // Admin navigation
  const adminNav = [
    { title: 'Users', href: '/dashboard/admin/users', icon: Users },
    { title: 'Sellers', href: '/dashboard/admin/sellers', icon: Store },
    { title: 'Products', href: '/dashboard/admin/products', icon: Package },
    { title: 'Orders', href: '/dashboard/admin/orders', icon: ShoppingBag },
    { title: 'Analytics', href: '/dashboard/admin/analytics', icon: BarChart3 },
  ]

  // Admin settings
  const adminSettings = [
    { title: 'System Settings', href: '/dashboard/admin/settings', icon: Settings },
    { title: 'Logs', href: '/dashboard/admin/logs', icon: FileText },
    { title: 'Help & Support', href: '/dashboard/admin/support', icon: HelpCircle },
  ]

  // Get navigation items based on role
  const getNavItems = () => {
    switch (role) {
      case 'admin':
        return [...commonNav, ...adminNav]
      case 'seller':
        return [...commonNav, ...sellerNav]
      case 'customer':
        return [...commonNav, ...customerNav]
      default:
        return commonNav
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