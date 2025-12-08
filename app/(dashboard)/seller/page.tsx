'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  BarChart3, 
  Package, 
  ShoppingBag, 
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Eye,
  Star
} from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function SellerDashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [seller, setSeller] = useState<any>(null)
  const [products, setProducts] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])
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

      // Fetch seller profile
      const { data: sellerData } = await supabase
        .from('sellers')
        .select('*')
        .eq('user_id', user.id)
        .single()

      setSeller(sellerData)

      // Fetch products
      const { data: productsData } = await supabase
        .from('products')
        .select('*')
        .eq('seller_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10)

      // Fetch recent orders
      const { data: ordersData } = await supabase
        .from('order_items')
        .select('*, products(*), orders(*)')
        .eq('products.seller_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10)

      setProducts(productsData || [])
      setOrders(ordersData || [])
    } catch (error) {
      toast.error('Error loading dashboard')
    } finally {
      setLoading(false)
    }
  }

  const stats = [
    { title: 'Total Revenue', value: '$12,450', icon: DollarSign, change: '+12.5%', trend: 'up' },
    { title: 'Total Orders', value: '156', icon: ShoppingBag, change: '+8.2%', trend: 'up' },
    { title: 'Products', value: '42', icon: Package, change: '+3', trend: 'up' },
    { title: 'Customers', value: '89', icon: Users, change: '+15.7%', trend: 'up' },
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Seller Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your store, {seller?.business_name || 'Seller'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push('/seller/products')}>
            Manage Products
          </Button>
          <Button onClick={() => router.push('/seller/products/new')}>
            Add Product
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${
                stat.trend === 'up' ? 'bg-green-500' : 'bg-red-500'
              }`}>
                <stat.icon className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center text-xs">
                {stat.trend === 'up' ? (
                  <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
                )}
                <span className={stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}>
                  {stat.change}
                </span>
                <span className="text-muted-foreground ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs for different views */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>
                  Latest orders from your products
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.length > 0 ? (
                    orders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-3 rounded-lg border">
                        <div className="space-y-1">
                          <p className="font-medium">{order.products?.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Order #{order.orders?.order_number}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline" className="mb-2">
                            {order.status}
                          </Badge>
                          <p className="font-bold">${order.quantity * order.unit_price}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground" />
                      <h3 className="mt-4 text-lg font-semibold">No orders yet</h3>
                      <p className="text-muted-foreground mt-2">
                        Orders will appear here
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Top Products */}
            <Card>
              <CardHeader>
                <CardTitle>Top Products</CardTitle>
                <CardDescription>
                  Best selling products
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {products.slice(0, 3).map((product) => (
                    <div key={product.id} className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-md bg-muted flex items-center justify-center">
                        {product.image_url ? (
                          <img 
                            src={product.image_url} 
                            alt={product.name}
                            className="h-full w-full object-cover rounded-md"
                          />
                        ) : (
                          <Package className="h-6 w-6 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{product.name}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold">${product.price}</span>
                          <div className="flex items-center">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs ml-1">{product.rating || '4.5'}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold">24 sold</p>
                        <p className="text-xs text-muted-foreground">$2,400 revenue</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Your Products</CardTitle>
              <CardDescription>
                Manage your product listings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {products.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 rounded-md bg-muted flex items-center justify-center">
                        {product.image_url ? (
                          <img 
                            src={product.image_url} 
                            alt={product.name}
                            className="h-full w-full object-cover rounded-md"
                          />
                        ) : (
                          <Package className="h-8 w-8 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold">{product.name}</h3>
                        <p className="text-sm text-muted-foreground truncate max-w-md">
                          {product.description}
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                          <Badge variant={product.stock > 0 ? 'default' : 'destructive'}>
                            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                          </Badge>
                          <span className="font-bold">${product.price}</span>
                          <div className="flex items-center">
                            <Eye className="h-3 w-3 mr-1" />
                            <span className="text-xs">{product.views || 0} views</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">Edit</Button>
                      <Button size="sm">View</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}