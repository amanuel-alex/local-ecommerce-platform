'use client' // Add this at the top

import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ThemeCardProps {
  children: ReactNode
  className?: string
  hoverEffect?: boolean
  glow?: boolean
}

export function ThemeCard({ children, className, hoverEffect = true, glow = false }: ThemeCardProps) {
  return (
    <motion.div
      whileHover={hoverEffect ? { y: -5 } : undefined}
      className={cn(
        "bg-card text-card-foreground rounded-xl border shadow-sm p-6",
        hoverEffect && "card-hover",
        glow && "relative before:absolute before:inset-0 before:bg-gradient-to-r before:from-primary/20 before:to-secondary/20 before:rounded-xl before:-z-10 before:blur-xl",
        className
      )}
    >
      {children}
    </motion.div>
  )
}