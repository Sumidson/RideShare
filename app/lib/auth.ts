import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'
import { User } from '@supabase/supabase-js'

const prisma = new PrismaClient()

// Define interface for JWT payload
interface JWTPayload {
  userId: string
  email: string
  [key: string]: string | number | boolean | undefined
}

export function verifyJWT(token: string): JWTPayload | null {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined')
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JWTPayload
    console.log('JWT decoded successfully:', decoded) // Debug log
    
    return decoded
  } catch (error) {
    console.error('JWT verification failed:', error)
    return null
  }
}

export function signJWT(payload: JWTPayload): string {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined')
  }
  
  return jwt.sign(payload, process.env.JWT_SECRET, { 
    expiresIn: '7d' 
  })
}

export async function syncUserWithSupabase(supabaseUser: User) {
  try {
    // Check if user already exists in local database
    const existingUser = await prisma.user.findUnique({
      where: { id: supabaseUser.id }
    })

    if (existingUser) {
      // Update existing user with latest Supabase data
      return await prisma.user.update({
        where: { id: supabaseUser.id },
        data: {
          email: supabaseUser.email || existingUser.email,
          full_name: supabaseUser.user_metadata?.full_name || existingUser.full_name,
          avatar_url: supabaseUser.user_metadata?.avatar_url || existingUser.avatar_url,
          email_verified: supabaseUser.email_confirmed_at ? true : false,
          updated_at: new Date()
        }
      })
    } else {
      // Create new user in local database
      return await prisma.user.create({
        data: {
          id: supabaseUser.id,
          email: supabaseUser.email!,
          full_name: supabaseUser.user_metadata?.full_name || null,
          avatar_url: supabaseUser.user_metadata?.avatar_url || null,
          email_verified: supabaseUser.email_confirmed_at ? true : false,
          username: supabaseUser.user_metadata?.username || null,
          phone: supabaseUser.user_metadata?.phone || null
        }
      })
    }
  } catch (error) {
    console.error('Error syncing user with Supabase:', error)
    throw error
  }
}
