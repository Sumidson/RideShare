import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('--- Supabase Config Check ---')
console.log('URL:', supabaseUrl)
console.log('Key (start):', supabaseAnonKey?.substring(0, 10))
console.log('Key (length):', supabaseAnonKey?.length)
console.log('-----------------------------')

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase credentials. Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in your .env or .env.local file.')
}

// Basic format validation
if (!supabaseUrl.startsWith('http')) {
  console.error('WARNING: NEXT_PUBLIC_SUPABASE_URL should start with http:// or https://')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)