'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  ShoppingCart, 
  Package, 
  Heart, 
  Clock,
  TrendingUp,
  DollarSign,
  ShoppingBag,
  User
} from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function CustomerDashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [wishlist, setWishlist] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setUser(user)

      // Fetch customer data
      const { data: customerData } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      // Fetch recent orders
      const { data: ordersData } = await supabase
        .from('orders')
        .select('*, order_items(*, products(*))')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5)

      // Fetch wishlist
      const { data: wishlistData } = await supabase
        .from('wishlist')
        .select('*, products(*)')
        .eq('user_id', user.id)
        .limit(5)

      setOrders(ordersData || [])
      setWishlist(wishlistData || [])
    } catch (error) {
      toast.error('Error loading dashboard')
    } finally {
      setLoading(false)
    }
  }

  const stats = [
    { title: 'Total Orders', value: '24', icon: ShoppingBag, color: 'bg-blue-500' },
    { title: 'Wishlist Items', value: '8', icon: Heart, color: 'bg-pink-500' },
    { title: 'Pending Orders', value: '3', icon: Clock, color: 'bg-yellow-500' },
    { title: 'Total Spent', value: '$1,240', icon: DollarSign, color: 'bg-green-500' },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.user_metadata?.full_name || 'Customer'}! Here's what's happening today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${stat.color}`}>
                <stat.icon className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                +20.1% from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Recent Orders */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>
              Your recent orders and their status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orders.length > 0 ? (
                orders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="space-y-1">
                      <p className="font-medium">Order #{order.order_number}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant={
                        order.status === 'delivered' ? 'default' :
                        order.status === 'shipped' ? 'secondary' :
                        order.status === 'processing' ? 'outline' : 'destructive'
                      }>
                        {order.status}
                      </Badge>
                      <p className="font-bold">${order.total_amount}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">No orders yet</h3>
                  <p className="text-muted-foreground mt-2">
                    Start shopping to see your orders here
                  </p>
                  <Button className="mt-4" onClick={() => router.push('/products')}>
                    Browse Products
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Wishlist */}
        <Card>
          <CardHeader>
            <CardTitle>Wishlist</CardTitle>
            <CardDescription>
              Items you've saved for later
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {wishlist.length > 0 ? (
                wishlist.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-md bg-muted flex items-center justify-center">
                      {item.products?.image_url ? (
                        <img 
                          src={item.products.image_url} 
                          alt={item.products.name}
                          className="h-full w-full object-cover rounded-md"
                        />
                      ) : (
                        <Package className="h-6 w-6 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm truncate">
                        {item.products?.name || 'Product'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        ${item.products?.price || '0.00'}
                      </p>
                    </div>
                    <Button size="sm">Buy</Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Heart className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">Wishlist empty</h3>
                  <p className="text-muted-foreground mt-2">
                    Save products you love
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommended Products */}
      <Card>
        <CardHeader>
          <CardTitle>Recommended For You</CardTitle>
          <CardDescription>
            Based on your browsing history
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <Card key={item} className="overflow-hidden">
                <div className="h-48 bg-muted" />
                <CardContent className="p-4">
                  <h3 className="font-semibold">Product Name {item}</h3>
                  <p className="text-sm text-muted-foreground truncate">
                    Product description goes here...
                  </p>
                  <div className="flex items-center justify-between mt-4">
                    <span className="font-bold">$99.99</span>
                    <Button size="sm">Add to Cart</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}