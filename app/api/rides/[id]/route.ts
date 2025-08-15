import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'
import { verifyJWT } from '@/app/lib/auth'
import { z } from 'zod'

const updateRideSchema = z.object({
  origin: z.string().min(1).optional(),
  destination: z.string().min(1).optional(),
  departure_time: z.string().datetime().optional(),
  available_seats: z.number().min(1).max(8).optional(),
  price_per_seat: z.number().min(0).optional(),
  description: z.string().optional(),
  status: z.enum(['ACTIVE', 'CANCELLED', 'COMPLETED', 'IN_PROGRESS']).optional()
})

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ride = await prisma.ride.findUnique({
      where: { id: params.id },
      include: {
        driver: {
          select: {
            id: true,
            username: true,
            full_name: true,
            avatar_url: true,
            rating: true,
            total_rides: true,
            phone: true
          }
        },
        bookings: {
          include: {
            passenger: {
              select: {
                id: true,
                username: true,
                full_name: true,
                avatar_url: true
              }
            }
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

    // Calculate available seats
    const bookedSeats = ride.bookings.reduce((sum, booking) => sum + booking.seats_booked, 0)
    const availableSeats = ride.available_seats - bookedSeats

    return NextResponse.json({
      ...ride,
      available_seats: availableSeats
    })
  } catch (error) {
    console.error('Error fetching ride:', error)
    return NextResponse.json(
      { error: 'Failed to fetch ride' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Check if user owns the ride
    const existingRide = await prisma.ride.findUnique({
      where: { id: params.id },
      select: { driver_id: true }
    })

    if (!existingRide) {
      return NextResponse.json(
        { error: 'Ride not found' },
        { status: 404 }
      )
    }

    if (existingRide.driver_id !== decoded.userId) {
      return NextResponse.json(
        { error: 'Not authorized to update this ride' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const updateData = updateRideSchema.parse(body)

    // Convert departure_time string to Date for database if provided
    const dataForUpdate = { ...updateData }
    if (updateData.departure_time) {
      dataForUpdate.departure_time = new Date(updateData.departure_time)
    }

    const ride = await prisma.ride.update({
      where: { id: params.id },
      data: dataForUpdate,
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
      message: 'Ride updated successfully',
      ride
    })
  } catch (error) {
    console.error('Error updating ride:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update ride' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Check if user owns the ride
    const existingRide = await prisma.ride.findUnique({
      where: { id: params.id },
      select: { driver_id: true, bookings: { select: { id: true } } }
    })

    if (!existingRide) {
      return NextResponse.json(
        { error: 'Ride not found' },
        { status: 404 }
      )
    }

    if (existingRide.driver_id !== decoded.userId) {
      return NextResponse.json(
        { error: 'Not authorized to delete this ride' },
        { status: 403 }
      )
    }

    // Check if there are any confirmed bookings
    const hasConfirmedBookings = existingRide.bookings.length > 0

    if (hasConfirmedBookings) {
      return NextResponse.json(
        { error: 'Cannot delete ride with confirmed bookings' },
        { status: 400 }
      )
    }

    await prisma.ride.delete({
      where: { id: params.id }
    })

    return NextResponse.json({
      message: 'Ride deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting ride:', error)
    return NextResponse.json(
      { error: 'Failed to delete ride' },
      { status: 500 }
    )
  }
} 