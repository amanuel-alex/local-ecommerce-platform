'use client'

import { motion } from 'framer-motion'
import { ShoppingBag, Heart, Star, Package } from 'lucide-react'

export function FloatingElements() {
  const elements = [
    { Icon: ShoppingBag, delay: 0, size: 'w-8 h-8' },
    { Icon: Heart, delay: 0.5, size: 'w-10 h-10' },
    { Icon: Star, delay: 1, size: 'w-12 h-12' },
    { Icon: Package, delay: 1.5, size: 'w-8 h-8' }
  ]

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {elements.map((element, i) => (
        <motion.div
          key={i}
          className={`absolute ${element.size} text-primary/20`}
          style={{
            left: `${15 + i * 20}%`,
            top: `${10 + i * 15}%`,
          }}
          animate={{
            y: [0, -30, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 5 + i,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <element.Icon className="w-full h-full" />
        </motion.div>
      ))}
    </div>
  )
}