import { Suspense } from 'react'
import HeroSection from '@/components/landing/hero'
import FeaturesSection from '@/components/landing/features'
import ProductShowcase from '@/components/landing/product-showcase'
import TestimonialsSection from '@/components/landing/testimonials'
import CTASection from '@/components/landing/cta-section'
import { SparklesBackground } from '../components/ui/sparkles-background'
import { FloatingElements } from '../components/ui/floating-elements'

export default function HomePage() {
  return (
    <>
      <SparklesBackground />
      <FloatingElements />
      
      <div className="relative z-10">
        <HeroSection />
        <FeaturesSection />
        
        <Suspense fallback={<div>Loading products...</div>}>
          <ProductShowcase />
        </Suspense>
        
        <TestimonialsSection />
        <CTASection />
      </div>
    </>
  )
}