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
      select: { id: true, driver_id: true, status: true, otp_verified_at: true, driver_marked_complete_at: true },
    })
    if (!ride) return NextResponse.json({ error: 'Ride not found' }, { status: 404 })
    if (ride.driver_id !== auth.driverId) return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
    if (ride.status !== 'IN_PROGRESS') {
      return NextResponse.json({ error: 'Ride must be in progress to complete' }, { status: 400 })
    }
    if (!ride.otp_verified_at) {
      return NextResponse.json({ error: 'Verify OTP before completing ride' }, { status: 400 })
    }

    const updated = await prisma.ride.update({
      where: { id },
      data: { driver_marked_complete_at: ride.driver_marked_complete_at ?? new Date() },
      include: { bookings: true },
    })

    return NextResponse.json({ message: 'Ride marked complete by driver', ride: updated })
  } catch (error) {
    console.error('Error marking ride complete:', error)
    return NextResponse.json(
      { error: 'Failed to mark ride complete' },
      { status: 500 }
    )
  }
}
