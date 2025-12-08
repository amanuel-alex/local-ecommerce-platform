import { ReactNode } from 'react'
import Link from 'next/link'
import { Sparkles } from 'lucide-react'

export default function AuthLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Side - Brand/Info */}
      <div className="md:w-1/2 bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-8 md:p-12 lg:p-16">
        <div className="max-w-md mx-auto md:mx-0">
          <Link href="/" className="inline-flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold gradient-text">Local Market</span>
          </Link>
          
          <div className="space-y-6 mt-12">
            <h1 className="text-4xl md:text-5xl font-bold">
              Join Your <span className="gradient-text">Local</span> Community
            </h1>
            <p className="text-lg text-muted-foreground">
              Connect with local sellers, discover unique products, and support your community economy.
            </p>
            
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="p-4 rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5">
                <div className="text-2xl font-bold text-primary">10K+</div>
                <div className="text-sm text-muted-foreground">Local Sellers</div>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5">
                <div className="text-2xl font-bold text-primary">50K+</div>
                <div className="text-sm text-muted-foreground">Products</div>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5">
                <div className="text-2xl font-bold text-primary">99%</div>
                <div className="text-sm text-muted-foreground">Satisfaction</div>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5">
                <div className="text-2xl font-bold text-primary">24h</div>
                <div className="text-sm text-muted-foreground">Delivery</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="md:w-1/2 flex items-center justify-center p-4 md:p-8 lg:p-12">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  )
}