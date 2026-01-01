import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'
// import { verifyJWT } from '@/app/lib/auth'
import { z } from 'zod'
import { Prisma, BookingStatus } from '@prisma/client'

const createBookingSchema = z.object({
  ride_id: z.string().uuid(),
  seats_booked: z.number().min(1).max(8)
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

    // Validate the token with Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

    // Create Supabase client with the headers
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    })

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Invalid authentication token', details: authError?.message },
        { status: 401 }
      )
    }
    const userId = user.id

    // Ensure user exists in local database
    await prisma.user.upsert({
      where: { id: userId },
      update: {
        email: user.email!,
        full_name: user.user_metadata?.full_name,
        avatar_url: user.user_metadata?.avatar_url,
        username: user.user_metadata?.username,
      },
      create: {
        id: userId,
        email: user.email!,
        full_name: user.user_metadata?.full_name,
        avatar_url: user.user_metadata?.avatar_url,
        username: user.user_metadata?.username,
        email_verified: true,
      }
    })

    const body = await request.json()
    const bookingData = createBookingSchema.parse(body)

    // Check if ride exists and is active
    const ride = await prisma.ride.findUnique({
      where: { id: bookingData.ride_id },
      include: {
        bookings: {
          select: {
            seats_booked: true,
            status: true
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

    if (ride.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'Ride is not available for booking' },
        { status: 400 }
      )
    }

    // Check if user is trying to book their own ride
    if (ride.driver_id === userId) {
      return NextResponse.json(
        { error: 'Cannot book your own ride' },
        { status: 400 }
      )
    }

    // Calculate available seats
    const bookedSeats = ride.bookings
      .filter(booking => booking.status === 'CONFIRMED')
      .reduce((sum, booking) => sum + booking.seats_booked, 0)

    const availableSeats = ride.available_seats - bookedSeats

    if (bookingData.seats_booked > availableSeats) {
      return NextResponse.json(
        { error: `Only ${availableSeats} seats available` },
        { status: 400 }
      )
    }

    // Check if user already has a booking for this ride
    const existingBooking = await prisma.booking.findFirst({
      where: {
        ride_id: bookingData.ride_id,
        passenger_id: userId,
        status: {
          in: ['PENDING', 'CONFIRMED']
        }
      }
    })

    if (existingBooking) {
      return NextResponse.json(
        { error: 'You already have a booking for this ride' },
        { status: 400 }
      )
    }

    const totalPrice = bookingData.seats_booked * ride.price_per_seat

    const booking = await prisma.booking.create({
      data: {
        ride_id: bookingData.ride_id,
        passenger_id: userId,
        seats_booked: bookingData.seats_booked,
        total_price: totalPrice
      },
      include: {
        ride: {
          include: {
            driver: {
              select: {
                id: true,
                username: true,
                full_name: true,
                avatar_url: true,
                rating: true
              }
            }
          }
        },
        passenger: {
          select: {
            id: true,
            username: true,
            full_name: true,
            avatar_url: true
          }
        }
      }
    })

    return NextResponse.json({
      message: 'Booking created successfully',
      booking
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating booking:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        error: 'Failed to create booking',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Validate the token with Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    })

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Invalid authentication token', details: authError?.message },
        { status: 401 }
      )
    }
    const userId = user.id

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    const where: Prisma.BookingWhereInput = {
      passenger_id: userId
    }

    if (status && Object.values(BookingStatus).includes(status as BookingStatus)) {
      where.status = status as BookingStatus
    }

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        include: {
          ride: {
            include: {
              driver: {
                select: {
                  id: true,
                  username: true,
                  full_name: true,
                  avatar_url: true,
                  rating: true
                }
              }
            }
          }
        },
        orderBy: {
          created_at: 'desc'
        },
        skip,
        take: limit
      }),
      prisma.booking.count({ where })
    ])

    return NextResponse.json({
      bookings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    )
  }
} 