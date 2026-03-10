import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'

async function getDriverId(request: NextRequest): Promise<{ driverId: string } | { error: NextResponse }> {
  const token = request.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) {
    return { error: NextResponse.json({ error: 'Authentication required' }, { status: 401 }) }
  }
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  const { createClient } = await import('@supabase/supabase-js')
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  })
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) {
    return { error: NextResponse.json({ error: 'Invalid authentication token' }, { status: 401 }) }
  }
  return { driverId: user.id }
}

function generateOtp(): string {
  return String(Math.floor(100000 + Math.random() * 900000))
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await getDriverId(request)
    if ('error' in auth) return auth.error
    const { id } = await params

    const ride = await prisma.ride.findUnique({
      where: { id },
      select: { id: true, driver_id: true, status: true },
    })
    if (!ride) {
      return NextResponse.json({ error: 'Ride not found' }, { status: 404 })
    }
    if (ride.driver_id !== auth.driverId) {
      return NextResponse.json({ error: 'Not authorized to start this ride' }, { status: 403 })
    }
    if (ride.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'Ride can only be started when status is ACTIVE' },
        { status: 400 }
      )
    }

    const otp = generateOtp()
    const now = new Date()
    const updated = await prisma.ride.update({
      where: { id },
      data: {
        start_otp: otp,
        started_at: now,
        status: 'IN_PROGRESS',
      },
      include: {
        driver: {
          select: {
            id: true,
            full_name: true,
            username: true,
            email: true,
          },
        },
        bookings: {
          include: {
            passenger: {
              select: {
                id: true,
                full_name: true,
                username: true,
                email: true,
              },
            },
          },
        },
      },
    })

    return NextResponse.json({ otp, ride: updated })
  } catch (err) {
    console.error('Error starting ride:', err)
    return NextResponse.json(
      { error: 'Failed to start ride', details: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
