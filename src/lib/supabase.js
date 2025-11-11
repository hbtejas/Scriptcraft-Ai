import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

console.log('🔧 Supabase Configuration:')
console.log('  URL:', supabaseUrl)
console.log('  Key exists:', !!supabaseAnonKey)
console.log('  Key length:', supabaseAnonKey?.length || 0)

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables!')
  console.error('  URL missing:', !supabaseUrl)
  console.error('  Key missing:', !supabaseAnonKey)
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

console.log('✅ Supabase client initialized successfully')

// Database Types
export const TABLES = {
  PODCAST_SCRIPTS: 'podcast_scripts'
}

// Helper function to handle Supabase errors
export const handleSupabaseError = (error) => {
  console.error('Supabase error:', error)
  return {
    error: true,
    message: error?.error_description || error?.message || 'An unexpected error occurred'
  }
}
