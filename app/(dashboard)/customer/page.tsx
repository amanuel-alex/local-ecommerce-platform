import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { 
  Package, 
  Heart, 
  MapPin, 
  CreditCard, 
  ShoppingBag,
  TrendingUp,
  Clock
} from 'lucide-react'
import Link from 'next/link'

export default async function CustomerDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  // Fetch customer data
  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .eq('customer_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5)

  const { data: wishlist } = await supabase
    .from('wishlist')
    .select('*, products(*)')
    .eq('user_id', user.id)
    .limit(5)

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Welcome back!</h1>
            <p className="text-muted-foreground mt-2">
              Track your orders, manage wishlist, and discover new products
            </p>
          </div>
          <Button asChild>
            <Link href="/product-show">Start Shopping</Link>
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              1 order in transit
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Wishlist Items</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{wishlist?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              Saved for later
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1,240.00</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reward Points</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,240</div>
            <p className="text-xs text-muted-foreground">
              Redeem for discounts
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders & Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Orders</CardTitle>
              <Link href="/customer/orders" className="text-sm text-primary hover:underline">
                View all
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orders?.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">Order #{order.id.slice(-8)}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.status}
                    </span>
                    <div className="font-medium">${order.total}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              <Button asChild variant="outline" className="h-auto py-3 justify-start">
                <Link href="/customer/orders" className="flex items-center gap-3">
                  <ShoppingBag className="h-5 w-5" />
                  <div className="text-left">
                    <div className="font-medium">My Orders</div>
                    <div className="text-sm text-muted-foreground">Track and manage orders</div>
                  </div>
                </Link>
              </Button>

              <Button asChild variant="outline" className="h-auto py-3 justify-start">
                <Link href="/customer/wishlist" className="flex items-center gap-3">
                  <Heart className="h-5 w-5" />
                  <div className="text-left">
                    <div className="font-medium">Wishlist</div>
                    <div className="text-sm text-muted-foreground">View saved items</div>
                  </div>
                </Link>
              </Button>

              <Button asChild variant="outline" className="h-auto py-3 justify-start">
                <Link href="/customer/addresses" className="flex items-center gap-3">
                  <MapPin className="h-5 w-5" />
                  <div className="text-left">
                    <div className="font-medium">Addresses</div>
                    <div className="text-sm text-muted-foreground">Manage delivery addresses</div>
                  </div>
                </Link>
              </Button>

              <Button asChild variant="outline" className="h-auto py-3 justify-start">
                <Link href="/customer/payments" className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5" />
                  <div className="text-left">
                    <div className="font-medium">Payment Methods</div>
                    <div className="text-sm text-muted-foreground">Manage saved cards</div>
                  </div>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommended Products */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recommended For You</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/product-show">Browse More</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <ShoppingBag className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Personalized recommendations will appear here</p>
            <Button asChild className="mt-4">
              <Link href="/product-show">Discover Products</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}