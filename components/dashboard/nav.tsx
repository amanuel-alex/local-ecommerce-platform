'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, Bell, ShoppingCart, Menu, X, User, Settings, HelpCircle, LogOut } from 'lucide-react'
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
import { createBrowserClient } from '@supabase/ssr'

interface DashboardNavbarProps {
  user: any
}

export default function DashboardNavbar({ user }: DashboardNavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()
  
  // Create browser client for client-side operations
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      router.push('/login')
      router.refresh()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const userRole = user?.role || 'customer'
  const userName = user?.user_metadata?.full_name || user?.email || 'User'
  const userInitial = userName.charAt(0).toUpperCase()

  // Mobile menu items based on user role
  const mobileMenuItems = [
    {
      href: `/${userRole}`,
      label: 'Dashboard',
    },
    ...(userRole === 'customer' ? [
      { href: '/customer/orders', label: 'My Orders' },
      { href: '/customer/wishlist', label: 'Wishlist' },
      { href: '/customer/cart', label: 'Cart' },
      { href: '/customer/profile', label: 'Profile' },
    ] : []),
    ...(userRole === 'seller' ? [
      { href: '/seller/products', label: 'Products' },
      { href: '/seller/orders', label: 'Orders' },
      { href: '/seller/analytics', label: 'Analytics' },
      { href: '/seller/profile', label: 'Profile' },
    ] : []),
    ...(userRole === 'admin' ? [
      { href: '/admin/users', label: 'Users' },
      { href: '/admin/sellers', label: 'Sellers' },
      { href: '/admin/products', label: 'Products' },
      { href: '/admin/profile', label: 'Profile' },
    ] : []),
    // Common links
    { href: '/help', label: 'Help & Support' },
    { href: '#', label: 'Sign Out', onClick: handleSignOut, isButton: true },
  ]

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      const searchPath = userRole === 'customer' 
        ? `/search?q=${encodeURIComponent(searchQuery)}`
        : `/${userRole}/search?q=${encodeURIComponent(searchQuery)}`
      router.push(searchPath)
      setSearchQuery('')
    }
  }

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
          <span className="sr-only">Toggle menu</span>
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
          <form onSubmit={handleSearch} className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products, orders, customers..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Cart - Only show for customers */}
          {userRole === 'customer' && (
            <Button variant="ghost" size="icon" className="relative" asChild>
              <Link href="/customer/cart">
                <ShoppingCart className="h-5 w-5" />
                <Badge 
                  className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
                  variant="destructive"
                >
                  3
                </Badge>
              </Link>
            </Button>
          )}

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
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/${userRole}/notifications`} className="justify-center text-primary">
                  View all notifications
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-medium">
                    {userInitial}
                  </span>
                </div>
                <div className="hidden md:flex flex-col items-start">
                  <span className="text-sm font-medium">
                    {userName}
                  </span>
                  <span className="text-xs text-muted-foreground capitalize">
                    {userRole}
                  </span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/profile`} className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/${userRole}/settings`} className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/help" className="flex items-center gap-2">
                  <HelpCircle className="h-4 w-4" />
                  Help & Support
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-destructive flex items-center gap-2 cursor-pointer"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t">
          <div className="p-4 space-y-1">
            {mobileMenuItems.map((item) => (
              item.isButton ? (
                <button
                  key={item.label}
                  className="flex items-center px-3 py-2 rounded-lg hover:bg-accent transition-colors w-full text-left text-destructive"
                  onClick={() => {
                    item.onClick?.()
                    setMobileMenuOpen(false)
                  }}
                >
                  <span className="font-medium">{item.label}</span>
                </button>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center px-3 py-2 rounded-lg hover:bg-accent transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="font-medium">{item.label}</span>
                </Link>
              )
            ))}
          </div>
        </div>
      )}
    </header>
  )
}