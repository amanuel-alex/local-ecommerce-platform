'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, DollarSign, ShoppingCart, Users, TrendingUp, Clock, AlertCircle, Star, BarChart2 } from 'lucide-react';
import { StatsCard } from '@/components/dashboard/stats-card';
import { RecentActivities, type ActivityItem } from '@/components/dashboard/recent-activities';
import { SalesOverview } from '@/components/dashboard/sales-overview';

export default function SellerDashboard() {
  // Mock data - replace with real data from your API
  const stats = [
    {
      title: 'Total Revenue',
      value: '$12,345.67',
      change: '+12.5% from last month',
      icon: DollarSign,
      changeType: 'increase' as const,
    },
    {
      title: 'Total Orders',
      value: '156',
      change: '+8 from last week',
      icon: ShoppingCart,
      changeType: 'increase' as const,
    },
    {
      title: 'Products',
      value: '42',
      change: '+3 this month',
      icon: Package,
      changeType: 'increase' as const,
    },
    {
      title: 'Rating',
      value: '4.8/5',
      change: 'From 124 reviews',
      icon: Star,
      changeType: 'increase' as const,
    },
  ];

  const recentActivities: ActivityItem[] = [
    {
      id: '1',
      type: 'order',
      title: 'New Order #S-4567',
      description: '2x Wireless Earbuds, 1x Smart Watch',
      time: '15 minutes ago',
      status: 'pending',
    },
    {
      id: '2',
      type: 'sale',
      title: 'Order #S-4566 Shipped',
      description: 'Tracking: 1Z999AA1234567890',
      time: '2 hours ago',
      status: 'completed',
    },
    {
      id: '3',
      type: 'product',
      title: 'Low Stock Alert',
      description: 'Wireless Earbuds (3 left in stock)',
      time: '5 hours ago',
      status: 'failed',
    },
    {
      id: '4',
      type: 'sale',
      title: 'New Review Received',
      description: '5 stars - "Great product!"',
      time: '1 day ago',
      status: 'completed',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Seller Dashboard</h2>
        <div className="flex items-center space-x-2">
          <button className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            <BarChart2 className="mr-2 h-4 w-4" />
            View Analytics
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <StatsCard
            key={i}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            change={stat.change}
            changeType={stat.changeType}
          />
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <SalesOverview className="col-span-4" />
        <RecentActivities 
          activities={recentActivities} 
          className="col-span-3" 
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Recent Orders
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Order #{2000 + i}</p>
                    <p className="text-sm text-muted-foreground">
                      {i === 1 && '2x Wireless Earbuds'}
                      {i === 2 && '1x Smart Watch'}
                      {i === 3 && '3x Phone Cases'}
                    </p>
                  </div>
                  <div className="text-sm font-medium">
                    ${(79.99 * i).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <button className="flex flex-col items-center justify-center rounded-lg border p-4 transition-colors hover:bg-muted/50">
                <Package className="mb-2 h-6 w-6" />
                <span className="text-sm font-medium">Add Product</span>
              </button>
              <button className="flex flex-col items-center justify-center rounded-lg border p-4 transition-colors hover:bg-muted/50">
                <ShoppingCart className="mb-2 h-6 w-6" />
                <span className="text-sm font-medium">Manage Orders</span>
              </button>
              <button className="flex flex-col items-center justify-center rounded-lg border p-4 transition-colors hover:bg-muted/50">
                <DollarSign className="mb-2 h-6 w-6" />
                <span className="text-sm font-medium">View Earnings</span>
              </button>
              <button className="flex flex-col items-center justify-center rounded-lg border p-4 transition-colors hover:bg-muted/50">
                <Users className="mb-2 h-6 w-6" />
                <span className="text-sm font-medium">Customer Reviews</span>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: 'Wireless Earbuds', sales: 124, revenue: '$3,100.00' },
              { name: 'Smart Watch', sales: 89, revenue: '$2,225.00' },
              { name: 'Bluetooth Speaker', sales: 45, revenue: '$1,125.00' },
              { name: 'Phone Case', sales: 215, revenue: '$1,075.00' },
            ].map((product, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="w-1/3">
                  <p className="font-medium">{product.name}</p>
                </div>
                <div className="w-1/3 text-center">
                  <p className="text-sm text-muted-foreground">{product.sales} sales</p>
                </div>
                <div className="w-1/3 text-right">
                  <p className="font-medium">{product.revenue}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
