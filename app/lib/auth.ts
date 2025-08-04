import { prisma } from './prisma'
import { supabaseAdmin } from './supabase/admin'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 12)
}

export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword)
}

export const generateJWT = (payload: any): string => {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '7d' })
}

export const verifyJWT = (token: string): any => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!)
  } catch (error) {
    return null
  }
}

export const createUserSession = async (userId: string) => {
  const token = generateJWT({ userId })
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 7) // 7 days

  const session = await prisma.session.create({
    data: {
      user_id: userId,
      token,
      expires_at: expiresAt
    }
  })

  return session
}

export const syncUserWithSupabase = async (user: any) => {
  try {
    // Create or update user in Prisma
    const dbUser = await prisma.user.upsert({
      where: { id: user.id },
      update: {
        email: user.email,
        username: user.user_metadata?.username,
        full_name: user.user_metadata?.full_name,
        avatar_url: user.user_metadata?.avatar_url,
        email_verified: user.email_confirmed_at ? true : false,
        updated_at: new Date()
      },
      create: {
        id: user.id,
        email: user.email,
        username: user.user_metadata?.username,
        full_name: user.user_metadata?.full_name,
        avatar_url: user.user_metadata?.avatar_url,
        email_verified: user.email_confirmed_at ? true : false
      }
    })

    return dbUser
  } catch (error) {
    console.error('Error syncing user:', error)
    throw error
  }
}