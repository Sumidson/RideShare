import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { z } from 'zod'

const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  username: z.string().optional(),
  full_name: z.string().optional()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, username, full_name } = signUpSchema.parse(body)

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          ...(username ? [{ username }] : [])
        ]
      }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email or username already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user with type assertion
    const user = await prisma.user.create({
      data: {
        email,
        username,
        full_name,
        password: hashedPassword,
        email_verified: false,
        is_verified: false
      } as any
    })

    // Create JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    )

    // Create session
    await prisma.session.create({
      data: {
        user_id: user.id,
        token,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      }
    })

    // Return user data (without password) and token
    const { password: _, ...userWithoutPassword } = user as any

    return NextResponse.json({ 
      message: 'User created successfully',
      user: userWithoutPassword,
      token
    })
  } catch (error: unknown) {
    console.error('Signup error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: (error as z.ZodError).errors },
        { status: 400 }
      )
    }

    let errorMessage = 'An internal server error occurred';
    
    if (error instanceof Error) {
      errorMessage = error.message;
    }
  
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}