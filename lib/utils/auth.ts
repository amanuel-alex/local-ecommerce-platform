import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

// Get user role from database
export async function getUserRole(userId: string): Promise<string> {
  try {
    // Check in admin table
    const admin = await prisma.admin.findUnique({
      where: { userId },
      select: { id: true }
    })
    if (admin) return 'admin'

    // Check in seller table
    const seller = await prisma.seller.findUnique({
      where: { userId },
      select: { id: true }
    })
    if (seller) return 'seller'

    // Check in customer table
    const customer = await prisma.customer.findUnique({
      where: { userId },
      select: { id: true }
    })
    if (customer) return 'customer'

    // Default to customer if no specific role found
    return 'customer'
  } catch (error) {
    console.error('Error fetching user role:', error)
    return 'customer' // Default fallback
  }
}

// Get current user with role
export async function getCurrentUser() {
  try {
    const supabase = createClient()
    const { data: { user } } = await (await supabase).auth.getUser()
    
    if (!user) return null

    const role = await getUserRole(user.id)
    
    return {
      ...user,
      role,
      user_metadata: user.user_metadata || {}
    }
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

// Check if user is authenticated and has required role
export async function checkAuth(requiredRole?: string) {
  const user = await getCurrentUser()
  
  if (!user) {
    return { 
      authorized: false, 
      redirect: '/auth/login' 
    }
  }

  if (requiredRole && user.role !== requiredRole) {
    // Redirect to appropriate dashboard based on actual role
    let redirectTo = '/'
    switch (user.role) {
      case 'admin':
        redirectTo = '/dashboard/admin'
        break
      case 'seller':
        redirectTo = '/dashboard/seller'
        break
      case 'customer':
        redirectTo = '/dashboard/customer'
        break
    }
    
    return { 
      authorized: false, 
      redirect: redirectTo 
    }
  }

  return { 
    authorized: true, 
    user 
  }
}