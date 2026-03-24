import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'

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

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    const user = await getUserFromToken(token ?? null)
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        ride: {
          select: {
            id: true,
            status: true,
            driver_marked_complete_at: true,
            bookings: {
              where: { status: { in: ['CONFIRMED', 'COMPLETED'] } },
              select: { id: true, status: true },
            },
          },
        },
      },
    })

    if (!booking) return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    if (booking.passenger_id !== user.id) {
      return NextResponse.json({ error: 'Not authorized to confirm completion' }, { status: 403 })
    }
    if (!booking.ride.driver_marked_complete_at) {
      return NextResponse.json({ error: 'Driver has not marked ride complete yet' }, { status: 400 })
    }
    if (!['CONFIRMED', 'COMPLETED'].includes(booking.status)) {
      return NextResponse.json({ error: 'This booking cannot be marked complete' }, { status: 400 })
    }

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: {
        status: 'COMPLETED',
        passenger_confirmed_completed_at: booking.passenger_confirmed_completed_at ?? new Date(),
      },
      include: {
        ride: {
          include: {
            driver: {
              select: { id: true, full_name: true, username: true, avatar_url: true, rating: true },
            },
            bookings: {
              where: { status: { in: ['CONFIRMED', 'COMPLETED'] } },
              select: { id: true, status: true },
            },
          },
        },
      },
    })

    // If all active bookings are completed, finalize ride status as COMPLETED
    const remainingUncompleted = updatedBooking.ride.bookings.filter((b) => b.status === 'CONFIRMED').length
    if (remainingUncompleted === 0 && updatedBooking.ride.status !== 'COMPLETED') {
      await prisma.ride.update({
        where: { id: updatedBooking.ride.id },
        data: { status: 'COMPLETED' },
      })
    }

    return NextResponse.json({
      message: 'Booking completion confirmed',
      booking: updatedBooking,
    })
  } catch (error) {
    console.error('Error confirming booking completion:', error)
    return NextResponse.json({ error: 'Failed to confirm completion' }, { status: 500 })
  }
}
