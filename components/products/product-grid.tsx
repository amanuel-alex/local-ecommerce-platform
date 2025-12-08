'use client'

import { ProductCard } from './product-card'
import { Product } from '@/types/product'
import { motion } from 'framer-motion'

interface ProductGridProps {
  products: Product[]
  title?: string
  subtitle?: string
  variant?: 'default' | 'compact'
  columns?: 2 | 3 | 4 | 5
  loading?: boolean
}

export function ProductGrid({ 
  products, 
  title, 
  subtitle, 
  variant = 'default', 
  columns = 4,
  loading = false 
}: ProductGridProps) {
  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 sm:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
    5: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5'
  }

  if (loading) {
    return (
      <div className="space-y-6">
        {title && (
          <div className="text-center space-y-2">
            <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse mx-auto" />
            <div className="h-4 w-64 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mx-auto" />
          </div>
        )}
        <div className={`grid ${gridCols[columns]} gap-4 md:gap-6`}>
          {Array.from({ length: columns * 2 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-square bg-gray-200 dark:bg-gray-800 rounded-xl mb-4" />
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded mb-2" />
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mb-3" />
              <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {(title || subtitle) && (
        <div className="text-center space-y-2">
          {title && (
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-4xl font-bold gradient-text"
            >
              {title}
            </motion.h2>
          )}
          {subtitle && (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>
      )}

      {products.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
            <span className="text-4xl">📦</span>
          </div>
          <h3 className="text-xl font-semibold mb-2">No products found</h3>
          <p className="text-muted-foreground">Check back soon for new items!</p>
        </div>
      ) : (
        <div className={`grid ${gridCols[columns]} gap-4 md:gap-6`}>
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              variant={variant}
              index={index}
            />
          ))}
        </div>
      )}
    </div>
  )
}