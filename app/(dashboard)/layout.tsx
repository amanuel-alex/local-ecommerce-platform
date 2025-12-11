import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import DashboardClientLayout from '@/components/dashboard/DashboardLayout'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  // Get user role
  const { data: userData } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!userData) {
    redirect('/complete-profile')
  }

  // Pass role to client component
  return (
    <DashboardClientLayout user={user} role={userData.role}>
      {children}
    </DashboardClientLayout>
  )
}