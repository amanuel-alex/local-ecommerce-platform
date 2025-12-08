'use client'

import Link from 'next/link'
import { Store, Search, ShoppingCart, Menu } from 'lucide-react'
import { ThemeSwitcher } from '@/components/theme/theme-switcher'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AuthStatus } from '@/components/auth/auth-status'

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo & Mobile Menu */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Store className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text hidden sm:inline-block">
              Local Market
            </span>
          </Link>
        </div>

        {/* Search - Desktop */}
        <div className="hidden md:flex flex-1 max-w-2xl mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search local products, sellers, categories..."
              className="pl-10 w-full"
            />
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-2">
          {/* Search - Mobile */}
          <Button variant="ghost" size="icon" className="md:hidden">
            <Search className="w-5 h-5" />
          </Button>
          
          <ThemeSwitcher />
          
          <Button variant="ghost" size="icon" className="relative">
            <ShoppingCart className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
              3
            </span>
          </Button>
          
          <AuthStatus />
          
          <Button className="ml-2 hidden sm:inline-flex">
            <Link href="/register?account_type=seller">Sell on Local Market</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}