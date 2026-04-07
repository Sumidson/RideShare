import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'
import { z } from 'zod'

const bodySchema = z.object({
  ride_id: z.string().uuid(),
  seats_booked: z.number().int().min(1).max(8),
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

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '') ?? null
    const user = await getUserFromToken(token)
    if (!user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 })

    const body = await request.json()
    const parsed = bodySchema.parse(body)

    const ride = await prisma.ride.findUnique({
      where: { id: parsed.ride_id },
      select: { id: true, driver_id: true, price_per_seat: true, status: true },
    })
    if (!ride) return NextResponse.json({ error: 'Ride not found' }, { status: 404 })
    if (ride.status !== 'ACTIVE') return NextResponse.json({ error: 'Ride is not available' }, { status: 400 })
    if (ride.driver_id === user.id) return NextResponse.json({ error: 'Cannot book your own ride' }, { status: 400 })

    const amountPaise = Math.round(parsed.seats_booked * ride.price_per_seat * 100)
    if (amountPaise <= 0) return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })

    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID
    const keySecret = process.env.RAZORPAY_KEY_SECRET
    if (!keyId || !keySecret) {
      return NextResponse.json({ error: 'Razorpay is not configured' }, { status: 500 })
    }

    const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64')
    const receipt = `ride_${ride.id}_user_${user.id}_${Date.now()}`

    const res = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amountPaise,
        currency: 'INR',
        receipt,
        notes: {
          ride_id: ride.id,
          user_id: user.id,
          seats_booked: String(parsed.seats_booked),
        },
      }),
    })

    const json = await res.json().catch(() => null)
    if (!res.ok) {
      return NextResponse.json(
        { error: 'Failed to create Razorpay order', details: json },
        { status: 502 },
      )
    }

    return NextResponse.json({
      key_id: keyId,
      order: json,
      amount: amountPaise,
      currency: 'INR',
    })
  } catch (error) {
    console.error('Error creating payment order:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.issues }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to create payment order' }, { status: 500 })
  }
}

