import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import  DashboardLayout  from "@/components/dashboard/DashboardLayout"

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()
  const { data: { user } } = await (await supabase).auth.getUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  // Get user role from database
  const { data: userData } = await (await supabase)
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!userData || userData.role !== 'admin') {
    // Redirect to appropriate dashboard based on actual role
    if (userData?.role === 'seller') {
      redirect('/dashboard/seller')
    } else if (userData?.role === 'customer') {
      redirect('/dashboard/customer')
    } else {
      redirect('/')
    }
  }

  return (
    <DashboardLayout role="admin">
      {children}
    </DashboardLayout>
  )
}