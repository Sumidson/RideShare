import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'
import { verifyJWT } from '@/app/lib/auth'
import { z } from 'zod'

const updateBookingSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'])
})

export async function GET(
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

    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: {
        ride: {
          include: {
            driver: {
              select: {
                id: true,
                username: true,
                full_name: true,
                avatar_url: true,
                rating: true,
                phone: true
              }
            }
          }
        },
        passenger: {
          select: {
            id: true,
            username: true,
            full_name: true,
            avatar_url: true,
            phone: true
          }
        }
      }
    })

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    // Check if user is authorized to view this booking
    if (booking.passenger_id !== decoded.userId && booking.ride.driver_id !== decoded.userId) {
      return NextResponse.json(
        { error: 'Not authorized to view this booking' },
        { status: 403 }
      )
    }

    return NextResponse.json({ booking })
  } catch (error) {
    console.error('Error fetching booking:', error)
    return NextResponse.json(
      { error: 'Failed to fetch booking' },
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

    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: {
        ride: {
          select: {
            driver_id: true,
            available_seats: true,
            bookings: {
              where: {
                status: 'CONFIRMED',
                id: { not: params.id }
              },
              select: {
                seats_booked: true
              }
            }
          }
        }
      }
    })

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    // Only the driver can confirm/cancel bookings
    if (booking.ride.driver_id !== decoded.userId) {
      return NextResponse.json(
        { error: 'Only the driver can update booking status' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const updateData = updateBookingSchema.parse(body)

    // If confirming a booking, check seat availability
    if (updateData.status === 'CONFIRMED') {
      const bookedSeats = booking.ride.bookings.reduce((sum, b) => sum + b.seats_booked, 0)
      const availableSeats = booking.ride.available_seats - bookedSeats

      if (booking.seats_booked > availableSeats) {
        return NextResponse.json(
          { error: `Only ${availableSeats} seats available` },
          { status: 400 }
        )
      }
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: params.id },
      data: { status: updateData.status },
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
      message: 'Booking updated successfully',
      booking: updatedBooking
    })
  } catch (error) {
    console.error('Error updating booking:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update booking' },
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

    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
      select: {
        passenger_id: true,
        status: true
      }
    })

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    // Only the passenger can cancel their own booking
    if (booking.passenger_id !== decoded.userId) {
      return NextResponse.json(
        { error: 'Not authorized to cancel this booking' },
        { status: 403 }
      )
    }

    // Only allow cancellation of pending bookings
    if (booking.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'Can only cancel pending bookings' },
        { status: 400 }
      )
    }

    await prisma.booking.delete({
      where: { id: params.id }
    })

    return NextResponse.json({
      message: 'Booking cancelled successfully'
    })
  } catch (error) {
    console.error('Error cancelling booking:', error)
    return NextResponse.json(
      { error: 'Failed to cancel booking' },
      { status: 500 }
    )
  }
} 