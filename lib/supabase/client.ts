import { createBrowserClient } from '@supabase/ssr'

export const createClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Validate URL
  if (!supabaseUrl) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL environment variable.\n' +
      'Please add it to your .env.local file:\n' +
      'NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co'
    )
  }

  if (!supabaseKey) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable.\n' +
      'Please add it to your .env.local file:\n' +
      'NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here'
    )
  }

  // Validate URL format
  try {
    const url = new URL(supabaseUrl)
    if (!['http:', 'https:'].includes(url.protocol)) {
      throw new Error('URL must start with http:// or https://')
    }
  } catch {
    throw new Error(
      `Invalid Supabase URL: "${supabaseUrl}"\n` +
      'It should be in format: https://project-id.supabase.co'
    )
  }

  return createBrowserClient(supabaseUrl, supabaseKey)
}