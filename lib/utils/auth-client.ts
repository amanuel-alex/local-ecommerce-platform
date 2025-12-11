'use client'

import { createClient } from '@/lib/supabase/client'

// Client-side function to get user role
export async function getUserRoleClient(userId: string): Promise<string> {
  try {
    const supabase = createClient()
    
    const { data: userData, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .single()

    if (error) throw error
    
    return userData?.role || 'customer'
  } catch (error) {
    console.error('Error fetching user role:', error)
    return 'customer' // Default fallback
  }
}

// Get user data with role (client-side)
export async function getUserWithRoleClient() {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return null

    const role = await getUserRoleClient(user.id)
    
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