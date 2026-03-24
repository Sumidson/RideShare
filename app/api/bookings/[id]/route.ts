import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'
import { z } from 'zod'
import { promoteWaitlistedBookings } from '@/app/lib/waitlist'

const updateBookingSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'WAITLISTED', 'CANCELLED', 'COMPLETED'])
})

async function getUserFromToken(token: string | null) {
  if (!token) return null
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  const { createClient } = await import('@supabase/supabase-js')
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  })
  const { data: { user }, error } = await supabase.auth.getUser()
  return error || !user ? null : user
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    const user = await getUserFromToken(token ?? null)
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const booking = await prisma.booking.findUnique({
      where: { id: id },
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
    if (booking.passenger_id !== user.id && booking.ride.driver_id !== user.id) {
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    const user = await getUserFromToken(token ?? null)
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const booking = await prisma.booking.findUnique({
      where: { id: id },
      include: {
        ride: {
          select: {
            driver_id: true,
            available_seats: true,
            bookings: {
              where: {
                status: 'CONFIRMED',
                id: { not: id }
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
    if (booking.ride.driver_id !== user.id) {
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
      where: { id: id },
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

    if (updateData.status === 'CANCELLED') {
      await promoteWaitlistedBookings(updatedBooking.ride_id)
    }

    return NextResponse.json({
      message: 'Booking updated successfully',
      booking: updatedBooking
    })
  } catch (error) {
    console.error('Error updating booking:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    const user = await getUserFromToken(token ?? null)
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const booking = await prisma.booking.findUnique({
      where: { id: id },
      select: {
        id: true,
        ride_id: true,
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
    if (booking.passenger_id !== user.id) {
      return NextResponse.json(
        { error: 'Not authorized to cancel this booking' },
        { status: 403 }
      )
    }

    // Allow passenger cancellation for pending, waitlisted, or confirmed bookings
    if (!['PENDING', 'WAITLISTED', 'CONFIRMED'].includes(booking.status)) {
      return NextResponse.json(
        { error: 'This booking can no longer be cancelled' },
        { status: 400 }
      )
    }

    await prisma.booking.delete({
      where: { id: id }
    })

    await promoteWaitlistedBookings(booking.ride_id)

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