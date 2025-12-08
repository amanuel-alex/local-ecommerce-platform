'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Home, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  BarChart,
  Store,
  Bell,
  HelpCircle,
  LogOut
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ThemeSwitcher } from '@/components/theme/theme-switcher'
import { Button } from '@/components/ui/button'

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Products', href: '/dashboard/products', icon: Package },
  { name: 'Orders', href: '/dashboard/orders', icon: ShoppingCart },
  { name: 'Customers', href: '/dashboard/customers', icon: Users },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <nav className="w-64 bg-sidebar border-r min-h-screen p-4 flex flex-col">
      {/* Logo */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <Store className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Local Market
            </h1>
            <p className="text-sm text-muted-foreground">Seller Dashboard</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group",
                    isActive 
                      ? "bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border-l-4 border-primary" 
                      : "hover:bg-accent"
                  )}
                >
                  <Icon className={cn(
                    "w-5 h-5 transition-transform group-hover:scale-110",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )} />
                  <span className={cn(
                    "font-medium",
                    isActive ? "text-primary" : ""
                  )}>
                    {item.name}
                  </span>
                  {isActive && (
                    <div className="ml-auto w-2 h-2 rounded-full bg-primary animate-pulse" />
                  )}
                </Link>
              </li>
            )
          })}
        </ul>

        {/* Quick Stats */}
        <div className="mt-8 p-4 rounded-lg bg-gradient-to-br from-primary/5 to-secondary/5 border">
          <h3 className="font-semibold mb-2">Today&apos;s Stats</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Orders</span>
              <span className="font-semibold text-primary">12</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Revenue</span>
              <span className="font-semibold text-emerald-500">$1,245</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="space-y-4 pt-4 border-t">
        {/* Theme Switcher */}
        <div className="flex items-center justify-between px-2">
          <span className="text-sm text-muted-foreground">Theme</span>
          <ThemeSwitcher />
        </div>

        {/* User Menu */}
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary" />
          <div className="flex-1">
            <p className="text-sm font-medium">John Seller</p>
            <p className="text-xs text-muted-foreground">Premium Seller</p>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </nav>
  )
}