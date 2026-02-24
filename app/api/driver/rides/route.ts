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

    return NextResponse.json({ rides })
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
