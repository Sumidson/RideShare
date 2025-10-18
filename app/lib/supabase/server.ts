import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from '@/app/types/database'

export const createServerClient = () => 
  createServerComponentClient<Database>({ cookies })