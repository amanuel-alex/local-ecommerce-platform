import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getUserRole } from '@/lib/utils/auth'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') || '/'
  
  if (code) {
    const supabase = createClient()
    
    const { error, data } = await (await supabase).auth.exchangeCodeForSession(code)
    
    if (!error && data.user) {
      // Get user role and redirect accordingly
      const role = await getUserRole(data.user.id)
      
      let redirectUrl = '/'
      switch (role) {
        case 'admin':
          redirectUrl = '/dashboard/admin'
          break
        case 'seller':
          redirectUrl = '/dashboard/seller'
          break
        case 'customer':
          redirectUrl = '/dashboard/customer'
          break
      }
      
      // Add query params if any
      const finalRedirectUrl = new URL(redirectUrl, requestUrl.origin)
      return NextResponse.redirect(finalRedirectUrl)
    }
  }

  // Return to home page if error
  return NextResponse.redirect(new URL('/', requestUrl.origin))
}