import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'
import { verifyJWT } from '@/app/lib/auth'
import { z } from 'zod' // Fixed: was importing from 'z' instead of 'zod'

const createRideSchema = z.object({
  origin: z.string().min(1, "Origin is required"),
  destination: z.string().min(1, "Destination is required"),
  departure_time: z.string().datetime(),
  available_seats: z.number().min(1).max(8),
  price_per_seat: z.number().min(0),
  description: z.string().optional()
})

const getRidesSchema = z.object({
  origin: z.string().optional(),
  destination: z.string().optional(),
  date: z.string().optional(),
  page: z.string().optional(),
  limit: z.string().optional()
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = getRidesSchema.parse({
      origin: searchParams.get('origin'),
      destination: searchParams.get('destination'),
      date: searchParams.get('date'),
      page: searchParams.get('page'),
      limit: searchParams.get('limit')
    })

    const page = parseInt(query.page || '1')
    const limit = parseInt(query.limit || '10')
    const skip = (page - 1) * limit

    const where: any = {
      status: 'ACTIVE'
    }

    if (query.origin) {
      where.origin = { contains: query.origin, mode: 'insensitive' }
    }

    if (query.destination) {
      where.destination = { contains: query.destination, mode: 'insensitive' }
    }

    if (query.date) {
      const date = new Date(query.date)
      const nextDay = new Date(date)
      nextDay.setDate(nextDay.getDate() + 1)
      
      where.departure_time = {
        gte: date,
        lt: nextDay
      }
    }

    const [rides, total] = await Promise.all([
      prisma.ride.findMany({
        where,
        include: {
          driver: {
            select: {
              id: true,
              username: true,
              full_name: true,
              avatar_url: true,
              rating: true,
              total_rides: true
            }
          },
          bookings: {
            select: {
              seats_booked: true
            }
          }
        },
        orderBy: {
          departure_time: 'asc'
        },
        skip,
        take: limit
      }),
      prisma.ride.count({ where })
    ])

    const ridesWithAvailableSeats = rides.map(ride => {
      const bookedSeats = ride.bookings.reduce((sum, booking) => sum + booking.seats_booked, 0)
      return {
        ...ride,
        available_seats: ride.available_seats - bookedSeats,
        bookings: undefined // Remove bookings from response
      }
    })

    return NextResponse.json({
      rides: ridesWithAvailableSeats,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching rides:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }
    
    // Handle specific database connection errors
    if (error instanceof Error) {
      if (error.message.includes('connect') || error.message.includes('database')) {
        return NextResponse.json(
          { error: 'Database connection error. Please try again later.' },
          { status: 503 }
        )
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch rides' },
      { status: 500 }
    )
  }
}

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
    const rideData = createRideSchema.parse(body)

    const ride = await prisma.ride.create({
      data: {
        driver_id: decoded.userId,
        origin: rideData.origin,
        destination: rideData.destination,
        departure_time: new Date(rideData.departure_time),
        available_seats: rideData.available_seats,
        price_per_seat: rideData.price_per_seat,
        description: rideData.description
      },
      include: {
        driver: {
          select: {
            id: true,
            username: true,
            full_name: true,
            avatar_url: true,
            rating: true,
            total_rides: true
          }
        }
      }
    })

    return NextResponse.json({
      message: 'Ride created successfully',
      ride
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating ride:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }
    
    // Handle specific database connection errors
    if (error instanceof Error) {
      if (error.message.includes('connect') || error.message.includes('database')) {
        return NextResponse.json(
          { error: 'Database connection error. Please try again later.' },
          { status: 503 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Failed to create ride' },
      { status: 500 }
    )
  }
}
