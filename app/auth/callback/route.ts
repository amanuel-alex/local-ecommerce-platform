import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  
  if (code) {
    const supabase = await createClient()
    
    try {
      const { error, data } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('Auth callback error:', error)
        // Redirect to login with error
        return NextResponse.redirect(new URL('/login?error=auth_callback_failed', requestUrl.origin))
      }
      
      if (data?.user) {
        // Get user role from users table
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('role')
          .eq('id', data.user.id)
          .single()
        
        // Default redirect path
        let redirectPath = '/'
        
        // Determine redirect based on role
        if (!userError && userData?.role) {
          switch (userData.role) {
            case 'admin':
              redirectPath = '/admin'
              break
            case 'seller':
              redirectPath = '/seller'
              break
            case 'customer':
              redirectPath = '/customer'
              break
          }
        }
        
        // If no role found or error, check user metadata
        if (userError || !userData?.role) {
          const accountType = data.user.user_metadata?.account_type
          if (accountType === 'seller') {
            redirectPath = '/seller/'
          } else {
            redirectPath = '/customer'
          }
        }
        
        return NextResponse.redirect(new URL(redirectPath, requestUrl.origin))
      }
    } catch (error) {
      console.error('Unexpected error in auth callback:', error)
    }
  }

  // Return to home page if no code or error
  return NextResponse.redirect(new URL('/', requestUrl.origin))
}