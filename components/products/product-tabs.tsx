'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ProductGrid } from './product-grid'
import { Product } from '@/types/product'
import { Zap, TrendingUp, Clock, Star } from 'lucide-react'

interface ProductTabsProps {
  recentProducts: Product[]
  topSellingProducts: Product[]
  trendingProducts: Product[]
  featuredProducts: Product[]
}

const tabs = [
  { id: 'recent', label: 'Recently Added', icon: Clock, color: 'text-blue-500' },
  { id: 'top', label: 'Top Selling', icon: TrendingUp, color: 'text-emerald-500' },
  { id: 'trending', label: 'Trending Now', icon: Zap, color: 'text-rose-500' },
  { id: 'featured', label: 'Featured', icon: Star, color: 'text-amber-500' },
]

export function ProductTabs({ 
  recentProducts, 
  topSellingProducts, 
  trendingProducts,
  featuredProducts 
}: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState('recent')

  const getActiveProducts = () => {
    switch (activeTab) {
      case 'recent': return recentProducts
      case 'top': return topSellingProducts
      case 'trending': return trendingProducts
      case 'featured': return featuredProducts
      default: return recentProducts
    }
  }

  const getActiveTitle = () => {
    switch (activeTab) {
      case 'recent': return 'Fresh from Local Sellers'
      case 'top': return 'Community Favorites'
      case 'trending': return 'Trending in Your Area'
      case 'featured': return 'Editor\'s Picks'
      default: return 'Products'
    }
  }

  const getActiveSubtitle = () => {
    switch (activeTab) {
      case 'recent': return 'Discover the latest products added by local sellers'
      case 'top': return 'Best-selling products loved by our community'
      case 'trending': return 'Products gaining popularity right now'
      case 'featured': return 'Handpicked selections from our team'
      default: return ''
    }
  }

  return (
    <div className="space-y-8">
      {/* Tab Navigation */}
      <div className="relative">
        <div className="flex flex-wrap justify-center gap-2 md:gap-4">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`
                  flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-300
                  ${isActive 
                    ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg' 
                    : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }
                `}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : tab.color}`} />
                <span>{tab.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/20 to-secondary/20 -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Active Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <ProductGrid
          products={getActiveProducts()}
          title={getActiveTitle()}
          subtitle={getActiveSubtitle()}
          columns={4}
        />
      </motion.div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 p-4 rounded-xl text-center">
          <div className="text-2xl font-bold text-blue-600">{recentProducts.length}+</div>
          <div className="text-sm text-muted-foreground">New Today</div>
        </div>
        <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 p-4 rounded-xl text-center">
          <div className="text-2xl font-bold text-emerald-600">500+</div>
          <div className="text-sm text-muted-foreground">Sold This Week</div>
        </div>
        <div className="bg-gradient-to-br from-rose-500/10 to-rose-600/10 p-4 rounded-xl text-center">
          <div className="text-2xl font-bold text-rose-600">99%</div>
          <div className="text-sm text-muted-foreground">Positive Reviews</div>
        </div>
        <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/10 p-4 rounded-xl text-center">
          <div className="text-2xl font-bold text-amber-600">2h</div>
          <div className="text-sm text-muted-foreground">Avg. Delivery</div>
        </div>
      </div>
    </div>
  )
}