'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Star, Heart, ShoppingCart, Eye, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface Product {
  id: string
  name: string
  description: string
  price: number
  original_price?: number
  discount_percentage?: number
  rating: number
  review_count: number
  image_url: string
  seller_name: string
  seller_avatar?: string
  is_new?: boolean
  is_bestseller?: boolean
  stock_quantity: number
  tags?: string[]
  category: string
}

interface ProductCardProps {
  product: Product
  variant?: 'default' | 'compact' | 'featured'
  index?: number
}

export function ProductCard({ product, variant = 'default', index = 0 }: ProductCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  const discount = product.discount_percentage || 
    (product.original_price ? 
      Math.round(((product.original_price - product.price) / product.original_price) * 100) 
      : 0)

  const isLowStock = product.stock_quantity < 10
  const isOutOfStock = product.stock_quantity === 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -8 }}
      className={cn(
        "group relative bg-card rounded-2xl border overflow-hidden transition-all duration-300 hover:shadow-2xl",
        variant === 'compact' ? 'p-3' : 'p-4',
        isOutOfStock && 'opacity-60'
      )}
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
        {product.is_new && (
          <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white border-0">
            NEW
          </Badge>
        )}
        {product.is_bestseller && (
          <Badge className="bg-amber-500 hover:bg-amber-600 text-white border-0">
            🔥 Best Seller
          </Badge>
        )}
        {discount > 0 && (
          <Badge className="bg-rose-500 hover:bg-rose-600 text-white border-0">
            -{discount}%
          </Badge>
        )}
      </div>

      {/* Wishlist Button */}
      <Button
        size="icon"
        variant="ghost"
        className="absolute top-3 right-3 z-10 bg-white/80 backdrop-blur-sm hover:bg-white"
        onClick={() => setIsLiked(!isLiked)}
      >
        <Heart
          className={cn(
            "w-5 h-5 transition-all",
            isLiked ? "fill-rose-500 text-rose-500" : "text-gray-500"
          )}
        />
      </Button>

      {/* Product Image */}
      <Link href={`/products/${product.id}`} className="block">
        <div className={cn(
          "relative aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 mb-4",
          variant === 'compact' ? 'mb-3' : 'mb-4'
        )}>
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className={cn(
              "object-cover transition-transform duration-500 group-hover:scale-110",
              imageLoaded ? 'opacity-100' : 'opacity-0'
            )}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onLoad={() => setImageLoaded(true)}
          />
          
          {/* Loading Skeleton */}
          {!imageLoaded && (
            <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800" />
          )}

          {/* Quick Actions Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="flex gap-2">
              <Button
                size="icon"
                className="bg-white hover:bg-white/90 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
                title="Quick View"
              >
                <Eye className="w-4 h-4" />
              </Button>
              <Button
                size="icon"
                className="bg-primary hover:bg-primary/90 text-white transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-75"
                disabled={isOutOfStock}
                title="Add to Cart"
              >
                <ShoppingCart className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Stock Indicator */}
          {isLowStock && !isOutOfStock && (
            <div className="absolute bottom-2 left-2">
              <Badge variant="destructive" className="text-xs">
                Only {product.stock_quantity} left
              </Badge>
            </div>
          )}

          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <Badge variant="secondary" className="text-lg py-2 px-4">
                Out of Stock
              </Badge>
            </div>
          )}
        </div>
      </Link>

      {/* Product Info */}
      <div className={cn("space-y-2", variant === 'compact' && 'space-y-1.5')}>
        {/* Seller Info */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-secondary" />
          <span className="text-xs text-muted-foreground truncate">
            {product.seller_name}
          </span>
        </div>

        {/* Product Name */}
        <Link href={`/products/${product.id}`}>
          <h3 className={cn(
            "font-semibold line-clamp-2 hover:text-primary transition-colors",
            variant === 'compact' ? 'text-sm' : 'text-base'
          )}>
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="text-sm font-semibold">{product.rating.toFixed(1)}</span>
          </div>
          <span className="text-xs text-muted-foreground">
            ({product.review_count} reviews)
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-3">
          <div className="flex items-baseline gap-2">
            <span className={cn(
              "font-bold",
              variant === 'compact' ? 'text-lg' : 'text-xl'
            )}>
              ${product.price.toFixed(2)}
            </span>
            {product.original_price && product.original_price > product.price && (
              <>
                <span className="text-sm text-muted-foreground line-through">
                  ${product.original_price.toFixed(2)}
                </span>
                <span className="text-sm font-semibold text-rose-500">
                  Save ${(product.original_price - product.price).toFixed(2)}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Tags */}
        {product.tags && product.tags.length > 0 && variant !== 'compact' && (
          <div className="flex flex-wrap gap-1 pt-2">
            {product.tags.slice(0, 2).map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="text-xs px-2 py-0.5"
              >
                {tag}
              </Badge>
            ))}
            {product.tags.length > 2 && (
              <Badge variant="outline" className="text-xs px-2 py-0.5">
                +{product.tags.length - 2}
              </Badge>
            )}
          </div>
        )}

        {/* Add to Cart Button */}
        {variant !== 'compact' && (
          <Button
            className="w-full mt-4 group/btn"
            disabled={isOutOfStock}
            size={variant === 'featured' ? 'lg' : 'default'}
          >
            <ShoppingCart className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform" />
            {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
          </Button>
        )}
      </div>
    </motion.div>
  )
}