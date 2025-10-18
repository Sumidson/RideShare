import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'
import { z } from 'zod'
import { createClient } from '@supabase/supabase-js' // Added Supabase client

const updateRideSchema = z.object({
  origin: z.string().min(1).optional(),
  destination: z.string().min(1).optional(),
  departure_time: z.string().optional(),
  available_seats: z.number().min(0).max(8).optional(), // Changed min to 0 to allow setting seats to 0
  price_per_seat: z.number().min(0).optional(),
  description: z.string().optional(),
  status: z.enum(['ACTIVE', 'CANCELLED', 'COMPLETED', 'IN_PROGRESS']).optional()
})

// GET function is unchanged, it's correct for a public endpoint.
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const ride = await prisma.ride.findUnique({
      where: { id },
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
    const bookedSeats = ride.bookings.reduce((sum: number, booking: { seats_booked: number }) => sum + booking.seats_booked, 0)
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

// --- UPDATED PUT FUNCTION ---
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const token = request.headers.get('authorization')?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Authenticate with Supabase
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      }
    );
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Invalid or expired token', details: authError?.message },
        { status: 401 }
      )
    }

    // Check if user owns the ride
    const existingRide = await prisma.ride.findUnique({
      where: { id: id },
      select: { driver_id: true }
    })

    if (!existingRide) {
      return NextResponse.json(
        { error: 'Ride not found' },
        { status: 404 }
      )
    }

    if (existingRide.driver_id !== user.id) {
      return NextResponse.json(
        { error: 'Not authorized to update this ride' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const updateData = updateRideSchema.parse(body)

    // Convert departure_time string to Date for database if provided
    const dataForUpdate: Record<string, unknown> = { ...updateData }
    if (updateData.departure_time) {
      dataForUpdate.departure_time = new Date(updateData.departure_time)
    }

    const ride = await prisma.ride.update({
      where: { id: id },
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

// --- UPDATED DELETE FUNCTION ---
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const token = request.headers.get('authorization')?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Authenticate with Supabase
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      }
    );
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Invalid or expired token', details: authError?.message },
        { status: 401 }
      )
    }

    // Check if user owns the ride
    const existingRide = await prisma.ride.findUnique({
      where: { id: id },
      select: { driver_id: true, bookings: { where: { status: 'CONFIRMED' }, select: { id: true } } }
    })

    if (!existingRide) {
      return NextResponse.json(
        { error: 'Ride not found' },
        { status: 404 }
      )
    }

    if (existingRide.driver_id !== user.id) {
      return NextResponse.json(
        { error: 'Not authorized to delete this ride' },
        { status: 403 }
      )
    }

    // Check if there are any confirmed bookings
    if (existingRide.bookings.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete ride with confirmed bookings. Please cancel bookings first.' },
        { status: 400 }
      )
    }

    await prisma.ride.delete({
      where: { id: id }
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
