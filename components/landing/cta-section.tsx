'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  ArrowRight, 
  Gift, 
  Sparkles, 
  TrendingUp,
  ShieldCheck,
  Zap,
  Store,
  Leaf,
  Palette,
  Coffee,
  BookOpen,HandCoins
} from 'lucide-react'

export default function CTASection() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setTimeout(() => {
        setEmail('')
        setSubscribed(false)
      }, 3000)
    }
  }

  const benefits = [
    { icon: Gift, text: 'Exclusive Early Access' },
    { icon: TrendingUp, text: 'First Dibs on New Products' },
    { icon: ShieldCheck, text: 'Priority Support' },
    { icon: Zap, text: 'Special Discounts' }
  ]

  const trustBusinesses = [
    { icon: Leaf, name: 'GreenLeaf Organics', color: 'text-green-600 dark:text-green-400' },
    { icon: Palette, name: 'Artisan Studios', color: 'text-purple-600 dark:text-purple-400' },
    { icon: Coffee, name: 'Local Roasters', color: 'text-amber-600 dark:text-amber-400' },
    { icon: HandCoins, name: 'Handmade Crafts', color: 'text-pink-600 dark:text-pink-400' },
    { icon: Store, name: 'Corner Market', color: 'text-blue-600 dark:text-blue-400' },
    { icon: BookOpen, name: 'Book Nook', color: 'text-indigo-600 dark:text-indigo-400' }
  ]

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Animated Background - Light theme friendly */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5 dark:from-primary/10 dark:via-background dark:to-secondary/10" />
      
      {/* Subtle Pattern Overlay */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03] bg-[radial-gradient(circle_at_1px_1px,#000_1px,transparent_0)] bg-[length:40px_40px]" />
      
      {/* Floating Elements - Light theme friendly */}
      <div className="absolute inset-0">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-primary/5 to-secondary/5 dark:from-primary/10 dark:to-secondary/10"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: Math.random() * 60 + 20,
              height: Math.random() * 60 + 20,
            }}
            animate={{
              y: [0, Math.sin(i) * 30, 0],
              x: [0, Math.cos(i) * 20, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          {/* Badge - Better light theme contrast */}
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-2 mb-6 px-6 py-3 rounded-full bg-gradient-to-r from-primary to-secondary shadow-lg shadow-primary/20"
          >
            <Sparkles className="w-5 h-5 text-white" />
            <span className="font-bold text-white text-green-600">LIMITED TIME OFFER</span>
          </motion.div>

          {/* Main Heading */}
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
            Ready to{' '}
            <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Transform
            </span>
            <br />
            Your Shopping Experience?
          </h2>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-muted-foreground/90 dark:text-muted-foreground max-w-3xl mx-auto mb-10">
            Join thousands who are already supporting local businesses and enjoying
            exclusive benefits. Sign up now and get 20% off your first order!
          </p>

          {/* Benefits - Light theme friendly */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-center gap-2 px-4 py-2.5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg border border-gray-200/50 dark:border-gray-700/50 shadow-sm"
              >
                <benefit.icon className="w-4 h-4 text-primary" />
                <span className="font-medium text-gray-800 dark:text-gray-200">{benefit.text}</span>
              </motion.div>
            ))}
          </div>

          {/* CTA Form */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-2xl p-8 shadow-xl dark:shadow-2xl dark:shadow-primary/5 border border-gray-200/50 dark:border-gray-700/50">
              <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
                Get Started in Seconds
              </h3>
              
              {subscribed ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-20 h-20 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 flex items-center justify-center mx-auto mb-6">
                    <Sparkles className="w-10 h-10 text-primary" />
                  </div>
                  <h4 className="text-3xl font-bold mb-2 text-gray-900 dark:text-gray-100">
                    Welcome! 🎉
                  </h4>
                  <p className="text-muted-foreground">
                    Check your email for your exclusive 20% discount code!
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Input
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1 py-6 text-lg rounded-full border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:border-primary focus:ring-primary/20"
                      required
                    />
                    <Button
                      type="submit"
                      size="lg"
                      className="py-6 px-8 text-lg rounded-full bg-gradient-to-r from-primary to-secondary hover:shadow-2xl hover:scale-105 transition-all shadow-lg shadow-primary/20"
                    >
                      <span className="flex items-center gap-2 text-slate-300">
                        Claim 20% Off
                        <ArrowRight className="w-5 h-5" />
                      </span>
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground text-center  text-slate-300">
                    By signing up, you agree to our Terms and Privacy Policy
                  </p>
                </form>
              )}

              {/* Alternative CTAs - Light theme friendly */}
              <div className="mt-8 pt-8 border-t border-gray-200/50 dark:border-gray-700/50">
                <p className="text-sm text-muted-foreground mb-4 text-center  text-slate-300">
                  Or explore other options
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    variant="outline"
                    size="lg"
                    className="flex-1 py-6 rounded-full border-2 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:border-primary hover:text-primary transition-colors"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <Store className="w-5 h-5" />
                      Browse Products
                    </span>
                  </Button>
                  <Button
                    variant="secondary"
                    size="lg"
                    className="flex-1 py-6 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      Become a Seller
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Trust Badges - Light theme friendly */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mt-16"
          >
            <p className="text-sm text-muted-foreground mb-8 tracking-wide uppercase">
              Trusted by leading local businesses
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {trustBusinesses.map((business, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="flex flex-col items-center gap-3 p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-sm hover:shadow-md transition-all"
                >
                  <div className={`p-3 rounded-full bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 ${business.color}`}>
                    <business.icon className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200 text-center">
                    {business.name}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll to Top */}
      <motion.button
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary shadow-lg hover:shadow-2xl flex items-center justify-center z-50 border border-white/20"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Scroll to top"
      >
        <ArrowRight className="w-6 h-6 text-white rotate-270" />
      </motion.button>
    </section>
  )
}