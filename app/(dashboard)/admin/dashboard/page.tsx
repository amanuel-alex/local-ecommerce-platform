'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, ShoppingCart, Package, DollarSign, Activity, CreditCard, Clock, CheckCircle2 } from 'lucide-react';
import { StatsCard } from '@/components/dashboard/stats-card';
import { RecentActivities, type ActivityItem } from '@/components/dashboard/recent-activities';
import { SalesOverview } from '@/components/dashboard/sales-overview';

export default function AdminDashboard() {
  // Mock data - replace with real data from your API
  const stats = [
    {
      title: 'Total Revenue',
      value: '$45,231.89',
      change: '+20.1% from last month',
      icon: DollarSign,
      changeType: 'increase' as const,
    },
    {
      title: 'Active Users',
      value: '1,234',
      change: '+180.1% from last month',
      icon: Users,
      changeType: 'increase' as const,
    },
    {
      title: 'Products',
      value: '573',
      change: '+19% from last month',
      icon: Package,
      changeType: 'increase' as const,
    },
    {
      title: 'Pending Orders',
      value: '12',
      change: '+2 from last hour',
      icon: ShoppingCart,
      changeType: 'increase' as const,
    },
  ];

  const recentActivities: ActivityItem[] = [
    {
      id: '1',
      type: 'order',
      title: 'New Order #1234',
      description: 'Customer: John Doe',
      time: '2 minutes ago',
      status: 'pending',
    },
    {
      id: '2',
      type: 'user',
      title: 'New User Registered',
      description: 'jane.doe@example.com',
      time: '15 minutes ago',
      status: 'completed',
    },
    {
      id: '3',
      type: 'product',
      title: 'Product Low Stock',
      description: 'Product: Wireless Headphones',
      time: '1 hour ago',
      status: 'failed',
    },
    {
      id: '4',
      type: 'sale',
      title: 'New Sale',
      description: 'Order #1233 - $129.99',
      time: '2 hours ago',
      status: 'completed',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
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
              Recent Transactions
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Order #{1000 + i}</p>
                    <p className="text-sm text-muted-foreground">
                      {i === 1 && 'Wireless Earbuds'}
                      {i === 2 && 'Smart Watch'}
                      {i === 3 && 'Bluetooth Speaker'}
                    </p>
                  </div>
                  <div className="text-sm font-medium">
                    ${(99.99 * i).toFixed(2)}
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
                <Users className="mb-2 h-6 w-6" />
                <span className="text-sm font-medium">Manage Users</span>
              </button>
              <button className="flex flex-col items-center justify-center rounded-lg border p-4 transition-colors hover:bg-muted/50">
                <Package className="mb-2 h-6 w-6" />
                <span className="text-sm font-medium">Manage Products</span>
              </button>
              <button className="flex flex-col items-center justify-center rounded-lg border p-4 transition-colors hover:bg-muted/50">
                <ShoppingCart className="mb-2 h-6 w-6" />
                <span className="text-sm font-medium">View Orders</span>
              </button>
              <button className="flex flex-col items-center justify-center rounded-lg border p-4 transition-colors hover:bg-muted/50">
                <DollarSign className="mb-2 h-6 w-6" />
                <span className="text-sm font-medium">View Sales</span>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
