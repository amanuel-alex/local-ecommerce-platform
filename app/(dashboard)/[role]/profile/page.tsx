// app/(dashboard)/[role]/profile/page.tsx
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect, notFound } from 'next/navigation'
import ProfileForm from '@/components/profile/profile-form'

export default async function ProfilePage({
  params
}: {
  params: { role: string }
}) {
  const cookieStore = await cookies()
  
  // Create Supabase server client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  )

  // Validate role
  const validRoles = ['customer', 'seller', 'admin']
  if (!validRoles.includes(params.role)) {
    notFound()
  }

  // Get session
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single()

  // Handle missing profile
  if (!profile) {
    // Create default profile
    const { data: newProfile } = await supabase
      .from('profiles')
      .insert([
        {
          id: session.user.id,
          email: session.user.email,
          full_name: session.user.user_metadata?.full_name || '',
          phone: session.user.user_metadata?.phone || '',
          avatar_url: session.user.user_metadata?.avatar_url || '',
          role: params.role
        }
      ])
      .select()
      .single()

    if (!newProfile) {
      redirect('/setup')
    }

    return <ProfileForm user={session.user} userRole={newProfile.role as any} />
  }

  // Check role access
  if (profile.role !== params.role) {
    redirect(`/${profile.role}/profile`)
  }

  return <ProfileForm user={session.user} userRole={params.role as any} />
}