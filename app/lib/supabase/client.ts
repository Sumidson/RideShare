import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/app/types/database'

export const createClient = () => createClientComponentClient<Database>()