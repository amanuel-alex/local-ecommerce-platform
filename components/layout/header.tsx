'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Store, Search, ShoppingCart, Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { ThemeSwitcher } from '@/components/theme/theme-switcher'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled 
          ? 'bg-background/95 backdrop-blur-xl border-b' 
          : 'bg-background border-b'
      }`}>
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Left side - Logo & Menu */}
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <Store className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold">Local Market</span>
                <span className="text-xs text-muted-foreground -mt-1">
                  Your neighborhood, delivered
                </span>
              </div>
            </Link>
          </div>

          {/* Center - Search (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                className="pl-10 w-full"
              />
            </div>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center gap-2">
            {/* Mobile Search */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={() => setSearchOpen(!searchOpen)}
            >
              <Search className="w-5 h-5" />
            </Button>
            
            {/* Theme Switcher */}
            <ThemeSwitcher />
            
            {/* Cart */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative"
              asChild
            >
              <Link href="/cart">
                <ShoppingCart className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                  3
                </span>
              </Link>
            </Button>
            
            {/* Sign In */}
            <Button variant="outline" size="sm" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t"
            >
              <div className="container mx-auto px-4 py-3">
                <div className="relative flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search..."
                      className="pl-10 w-full"
                      autoFocus
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSearchOpen(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.2 }}
              className="fixed left-0 top-0 h-full w-80 bg-background border-r z-50 md:hidden"
            >
              <div className="p-5">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
                      <Store className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <div className="font-bold">Local Market</div>
                      <div className="text-xs text-muted-foreground">Menu</div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                <nav className="space-y-1">
                  {['Home', 'Categories', 'Trending', 'Orders', 'Wishlist', 'Settings'].map((item) => (
                    <Button
                      key={item}
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item}
                    </Button>
                  ))}
                </nav>

                <div className="mt-6 pt-6 border-t">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                    <div>
                      <div className="font-medium">Theme</div>
                      <div className="text-xs text-muted-foreground">Switch appearance</div>
                    </div>
                    <ThemeSwitcher />
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}