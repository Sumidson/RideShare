import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'
import { verifyJWT } from '@/app/lib/auth'
import { z } from 'zod'

const createReviewSchema = z.object({
  reviewed_user_id: z.string().uuid(),
  ride_id: z.string().uuid(),
  rating: z.number().min(1).max(5),
  comment: z.string().max(500).optional()
})

export async function POST(request: NextRequest) {
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
    const reviewData = createReviewSchema.parse(body)

    // Check if user is trying to review themselves
    if (reviewData.reviewed_user_id === decoded.userId) {
      return NextResponse.json(
        { error: 'Cannot review yourself' },
        { status: 400 }
      )
    }

    // Check if ride exists and user participated in it
    const ride = await prisma.ride.findUnique({
      where: { id: reviewData.ride_id },
      include: {
        bookings: {
          where: {
            passenger_id: decoded.userId
          }
        }
      }
    })

    if (!ride) {
      return NextResponse.json(
        { error: 'Ride not found' },
        { status: 404 }
      )
    }

    // Check if user participated in this ride (as driver or passenger)
    const isDriver = ride.driver_id === decoded.userId
    const isPassenger = ride.bookings.length > 0

    if (!isDriver && !isPassenger) {
      return NextResponse.json(
        { error: 'You must participate in the ride to review' },
        { status: 403 }
      )
    }

    // Check if user already reviewed this person for this ride
    const existingReview = await prisma.review.findFirst({
      where: {
        ride_id: reviewData.ride_id,
        reviewer_id: decoded.userId,
        reviewed_user_id: reviewData.reviewed_user_id
      }
    })

    if (existingReview) {
      return NextResponse.json(
        { error: 'You already reviewed this user for this ride' },
        { status: 400 }
      )
    }

    const review = await prisma.review.create({
      data: {
        reviewer_id: decoded.userId,
        reviewed_user_id: reviewData.reviewed_user_id,
        ride_id: reviewData.ride_id,
        rating: reviewData.rating,
        comment: reviewData.comment
      },
      include: {
        reviewer: {
          select: {
            id: true,
            username: true,
            full_name: true,
            avatar_url: true
          }
        },
        reviewed_user: {
          select: {
            id: true,
            username: true,
            full_name: true,
            avatar_url: true
          }
        }
      }
    })

    // Update the reviewed user's average rating
    const userReviews = await prisma.review.findMany({
      where: { reviewed_user_id: reviewData.reviewed_user_id },
      select: { rating: true }
    })

    const averageRating = userReviews.reduce((sum, r) => sum + r.rating, 0) / userReviews.length

    await prisma.user.update({
      where: { id: reviewData.reviewed_user_id },
      data: { rating: averageRating }
    })

    return NextResponse.json({
      message: 'Review created successfully',
      review
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating review:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('user_id')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const where = {
      reviewed_user_id: userId
    }

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        include: {
          reviewer: {
            select: {
              id: true,
              username: true,
              full_name: true,
              avatar_url: true
            }
          }
        },
        orderBy: {
          created_at: 'desc'
        },
        skip,
        take: limit
      }),
      prisma.review.count({ where })
    ])

    return NextResponse.json({
      reviews,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    )
  }
} 