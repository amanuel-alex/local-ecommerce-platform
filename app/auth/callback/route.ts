import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')
  const errorDescription = requestUrl.searchParams.get('error_description')

  if (error) {
    console.error('Auth callback error:', error, errorDescription)
    return NextResponse.redirect(
      `${requestUrl.origin}/login?error=${encodeURIComponent(errorDescription || 'Authentication failed')}`
    )
  }

  if (code) {
    const supabase = createRouteHandlerClient({ cookies })
    
    try {
      // Exchange code for session
      const { data: { user }, error: authError } = await supabase.auth.exchangeCodeForSession(code)
      
      if (authError) {
        throw authError
      }

      if (user) {
        // Check if user profile exists, create if not
        const { data: profile, error: profileError } = await supabase
          .from('users')
          .select('id')
          .eq('id', user.id)
          .single()

        if (profileError && profileError.code === 'PGRST116') {
          // Profile doesn't exist, create it
          const { error: createError } = await supabase
            .from('users')
            .insert({
              id: user.id,
              email: user.email,
              full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
              role: user.user_metadata?.account_type || 'customer',
            })

          if (createError) {
            console.error('Failed to create user profile:', createError)
          }
        }

        // Redirect to dashboard
        return NextResponse.redirect(`${requestUrl.origin}/dashboard`)
      }
    } catch (error) {
      console.error('Auth callback error:', error)
      return NextResponse.redirect(
        `${requestUrl.origin}/login?error=Authentication failed`
      )
    }
  }

  // Redirect to login if no code
  return NextResponse.redirect(`${requestUrl.origin}/login`)
}