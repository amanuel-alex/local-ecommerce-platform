'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight, ShoppingBag, Sparkles, TrendingUp } from 'lucide-react'

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
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
      
      {/* Floating Elements */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-primary/10 to-secondary/10"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: Math.random() * 100 + 50,
              height: Math.random() * 100 + 50,
            }}
            animate={{
              y: [0, Math.sin(i) * 30, 0],
              x: [0, Math.cos(i) * 20, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 10 + i,
              repeat: Infinity,
              ease: "linear"
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
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20">
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
          <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
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
              className="flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all"
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
            className="group relative overflow-hidden px-8 py-6 text-lg rounded-full bg-gradient-to-r from-primary to-secondary hover:shadow-2xl hover:scale-105 transition-all duration-300"
            asChild
          >
            <Link href="/products">
              <span className="relative z-10 flex items-center gap-2">
                Start Shopping
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-secondary to-primary"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.6 }}
              />
            </Link>
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="px-8 py-6 text-lg rounded-full border-2 hover:border-primary hover:bg-primary/10 group"
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

        {/* Interactive Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm text-muted-foreground animate-pulse">Scroll to explore</span>
            <div className="w-6 h-10 border-2 border-primary/30 rounded-full flex justify-center">
              <motion.div
                className="w-1 h-3 bg-primary rounded-full mt-2"
                animate={{ y: [0, 12, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}