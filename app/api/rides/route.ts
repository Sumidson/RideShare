import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'
import { verifyJWT } from '@/app/lib/auth'
import { z } from 'zod'
import { Prisma } from '@prisma/client'

const createRideSchema = z.object({
  origin: z.string().min(1, "Origin is required"),
  destination: z.string().min(1, "Destination is required"),
  departure_time: z.string(),
  available_seats: z.number().min(1, "At least 1 seat required"),
  price_per_seat: z.number().min(0, "Price must be positive"),
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

    const where: Prisma.RideWhereInput = {
      status: 'ACTIVE'
    }

    if (query.origin) {
      where.origin = { contains: query.origin }
    }

    if (query.destination) {
      where.destination = { contains: query.destination }
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
            where: {
              status: 'CONFIRMED'
            },
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
      const bookedSeats = ride.bookings.reduce((sum: number, booking: { seats_booked: number }) => sum + booking.seats_booked, 0)
      return {
        id: ride.id,
        driver_id: ride.driver_id,
        origin: ride.origin,
        destination: ride.destination,
        departure_time: ride.departure_time,
        available_seats: ride.available_seats - bookedSeats,
        price_per_seat: ride.price_per_seat,
        description: ride.description,
        status: ride.status,
        created_at: ride.created_at,
        updated_at: ride.updated_at,
        driver: ride.driver
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
        { error: 'Validation error', details: error.issues },
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
    console.log('Create ride POST request received') // Debug log
    
    const authHeader = request.headers.get('authorization')
    console.log('Auth header present:', !!authHeader) // Debug log
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('No valid authorization header')
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    console.log('Token extracted, length:', token.length) // Debug log

    const decoded = verifyJWT(token)
    console.log('Token decoded:', !!decoded, decoded?.userId) // Debug log
    
    if (!decoded || !decoded.userId) {
      console.log('Token verification failed')
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    const body = await request.json()
    console.log('Request body received:', Object.keys(body)) // Debug log
    
    const rideData = createRideSchema.parse(body)
    console.log('Data validated successfully') // Debug log

    const ride = await prisma.ride.create({
      data: {
        driver_id: decoded.userId,
        origin: rideData.origin,
        destination: rideData.destination,
        departure_time: new Date(rideData.departure_time),
        available_seats: rideData.available_seats,
        price_per_seat: rideData.price_per_seat,
        description: rideData.description,
        status: 'ACTIVE' // Add default status
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

    console.log('Ride created successfully:', ride.id) // Debug log

    return NextResponse.json({
      message: 'Ride created successfully',
      ride
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating ride:', error)
    
    if (error instanceof z.ZodError) {
      console.error('Validation error details:', error.issues)
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
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
      
      // Handle Prisma constraint errors
      if (error.message.includes('Unique constraint')) {
        return NextResponse.json(
          { error: 'A ride with similar details already exists' },
          { status: 409 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Failed to create ride', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
