'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight, ShoppingBag, Sparkles, TrendingUp } from 'lucide-react'
import { mockProducts } from '@/lib/mock/products'


export default function HeroSection() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const heroItems = [
    { icon: ShoppingBag, text: 'Local Products' },
    { icon: TrendingUp, text: 'Boost Local Economy' },
    { icon: Sparkles, text: 'Curated Quality' }
  ]

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Theme-aware Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5 dark:from-primary/10 dark:via-background dark:to-secondary/10" />
      
      {/* Animated gradient orbs */}
      <div className="absolute inset-0">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full opacity-20"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + i * 10}%`,
              width: 300 + i * 50,
              height: 300 + i * 50,
              background: `radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)`,
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-20 text-center">
       

        {/* Animated Title */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full glass-effect">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-sm font-medium">Join 10,000+ Local Shoppers</span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6"
        >
          <span className="gradient-text">
            Shop Local,
          </span>
          <br />
          <span className="text-foreground">
            Thrive Together
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10"
        >
          Discover amazing products from local artisans, farmers, and entrepreneurs in your community.
          Every purchase makes a difference!
        </motion.p>

        {/* Interactive Stats */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-wrap justify-center gap-6 mb-12"
        >
          {heroItems.map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-3 px-6 py-3 glass-effect rounded-2xl shadow-lg hover:shadow-xl transition-all"
            >
              <item.icon className="w-6 h-6 text-primary" />
              <span className="font-semibold">{item.text}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Buttons with Animation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Button 
            size="lg" 
            className="group relative overflow-hidden px-8 py-6 text-lg rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 animate-shimmer"
            asChild
          >
            <Link href="/products">
              <span className="relative z-10 flex items-center gap-2">
                Start Shopping
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="px-8 py-6 text-lg rounded-full border-2 hover:border-primary hover:bg-primary/10 group glass-effect"
            asChild
          >
            <Link href="/register">
              <span className="flex items-center gap-2">
                Become a Seller
                <TrendingUp className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </span>
            </Link>
          </Button>
        </motion.div>




{/* Product Preview in Hero */}
<motion.div
  initial={{ opacity: 0, y: 50 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8, delay: 1 }}
  className="mt-20"
>
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
    {mockProducts.slice(0, 4).map((product, index) => (
      <motion.div
        key={product.id}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
        whileHover={{ y: -10 }}
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-3 shadow-lg"
      >
        <div className="aspect-square rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 mb-2" />
        <div className="space-y-1">
          <div className="h-2 bg-gradient-to-r from-primary/20 to-secondary/20 rounded" />
          <div className="h-2 bg-gradient-to-r from-primary/10 to-secondary/10 rounded w-3/4" />
          <div className="h-4 bg-gradient-to-r from-primary to-secondary rounded w-1/2" />
        </div>
      </motion.div>
    ))}
  </div>
  <p className="text-center text-sm text-muted-foreground mt-4">
    Explore {mockProducts.length}+ local products ready for delivery
  </p>
</motion.div>
        {/* Theme Preview */}
       
      </div>
    </div>
  )
}