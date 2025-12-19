// app/setup-profile/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { User, Building, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

export default function SetupProfilePage() {
  const router = useRouter()
  const [selectedRole, setSelectedRole] = useState<'customer' | 'seller' | 'admin'>('customer')
  const [isLoading, setIsLoading] = useState(false)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleSubmit = async () => {
    setIsLoading(true)
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/login')
        return
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .insert([
          {
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name || '',
            role: selectedRole
          }
        ])
        .select()
        .single()

      if (error) throw error

      toast.success('Profile created successfully!')
      router.push('/profile')
      router.refresh()
      
    } catch (error: any) {
      toast.error('Failed to create profile', {
        description: error.message
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Complete Your Profile</h1>
          <p className="text-gray-600">Choose your account type to get started</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card 
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedRole === 'customer' ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => setSelectedRole('customer')}
          >
            <CardHeader className="text-center">
              <User className="h-12 w-12 mx-auto mb-4 text-blue-600" />
              <CardTitle>Customer</CardTitle>
              <CardDescription>Shop and purchase products</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Browse and shop products</li>
                <li>• Track orders</li>
                <li>• Save favorites</li>
                <li>• Write reviews</li>
              </ul>
            </CardContent>
          </Card>

          <Card 
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedRole === 'seller' ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => setSelectedRole('seller')}
          >
            <CardHeader className="text-center">
              <Building className="h-12 w-12 mx-auto mb-4 text-green-600" />
              <CardTitle>Seller</CardTitle>
              <CardDescription>Sell products on our platform</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• List products for sale</li>
                <li>• Manage inventory</li>
                <li>• Process orders</li>
                <li>• View sales analytics</li>
              </ul>
            </CardContent>
          </Card>

          <Card 
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedRole === 'admin' ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => setSelectedRole('admin')}
          >
            <CardHeader className="text-center">
              <Shield className="h-12 w-12 mx-auto mb-4 text-purple-600" />
              <CardTitle>Admin</CardTitle>
              <CardDescription>Manage platform operations</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Manage users and sellers</li>
                <li>• Monitor platform activity</li>
                <li>• Handle disputes</li>
                <li>• Platform analytics</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Button 
            size="lg" 
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-8"
          >
            {isLoading ? 'Creating Profile...' : `Continue as ${selectedRole}`}
          </Button>
          <p className="text-sm text-gray-500 mt-4">
            You can change your role later in profile settings
          </p>
        </div>
      </div>
    </div>
  )
}