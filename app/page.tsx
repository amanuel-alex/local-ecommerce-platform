import { Suspense } from 'react'
import HeroSection from '@/components/landing/hero'
import FeaturesSection from '@/components/landing/features'
import TestimonialsSection from '@/components/landing/testimonials'
import CTASection from '@/components/landing/cta-section'
import { ProductTabs } from '@/components/products/product-tabs'
import { ProductGrid } from '@/components/products/product-grid'
import { getRecentProducts, getTopSellingProducts, getTrendingProducts, getFeaturedProducts } from '@/lib/supabase/products'
import { mockProducts } from '@/lib/mock/products'

// For development, use mock data. In production, use real data
async function getProducts() {
  try {
    // Try to get real data first
    const [recent, top, trending, featured] = await Promise.all([
      getRecentProducts(8),
      getTopSellingProducts(8),
      getTrendingProducts(8),
      getFeaturedProducts(8)
    ])

    // If we have real data, use it
    if (recent.length > 0) {
      return { recent, top, trending, featured }
    }
    
    // Otherwise use mock data
    return {
      recent: mockProducts.slice(0, 4),
      top: mockProducts.slice(0, 4),
      trending: mockProducts.slice(2, 6),
      featured: mockProducts.slice(4, 8)
    }
  } catch (error) {
    console.error('Error fetching products:', error)
    // Fallback to mock data
    return {
      recent: mockProducts.slice(0, 4),
      top: mockProducts.slice(0, 4),
      trending: mockProducts.slice(2, 6),
      featured: mockProducts.slice(4, 8)
    }
  }
}

export default async function HomePage() {
  const products = await getProducts()

  return (
    <main className="min-h-screen">
      <HeroSection />
      
      {/* Featured Products Section */}
      <section className="py-16 bg-gradient-to-b from-background to-secondary/5">
        <div className="container mx-auto px-4">
          <Suspense fallback={<ProductGrid loading columns={4} products={[]} />}>
            <ProductGrid
              products={products.featured}
              title="Featured Local Products"
              subtitle="Handpicked items from talented creators in your community"
              columns={4}
            />
          </Suspense>
        </div>
      </section>

      <FeaturesSection />
      
      {/* Interactive Product Tabs */}
      <section className="py-20 bg-gradient-to-b from-secondary/5 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
              Discover Local Treasures
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Browse through thousands of products from local artisans and sellers
            </p>
          </div>
          
          <Suspense fallback={<ProductGrid loading columns={4} products={[]} />}>
            <ProductTabs
              recentProducts={products.recent}
              topSellingProducts={products.top}
              trendingProducts={products.trending}
              featuredProducts={products.featured}
            />
          </Suspense>
        </div>
      </section>

      {/* Top Selling Products */}
      <section className="py-16 bg-gradient-to-b from-background to-primary/5">
        <div className="container mx-auto px-4">
          <Suspense fallback={<ProductGrid loading columns={4} products={[]} />}>
            <ProductGrid
              products={products.top}
              title="Community Favorites"
              subtitle="Best-selling products loved by local shoppers"
              columns={4}
            />
          </Suspense>
        </div>
      </section>

      <TestimonialsSection />
      <CTASection />
    </main>
  )
}