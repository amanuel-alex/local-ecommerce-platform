'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Star, 
  ShoppingCart, 
  Heart, 
  Eye,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'

const featuredProducts = [
  {
    id: 1,
    name: 'Artisan Handcrafted Ceramic Mug',
    price: 24.99,
    originalPrice: 34.99,
    rating: 4.8,
    reviews: 128,
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&auto=format&fit=crop',
    tags: ['Handmade', 'Local Artisan', 'Eco-Friendly'],
    seller: 'Ceramics by Maria'
  },
  {
    id: 2,
    name: 'Organic Farm Fresh Honey',
    price: 15.99,
    originalPrice: 19.99,
    rating: 4.9,
    reviews: 89,
    image: 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?w-800&auto=format&fit=crop',
    tags: ['Organic', 'Farm Fresh', 'Sustainable'],
    seller: 'Green Valley Farms'
  },
  {
    id: 3,
    name: 'Handwoven Cotton Scarf',
    price: 32.50,
    originalPrice: 45.00,
    rating: 4.7,
    reviews: 64,
    image: 'https://images.unsplash.com/photo-1551854716-5c7c5d5c9b4b?w=800&auto=format&fit=crop',
    tags: ['Handwoven', 'Natural Dye', 'Fair Trade'],
    seller: 'Weave Collective'
  },
  {
    id: 4,
    name: 'Wooden Cutting Board Set',
    price: 49.99,
    originalPrice: 69.99,
    rating: 4.6,
    reviews: 42,
    image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=800&auto=format&fit=crop',
    tags: ['Handcrafted', 'Premium Wood', 'Kitchen Essential'],
    seller: 'Woodcraft Studio'
  }
]

export default function ProductShowcase() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [likedProducts, setLikedProducts] = useState<number[]>([])
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredProducts.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleLike = (id: number) => {
    setLikedProducts(prev =>
      prev.includes(id)
        ? prev.filter(productId => productId !== id)
        : [...prev, id]
    )
  }

  const nextProduct = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredProducts.length)
  }

  const prevProduct = () => {
    setCurrentIndex((prev) => (prev - 1 + featuredProducts.length) % featuredProducts.length)
  }

  return (
    <section className="py-20 bg-gradient-to-b from-secondary/5 to-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Featured{' '}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Local Treasures
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover handpicked items from talented creators in your community
          </p>
        </motion.div>

        {/* Main Featured Product Carousel */}
        <div className="relative mb-16">
          <div className="flex overflow-hidden rounded-3xl shadow-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col lg:flex-row w-full min-h-[500px]"
              >
                <div className="lg:w-1/2 relative">
                  <Image
                    src={featuredProducts[currentIndex].image}
                    alt={featuredProducts[currentIndex].name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    {featuredProducts[currentIndex].tags.map((tag, i) => (
                      <Badge 
                        key={i} 
                        variant="secondary"
                        className="backdrop-blur-sm bg-white/80"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute top-4 right-4 backdrop-blur-sm bg-white/80 hover:bg-white"
                    onClick={() => handleLike(featuredProducts[currentIndex].id)}
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        likedProducts.includes(featuredProducts[currentIndex].id)
                          ? 'fill-red-500 text-red-500'
                          : ''
                      }`}
                    />
                  </Button>
                </div>

                <div className="lg:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-bold">{featuredProducts[currentIndex].rating}</span>
                      <span className="text-muted-foreground">
                        ({featuredProducts[currentIndex].reviews} reviews)
                      </span>
                    </div>
                  </div>

                  <h3 className="text-3xl font-bold mb-4">
                    {featuredProducts[currentIndex].name}
                  </h3>

                  <p className="text-muted-foreground mb-6">
                    By {featuredProducts[currentIndex].seller}
                  </p>

                  <div className="flex items-center gap-4 mb-8">
                    <div className="text-3xl font-bold text-primary">
                      ${featuredProducts[currentIndex].price.toFixed(2)}
                    </div>
                    <div className="text-xl text-muted-foreground line-through">
                      ${featuredProducts[currentIndex].originalPrice.toFixed(2)}
                    </div>
                    <Badge variant="destructive" className="text-sm">
                      Save ${(featuredProducts[currentIndex].originalPrice - featuredProducts[currentIndex].price).toFixed(2)}
                    </Badge>
                  </div>

                  <div className="flex gap-4">
                    <Button size="lg" className="flex-1 gap-2">
                      <ShoppingCart className="w-5 h-5" />
                      Add to Cart
                    </Button>
                    <Button size="lg" variant="outline" className="gap-2">
                      <Eye className="w-5 h-5" />
                      Quick View
                    </Button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            <Button
              size="icon"
              variant="secondary"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 backdrop-blur-sm bg-white/80 hover:bg-white"
              onClick={prevProduct}
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 backdrop-blur-sm bg-white/80 hover:bg-white"
              onClick={nextProduct}
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-6">
            {featuredProducts.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentIndex
                    ? 'bg-primary w-8'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Interactive Category Filter */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold mb-6 text-center">Browse by Category</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {['All', 'Food & Drink', 'Home & Living', 'Fashion', 'Art', 'Wellness', 'Electronics'].map((category, i) => (
              <motion.button
                key={category}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow font-medium"
              >
                {category}
                {i === 0 && (
                  <span className="ml-2 inline-flex items-center justify-center w-6 h-6 text-xs bg-primary text-white rounded-full">
                    {featuredProducts.length}
                  </span>
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}