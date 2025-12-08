'use client'

import { useEffect, useState } from 'react'

interface Sparkle {
  id: number
  x: number
  y: number
  size: number
  opacity: number
  duration: number
}

export function SparklesBackground() {
  const [sparkles, setSparkles] = useState<Sparkle[]>([])

  useEffect(() => {
    const newSparkles = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.5 + 0.2,
      duration: Math.random() * 10 + 5
    }))
    setSparkles(newSparkles)
  }, [])

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className="absolute rounded-full bg-gradient-to-r from-primary to-secondary"
          style={{
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
            width: `${sparkle.size}px`,
            height: `${sparkle.size}px`,
            opacity: sparkle.opacity,
            animation: `sparkle ${sparkle.duration}s ease-in-out infinite alternate`
          }}
        />
      ))}
      <style jsx>{`
        @keyframes sparkle {
          0% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.2); }
          100% { opacity: 0.2; transform: scale(1); }
        }
      `}</style>
    </div>
  )
}