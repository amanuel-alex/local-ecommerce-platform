import 'server-only'
import { createClient } from '@/lib/supabase/server'

// Server-side function to get user role
export async function getUserRole(userId: string): Promise<string> {
  try {
    const supabase = await createClient()
    
    const { data: userData, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .single()

    if (error) {
      console.warn('Server: Error fetching user role:', error)
      return 'customer'
    }
    
    return userData?.role || 'customer'
  } catch (error) {
    console.error('Server: Unexpected error in getUserRole:', error)
    return 'customer'
  }
}

// Get current user with role (server-side)
export async function getCurrentUserWithRole() {
  try {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) {
      console.warn('Server: Auth getUser error:', error)
      return null
    }
    
    if (!user) return null

    const role = await getUserRole(user.id)
    
    return {
      ...user,
      role,
      user_metadata: user.user_metadata || {}
    }
  } catch (error) {
    console.error('Server: Error getting current user:', error)
    return null
  }
}

// Check if user is authenticated
export async function isAuthenticated() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  return !!session
}