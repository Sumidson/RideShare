import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    })

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Invalid authentication token', details: authError?.message },
        { status: 401 }
      )
    }

    const rides = await prisma.ride.findMany({
      where: { driver_id: user.id },
      include: {
        bookings: {
          include: {
            passenger: {
              select: {
                id: true,
                full_name: true,
                username: true,
                email: true,
                avatar_url: true,
              },
            },
          },
        },
      },
      orderBy: {
        departure_time: 'desc',
      },
    })

    // Omit start_otp so driver never sees OTP; build explicit objects for reliable response
    const rideWithOtpFields = (r: (typeof rides)[0]) =>
      r as (typeof r) & { started_at?: Date | null; otp_verified_at?: Date | null }
    const ridesForDriver = rides.map((ride) => {
      const r = rideWithOtpFields(ride)
      return {
        id: ride.id,
        driver_id: ride.driver_id,
        origin: ride.origin,
        destination: ride.destination,
        departure_time: ride.departure_time,
        available_seats: ride.available_seats,
        price_per_seat: ride.price_per_seat,
        description: ride.description,
        status: ride.status,
        created_at: ride.created_at,
        updated_at: ride.updated_at,
        started_at: r.started_at,
        otp_verified_at: r.otp_verified_at,
        bookings: ride.bookings,
      }
    })
    return NextResponse.json({ rides: ridesForDriver })
  } catch (error) {
    console.error('Error fetching driver rides:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch rides',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
