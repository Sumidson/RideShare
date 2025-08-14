import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
})

export async function POST(request: NextRequest) {
  try {
    // Connect to the database first to ensure connection
    await prisma.$connect()
    
    const body = await request.json()
    const { email, password } = loginSchema.parse(body)

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user || !user.password) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    )

    // Create or update session
    await prisma.session.upsert({
      where: { id: user.id },
      update: {
        token,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      },
      create: {
        user_id: user.id,
        token,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    })

    // Return user data (without password) and token
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({ 
      message: 'Login successful',
      user: userWithoutPassword,
      token
    })
  } catch (error: unknown) {
    console.error('Login error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error' },
        { status: 400 }
      )
    }

    // More detailed error message for debugging
    const errorMessage = error instanceof Error ? error.message : 'An internal server error occurred';
    console.error('Detailed error:', errorMessage);

    return NextResponse.json(
      { error: 'An internal server error occurred', details: errorMessage },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}