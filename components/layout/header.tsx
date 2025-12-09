'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Store, Search, ShoppingCart, Menu, Sparkles, X } from 'lucide-react'
import { ThemeSwitcher } from '@/components/theme/theme-switcher'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AuthStatus } from '@/components/auth/auth-status'
import { motion, AnimatePresence } from 'framer-motion'

export function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Simulate checking auth status
  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      // Your auth check logic here
      // setIsLoggedIn(await isAuthenticated())
    }
    checkAuth()
  }, [])

  // Handle scroll effect
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
          ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 shadow-sm dark:shadow-2xl dark:shadow-primary/5' 
          : 'bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800'
      }`}>
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo & Mobile Menu */}
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-md">
                  <Store className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  Local Market
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 -mt-1">
                  Your neighborhood, delivered
                </span>
              </div>
            </Link>
          </div>

          {/* Search - Desktop */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
              <Input
                placeholder="Search products, sellers, categories..."
                className="pl-10 w-full h-11 rounded-lg border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary focus:ring-primary/20"
              />
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-2">
            {/* Search - Mobile */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setSearchOpen(!searchOpen)}
            >
              <Search className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </Button>
            
            {/* Theme Switcher */}
            <div className="relative text-slate-200">
              <ThemeSwitcher />
            </div>
            
            {/* Cart - Only show if logged in */}
            {isLoggedIn && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                asChild
              >
                <Link href="/cart">
                  <ShoppingCart className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center font-medium">
                    3
                  </span>
                </Link>
              </Button>
            )}
            
            {/* User Profile/Auth */}
            <div className="ml-1 text-slate-200">
              <AuthStatus />
            </div>
            
           
          </div>
        </div>

        {/* Mobile Search - Animated */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-200 dark:border-gray-800"
            >
              <div className="container mx-auto px-4 py-3">
                <div className="relative flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                    <Input
                      placeholder="Search local products..."
                      className="pl-10 w-full h-10 rounded-lg"
                      autoFocus
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSearchOpen(false)}
                    className="rounded-lg"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile Menu Overlay */}
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
              className="fixed left-0 top-0 h-full w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-50 md:hidden shadow-xl"
            >
              <div className="p-5">
                {/* Menu Header */}
                <div className="flex items-center justify-between mb-6 ">
                  <Link href="/" className="flex items-center gap-3" onClick={() => setMobileMenuOpen(false)}>
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                      <Store className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 dark:text-white">Local Market</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Menu</div>
                    </div>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {/* User Info if logged in */}
                {isLoggedIn && (
                  <div className="mb-6 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                        <span className="text-white font-medium">JD</span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">John Doe</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Premium Member</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Links */}
                <nav className="space-y-1">
                  {[
                    { label: 'Home', href: '/', icon: '🏠' },
                    { label: 'Categories', href: '/categories', icon: '📦' },
                    { label: 'Trending', href: '/trending', icon: '🔥' },
                    { label: 'Sellers Near You', href: '/sellers', icon: '📍' },
                    { label: 'My Orders', href: '/orders', icon: '📋' },
                    { label: 'Wishlist', href: '/wishlist', icon: '❤️' },
                    { label: 'Settings', href: '/settings', icon: '⚙️' },
                  ].map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="text-lg">{item.icon}</span>
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  ))}
                </nav>

                {/* Divider */}
                <div className="my-6 border-t border-gray-200 dark:border-gray-800" />

                {/* Bottom Section */}
                <div className="space-y-3">
                  <Button 
                    className="w-full rounded-lg bg-primary hover:bg-primary/90 text-white"
                    size="lg"
                    asChild
                  >
                    <Link href="/register?account_type=seller">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Become a Seller
                    </Link>
                  </Button>
                  
                  <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Theme</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Switch appearance</div>
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