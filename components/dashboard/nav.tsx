'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, Bell, ShoppingCart, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'

interface DashboardNavbarProps {
  user: any
}

export default function DashboardNavbar({ user }: DashboardNavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-4 md:px-6">
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden mr-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 mr-6">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <ShoppingCart className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-xl hidden md:inline-block">MarketHub</span>
        </Link>

        {/* Search Bar */}
        <div className="flex-1 mx-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products, orders, customers..."
              className="pl-10"
            />
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Cart */}
          <Button variant="ghost" size="icon" className="relative">
            <ShoppingCart className="h-5 w-5" />
            <Badge 
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
              variant="destructive"
            >
              3
            </Badge>
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <Badge 
                  className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
                  variant="destructive"
                >
                  5
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <div className="flex flex-col">
                  <span className="font-medium">New order received</span>
                  <span className="text-sm text-muted-foreground">Order #12345 just came in</span>
                  <span className="text-xs text-muted-foreground">2 minutes ago</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <div className="flex flex-col">
                  <span className="font-medium">Payment received</span>
                  <span className="text-sm text-muted-foreground">$125.00 from John Doe</span>
                  <span className="text-xs text-muted-foreground">1 hour ago</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <div className="flex flex-col">
                  <span className="font-medium">New customer registered</span>
                  <span className="text-sm text-muted-foreground">Jane Smith joined the platform</span>
                  <span className="text-xs text-muted-foreground">3 hours ago</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="justify-center text-primary">
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-medium">
                    {user?.user_metadata?.full_name?.[0] || 'U'}
                  </span>
                </div>
                <div className="hidden md:flex flex-col items-start">
                  <span className="text-sm font-medium">
                    {user?.user_metadata?.full_name || 'User'}
                  </span>
                  <span className="text-xs text-muted-foreground capitalize">
                    {user?.role || 'customer'}
                  </span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/${user?.role || 'customer'}/profile`}>
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/${user?.role || 'customer'}/settings`}>
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/help">
                  Help & Support
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t">
          <div className="p-4 space-y-2">
            <Link
              href={`/dashboard/${user?.role || 'customer'}`}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-accent"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span>Dashboard</span>
            </Link>
            {user?.role === 'customer' && (
              <>
                <Link
                  href="/dashboard/customer/orders"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-accent"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>My Orders</span>
                </Link>
                <Link
                  href="/dashboard/customer/wishlist"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-accent"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>Wishlist</span>
                </Link>
              </>
            )}
            {user?.role === 'seller' && (
              <>
                <Link
                  href="/dashboard/seller/products"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-accent"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>Products</span>
                </Link>
                <Link
                  href="/dashboard/seller/orders"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-accent"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>Orders</span>
                </Link>
              </>
            )}
            {user?.role === 'admin' && (
              <>
                <Link
                  href="/dashboard/admin/users"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-accent"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>Users</span>
                </Link>
                <Link
                  href="/dashboard/admin/sellers"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-accent"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>Sellers</span>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}