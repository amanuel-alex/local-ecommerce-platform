'use client'

import { useTheme } from 'next-themes'
import { motion } from 'framer-motion'
import { Check, Palette } from 'lucide-react'
import { Button } from '@/components/ui/button'
import React from 'react'

const themeColors = [
  { id: 'light', name: 'Light', bg: 'bg-gradient-to-br from-gray-50 to-white', text: 'text-gray-900' },
  { id: 'dark', name: 'Dark', bg: 'bg-gradient-to-br from-gray-900 to-black', text: 'text-white' },
  { id: 'system', name: 'System', bg: 'bg-gradient-to-br from-blue-50 to-indigo-50', text: 'text-gray-900' }
]

export function ThemeShowcase() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const currentTheme = theme === 'system' ? resolvedTheme || 'light' : theme

  return (
    <div className="p-6 rounded-2xl border bg-card">
      <div className="flex items-center gap-3 mb-6">
        <Palette className="w-6 h-6 text-primary" />
        <h3 className="text-xl font-semibold">Choose Your Style</h3>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {themeColors.map((themeColor) => (
          <motion.button
            key={themeColor.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setTheme(themeColor.id)}
            className={`relative aspect-square rounded-xl ${themeColor.bg} ${themeColor.text} p-4 flex flex-col items-center justify-center gap-2 transition-all hover:shadow-lg border-2 ${theme === themeColor.id ? 'border-primary' : 'border-transparent'}`}
          >
            {theme === themeColor.id && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center"
              >
                <Check className="w-3 h-3 text-white" />
              </motion.div>
            )}
            <div className="w-8 h-8 rounded-lg bg-white/20" />
            <span className="text-xs font-medium">{themeColor.name}</span>
          </motion.button>
        ))}
      </div>
      
      <div className="mt-6 pt-6 border-t">
        <p className="text-sm text-muted-foreground mb-3">
          Current theme: <span className="font-semibold">{currentTheme}</span>
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setTheme('system')}
          className="w-full"
        >
          Reset to System Theme
        </Button>
      </div>
    </div>
  )
}