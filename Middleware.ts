import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            supabaseResponse.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Auth routes that should be accessible only to logged out users
  const authRoutes = ['/login', '/register', '/forgot-password', '/reset-password']
  if (authRoutes.includes(request.nextUrl.pathname)) {
    if (user) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return supabaseResponse
  }

  // Protected routes
  const protectedRoutes = ['/dashboard', '/profile', '/settings', '/seller']
  if (protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route))) {
    if (!user) {
      const redirectUrl = new URL('/login', request.url)
      redirectUrl.searchParams.set('redirect', request.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }

    // Role-based access control
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    // Seller routes
    if (request.nextUrl.pathname.startsWith('/seller')) {
      if (userData?.role !== 'seller' && userData?.role !== 'admin') {
        return NextResponse.redirect(new URL('/unauthorized', request.url))
      }
    }

    // Admin routes
    if (request.nextUrl.pathname.startsWith('/admin')) {
      if (userData?.role !== 'admin') {
        return NextResponse.redirect(new URL('/unauthorized', request.url))
      }
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
  ],
}