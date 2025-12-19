'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, ShoppingCart, Clock, CheckCircle2, XCircle, Star, Heart, Truck, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

type OrderStatus = 'processing' | 'shipped' | 'delivered' | 'cancelled';

interface Order {
  id: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  status: OrderStatus;
  orderDate: string;
  estimatedDelivery?: string;
  trackingNumber?: string;
}

const OrderStatusBadge = ({ status }: { status: OrderStatus }) => {
  const statusConfig = {
    processing: { label: 'Processing', color: 'bg-yellow-500' },
    shipped: { label: 'Shipped', color: 'bg-blue-500' },
    delivered: { label: 'Delivered', color: 'bg-green-500' },
    cancelled: { label: 'Cancelled', color: 'bg-red-500' },
  };

  return (
    <Badge className={`${statusConfig[status].color} hover:${statusConfig[status].color} text-white`}>
      {statusConfig[status].label}
    </Badge>
  );
};

export default function CustomerDashboard() {
  // Mock data - replace with real data from your API
  const recentOrders: Order[] = [
    {
      id: '#ORD-001',
      items: [
        { name: 'Wireless Earbuds', quantity: 1, price: 99.99 },
        { name: 'Phone Case', quantity: 2, price: 14.99 },
      ],
      total: 129.97,
      status: 'shipped',
      orderDate: '2023-06-15',
      estimatedDelivery: '2023-06-22',
      trackingNumber: '1Z999AA1234567890',
    },
    {
      id: '#ORD-002',
      items: [{ name: 'Smart Watch', quantity: 1, price: 199.99 }],
      total: 199.99,
      status: 'delivered',
      orderDate: '2023-06-10',
      estimatedDelivery: '2023-06-17',
    },
    {
      id: '#ORD-003',
      items: [{ name: 'Bluetooth Speaker', quantity: 1, price: 79.99 }],
      total: 79.99,
      status: 'cancelled',
      orderDate: '2023-06-05',
    },
  ];

  const wishlist = [
    { id: '1', name: 'Wireless Headphones', price: 149.99, rating: 4.8 },
    { id: '2', name: 'Fitness Tracker', price: 79.99, rating: 4.5 },
  ];

  const recommendedProducts = [
    { id: '1', name: 'Phone Stand', price: 19.99, rating: 4.7 },
    { id: '2', name: 'Screen Protector', price: 9.99, rating: 4.3 },
    { id: '3', name: 'Wireless Charger', price: 29.99, rating: 4.6 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">My Dashboard</h2>
        <Button>Start Shopping</Button>
      </div>

      {/* Order Status Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Orders being processed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivered</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">9</div>
            <p className="text-xs text-muted-foreground">+3 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">No change from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Orders */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium leading-none">{order.id}</p>
                      <OrderStatusBadge status={order.status} />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {order.items.map((item) => `${item.quantity}x ${item.name}`).join(', ')}
                    </p>
                    <div className="text-sm text-muted-foreground">
                      Ordered on {new Date(order.orderDate).toLocaleDateString()}
                    </div>
                    {order.trackingNumber && (
                      <div className="flex items-center text-sm text-blue-500 mt-1">
                        <Truck className="h-4 w-4 mr-1" />
                        <span>Track Order: {order.trackingNumber}</span>
                      </div>
                    )}
                  </div>
                  <div className="ml-auto font-medium">${order.total.toFixed(2)}</div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              View All Orders
            </Button>
          </CardContent>
        </Card>

        {/* Wishlist */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>My Wishlist</CardTitle>
          </CardHeader>
          <CardContent>
            {wishlist.length > 0 ? (
              <div className="space-y-4">
                {wishlist.map((item) => (
                  <div key={item.id} className="flex items-center">
                    <div className="h-12 w-12 bg-muted rounded-md mr-3"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.name}</p>
                      <div className="flex items-center">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                        <span className="text-xs text-muted-foreground">{item.rating}</span>
                      </div>
                      <p className="text-sm font-medium">${item.price.toFixed(2)}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Add to Cart
                    </Button>
                  </div>
                ))}
                <Button variant="outline" className="w-full mt-2">
                  View All Wishlist Items
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Heart className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Your wishlist is empty</p>
                <Button variant="outline" className="mt-4">
                  Start Browsing
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recommended Products */}
      <Card>
        <CardHeader>
          <CardTitle>Recommended For You</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {recommendedProducts.map((product) => (
              <div key={product.id} className="border rounded-lg p-4">
                <div className="aspect-square w-full bg-muted rounded-md mb-3"></div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{product.name}</h3>
                    <div className="flex items-center">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                      <span className="text-xs text-muted-foreground">{product.rating}</span>
                    </div>
                  </div>
                  <p className="font-medium">${product.price.toFixed(2)}</p>
                </div>
                <Button size="sm" className="w-full mt-3">
                  Add to Cart
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
