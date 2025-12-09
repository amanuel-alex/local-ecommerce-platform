import { ReactNode } from 'react'
import Link from 'next/link'
import { Sparkles, Users, Package, Star, Clock } from 'lucide-react'

export default function AuthLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-background via-primary/5 to-secondary/5">
      {/* Floating decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-secondary/5 rounded-full blur-3xl" />
        <div className="absolute top-2/3 left-2/3 w-48 h-48 bg-primary/3 rounded-full blur-2xl" />
      </div>

      {/* Left Side - Brand/Info */}
      <div className="md:w-1/2 relative p-6 md:p-10 lg:p-16 flex flex-col justify-between">
        {/* Glow effect container */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-transparent to-secondary/10" />
        
        <div className="relative z-10">
          <Link 
            href="/" 
            className="inline-flex items-center gap-3 group mb-12 md:mb-16 transition-all duration-300 hover:scale-[1.02]"
          >
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/30 transition-shadow duration-300">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -inset-2 rounded-xl bg-primary/20 blur-xl group-hover:bg-primary/30 transition-all duration-300" />
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent">
              Local Market
            </span>
          </Link>
          
          <div className="max-w-xl space-y-8 mt-8 md:mt-16">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
                Join Your{' '}
                <span className="relative">
                  <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Local
                  </span>
                  <span className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary rounded-full" />
                </span>{' '}
                Community
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Connect with local sellers, discover unique products, and support your community economy through our vibrant marketplace.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-5 mt-12">
              <div className="group relative p-5 rounded-2xl bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-sm border border-primary/10 hover:border-primary/20 transition-all duration-300 hover:scale-[1.03]">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Users className="w-8 h-8 text-primary mb-3" />
                <div className="text-3xl font-bold text-primary">10K+</div>
                <div className="text-sm text-muted-foreground">Local Sellers</div>
              </div>
              
              <div className="group relative p-5 rounded-2xl bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-sm border border-secondary/10 hover:border-secondary/20 transition-all duration-300 hover:scale-[1.03]">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Package className="w-8 h-8 text-secondary mb-3" />
                <div className="text-3xl font-bold text-secondary">50K+</div>
                <div className="text-sm text-muted-foreground">Products</div>
              </div>
              
              <div className="group relative p-5 rounded-2xl bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-sm border border-primary/10 hover:border-primary/20 transition-all duration-300 hover:scale-[1.03]">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Star className="w-8 h-8 text-primary mb-3" />
                <div className="text-3xl font-bold text-primary">99%</div>
                <div className="text-sm text-muted-foreground">Satisfaction</div>
              </div>
              
              <div className="group relative p-5 rounded-2xl bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-sm border border-secondary/10 hover:border-secondary/20 transition-all duration-300 hover:scale-[1.03]">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Clock className="w-8 h-8 text-secondary mb-3" />
                <div className="text-3xl font-bold text-secondary">24h</div>
                <div className="text-sm text-muted-foreground">Delivery</div>
              </div>
            </div>
            
            <div className="pt-8">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span>Trusted by thousands</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  <span>Secure & reliable</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="md:w-1/2 flex items-center justify-center p-6 md:p-10 lg:p-16 relative">
        <div className="absolute inset-0 bg-gradient-to-tl from-background via-background to-transparent md:hidden" />
        <div className="relative z-10 w-full max-w-md">
          <div className="backdrop-blur-sm bg-background/60 border border-primary/5 rounded-3xl p-8 md:p-10 shadow-2xl shadow-primary/5">
            {children}
          </div>
          
          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>By continuing, you agree to our</p>
            <div className="flex items-center justify-center gap-2 mt-1">
              <Link href="/terms" className="text-primary hover:text-primary/80 transition-colors">
                Terms of Service
              </Link>
              <span>•</span>
              <Link href="/privacy" className="text-primary hover:text-primary/80 transition-colors">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}