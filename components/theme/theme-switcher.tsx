'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Check,
  Moon,
  Sun
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

const themes = [
  { id: 'light', name: 'Light', icon: Sun, color: 'bg-slate-200' },
  { id: 'dark', name: 'Dark', icon: Moon, color: 'bg-gray-900' },
  
]

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" disabled>
        <Sun className="h-5 w-5" />
      </Button>
    )
  }

  const currentTheme = themes.find(t => t.id === theme) || themes[0]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative hover:scale-110 transition-transform"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full animate-pulse" />
          <currentTheme.icon className="h-5 w-5 relative z-10" />
          <span className="sr-only">Switch theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
          Theme
        </div>
        {themes.map((themeOption) => (
          <DropdownMenuItem
            key={themeOption.id}
            onClick={() => setTheme(themeOption.id)}
            className="flex items-center justify-between cursor-pointer hover:bg-accent"
          >
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${themeOption.color}`} />
              <span>{themeOption.name}</span>
            </div>
            {theme === themeOption.id && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}