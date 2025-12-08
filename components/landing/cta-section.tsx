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
  Zap
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

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
      
      {/* Floating Elements */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-primary/10 to-secondary/10"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: Math.random() * 80 + 20,
              height: Math.random() * 80 + 20,
            }}
            animate={{
              y: [0, Math.sin(i) * 40, 0],
              x: [0, Math.cos(i) * 30, 0],
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
          {/* Badge */}
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-2 mb-6 px-6 py-3 rounded-full bg-gradient-to-r from-primary to-secondary"
          >
            <Sparkles className="w-5 h-5 text-white" />
            <span className="font-bold text-white">LIMITED TIME OFFER</span>
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
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10">
            Join thousands who are already supporting local businesses and enjoying
            exclusive benefits. Sign up now and get 20% off your first order!
          </p>

          {/* Benefits */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full"
              >
                <benefit.icon className="w-4 h-4 text-primary" />
                <span className="font-medium">{benefit.text}</span>
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
            <div className="bg-gradient-to-br from-white to-gray-50 dark:from-white-900 dark:to-gray-800 rounded-2xl p-8 shadow-2xl">
              <h3 className="text-2xl font-bold mb-6">Get Started in Seconds</h3>
              
              {subscribed ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <Sparkles className="w-16 h-16 text-primary mx-auto mb-4" />
                  <h4 className="text-3xl font-bold mb-2">Welcome! 🎉</h4>
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
                      className="flex-1 py-6 text-lg rounded-full border-2"
                      required
                    />
                    <Button
                      type="submit"
                      size="lg"
                      className="py-6 px-8 text-lg rounded-full bg-gradient-to-r from-primary to-secondary hover:shadow-2xl hover:scale-105 transition-all"
                    >
                      <span className="flex items-center gap-2">
                        Claim 20% Off
                        <ArrowRight className="w-5 h-5" />
                      </span>
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground text-center">
                    By signing up, you agree to our Terms and Privacy Policy
                  </p>
                </form>
              )}

              {/* Alternative CTAs */}
              <div className="mt-8 pt-8 border-t">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    variant="outline"
                    size="lg"
                    className="flex-1 py-6 rounded-full border-2"
                  >
                    Browse Products
                  </Button>
                  <Button
                    variant="secondary"
                    size="lg"
                    className="flex-1 py-6 rounded-full"
                  >
                    Become a Seller
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mt-12"
          >
            <p className="text-sm text-muted-foreground mb-4">
              Trusted by leading local businesses
            </p>
            <div className="flex flex-wrap justify-center gap-8 opacity-70">
              {['🌿', '🎨', '🍞', '☕', '🧵', '📚'].map((emoji, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  className="text-3xl"
                >
                  {emoji}
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
        className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary shadow-lg hover:shadow-2xl flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <ArrowRight className="w-6 h-6 text-white rotate-270" />
      </motion.button>
    </section>
  )
}