'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Quote, Star, ThumbsUp, Award } from 'lucide-react'
import Image from 'next/image'

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Home Cook & Local Shopper',
    content: 'The quality of products here is incredible! I\'ve found amazing local ingredients that transformed my cooking. Supporting my community has never been this easy and rewarding.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1494790108755-2616b786d4d9?w=200&auto=format&fit=crop',
    purchases: 42
  },
  {
    name: 'Marcus Chen',
    role: 'Artisan Seller',
    content: 'Since joining Local Market, my small pottery business has grown 300%! The platform makes it easy to connect with customers who truly appreciate handmade quality.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop',
    sales: 156
  },
  {
    name: 'Elena Rodriguez',
    role: 'Frequent Buyer',
    content: 'The delivery is lightning fast! I ordered fresh bread in the morning and had it by lunch. The app is so intuitive and the customer service is exceptional.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&auto=format&fit=crop',
    purchases: 87
  }
]

export default function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <section className="py-20 bg-gradient-to-b from-background to-primary/5">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <Award className="w-6 h-6 text-primary" />
            <span className="text-sm font-semibold text-primary">TRUSTED BY THOUSANDS</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Loved by{' '}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Our Community
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            See what our happy customers and sellers are saying about their experience
          </p>
        </motion.div>

        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto"
            >
              <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-3xl shadow-2xl p-8 md:p-12">
                <Quote className="w-12 h-12 text-primary/20 mb-6" />
                
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg">
                      <Image
                        src={testimonials[activeIndex].image}
                        alt={testimonials[activeIndex].name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < testimonials[activeIndex].rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'fill-gray-200 text-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    
                    <p className="text-lg md:text-xl italic text-gray-700 dark:text-gray-300 mb-6">
                      "{testimonials[activeIndex].content}"
                    </p>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-bold text-xl">
                          {testimonials[activeIndex].name}
                        </h4>
                        <p className="text-muted-foreground">
                          {testimonials[activeIndex].role}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">
                            {testimonials[activeIndex].purchases || testimonials[activeIndex].sales}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {testimonials[activeIndex].purchases ? 'Purchases' : 'Sales'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-center gap-4 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === activeIndex
                    ? 'bg-primary w-8'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Social Proof Stats */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: ThumbsUp, value: '98%', label: 'Customer Satisfaction' },
              { icon: Award, value: '4.9/5', label: 'Average Rating' },
              { icon: '🛒', value: '95%', label: 'Repeat Customers' },
              { icon: '⚡', value: '<2h', label: 'Avg. Delivery Time' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="text-center p-6 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-white/20"
              >
                <div className="text-4xl mb-2">
                  {typeof stat.icon === 'string' ? stat.icon : <stat.icon className="w-12 h-12 mx-auto text-primary" />}
                </div>
                <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}