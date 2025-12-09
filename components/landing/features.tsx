'use client'

import { motion } from 'framer-motion'
import { 
  Shield, 
  Truck, 
  Heart, 
  Zap, 
  Users, 
  Award,
  Clock,
  DollarSign
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const features = [
  {
    icon: Shield,
    title: 'Secure Payments',
    description: 'Bank-level security for all transactions',
    color: 'from-blue-300 to-cyan-500'
  },
  {
    icon: Truck,
    title: 'Fast Delivery',
    description: 'Get local products delivered in hours',
    color: 'from-green-500 to-emerald-500'
  },
  {
    icon: Heart,
    title: 'Support Local',
    description: 'Every purchase boosts your local economy',
    color: 'from-pink-500 to-rose-500'
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Instant search and smooth checkout',
    color: 'from-yellow-500 to-orange-500'
  },
  {
    icon: Users,
    title: 'Community First',
    description: 'Connect with sellers in your area',
    color: 'from-purple-500 to-violet-500'
  },
  {
    icon: Award,
    title: 'Quality Verified',
    description: 'All products meet our quality standards',
    color: 'from-indigo-500 to-blue-500'
  },
  {
    icon: Clock,
    title: '24/7 Support',
    description: 'Round-the-clock customer service',
    color: 'from-red-500 to-pink-500'
  },
  {
    icon: DollarSign,
    title: 'Best Prices',
    description: 'Direct from producers, no middlemen',
    color: 'from-emerald-500 to-green-500'
  }
]

export default function FeaturesSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-secondary/5">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Why Choose{' '}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Local Market
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We&apos;re revolutionizing local commerce with cutting-edge features
            designed for modern shoppers and sellers
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
  {features.map((feature, index) => (
    <motion.div
      key={index}
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ y: -10, scale: 1.05 }}
    >
      <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
        
        <CardContent className="p-8 text-center">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
            className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.color} mb-6`}
          >
            <feature.icon className="w-8 h-8 text-white" />
          </motion.div>
          
          <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-gray-100">
            {feature.title}
          </h3>
          <p className="text-gray-700 dark:text-gray-300">
            {feature.description}
          </p>
          
          <motion.div
            className="mt-6 h-1 w-0 group-hover:w-full bg-gradient-to-r from-transparent via-primary to-transparent transition-all duration-500"
            initial={false}
          />
        </CardContent>
      </Card>
    </motion.div>
  ))}
</div>

        {/* Interactive Stats Counter */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-20 p-8 rounded-3xl bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 backdrop-blur-sm border border-white/20"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Happy Customers', value: '50K+', suffix: '👥' },
              { label: 'Local Sellers', value: '2K+', suffix: '🏪' },
              { label: 'Products Sold', value: '500K+', suffix: '🛍️' },
              { label: 'Cities Covered', value: '100+', suffix: '📍' }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-lg font-semibold">{stat.label}</div>
                <div className="text-2xl">{stat.suffix}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}