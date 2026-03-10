import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'
import { z } from 'zod'

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

const bodySchema = z.object({ otp: z.string().min(1) })

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await getDriverId(request)
    if ('error' in auth) return auth.error
    const { id } = await params

    const body = await request.json().catch(() => ({}))
    const parsed = bodySchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'otp is required' }, { status: 400 })
    }
    const otp = String(parsed.data.otp).trim()

    const ride = await prisma.ride.findUnique({
      where: { id },
      select: { id: true, driver_id: true, start_otp: true },
    })
    if (!ride) {
      return NextResponse.json({ error: 'Ride not found' }, { status: 404 })
    }
    if (ride.driver_id !== auth.driverId) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
    }
    if (!ride.start_otp) {
      return NextResponse.json({ error: 'Ride has not been started' }, { status: 400 })
    }
    if (ride.start_otp !== otp) {
      return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 })
    }

    await prisma.ride.update({
      where: { id },
      data: { otp_verified_at: new Date() },
    })

    return NextResponse.json({ verified: true })
  } catch (err) {
    console.error('Error verifying OTP:', err)
    return NextResponse.json(
      { error: 'Failed to verify OTP', details: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
