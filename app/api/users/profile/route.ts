import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'
import { verifyJWT } from '@/app/lib/auth'
import { z } from 'zod'

const updateProfileSchema = z.object({
  username: z.string().min(3).max(20).optional(),
  full_name: z.string().min(1).max(100).optional(),
  phone: z.string().optional(),
  bio: z.string().max(500).optional(),
  avatar_url: z.string().url().optional()
})

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const decoded = verifyJWT(token)
    if (!decoded?.userId) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        username: true,
        full_name: true,
        avatar_url: true,
        phone: true,
        bio: true,
        rating: true,
        total_rides: true,
        is_verified: true,
        email_verified: true,
        created_at: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user profile' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const decoded = verifyJWT(token)
    if (!decoded?.userId) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const updateData = updateProfileSchema.parse(body)

    // Check if username is already taken
    if (updateData.username) {
      const existingUser = await prisma.user.findFirst({
        where: {
          username: updateData.username,
          id: { not: decoded.userId }
        }
      })

      if (existingUser) {
        return NextResponse.json(
          { error: 'Username already taken' },
          { status: 400 }
        )
      }
    }

    const user = await prisma.user.update({
      where: { id: decoded.userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        username: true,
        full_name: true,
        avatar_url: true,
        phone: true,
        bio: true,
        rating: true,
        total_rides: true,
        is_verified: true,
        email_verified: true,
        created_at: true
      }
    })

    return NextResponse.json({
      message: 'Profile updated successfully',
      user
    })
  } catch (error) {
    console.error('Error updating user profile:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
} 