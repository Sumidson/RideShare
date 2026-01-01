// lib/supabaseClient.ts

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase URL or Anon Key in .env.local')
}

// The 'createClient' function is already typed by the Supabase library,
// so you get full type safety and autocompletion automatically.
export const supabase = createClient(supabaseUrl, supabaseAnonKey)