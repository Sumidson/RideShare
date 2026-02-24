import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'

// Helper to create an authenticated Supabase client from a bearer token
async function getUserFromToken(token: string | null) {
  if (!token) return { user: null, error: 'Authentication required' as const }

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

  const { data, error } = await supabase.auth.getUser()
  if (error || !data.user) {
    return { user: null, error: error?.message ?? 'Invalid authentication token' }
  }
  return { user: data.user, error: null }
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')

    const { user, error } = await getUserFromToken(token ?? null)
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required', details: error },
        { status: 401 },
      )
    }

    let dbUser = await prisma.user.findUnique({
      where: { id: user.id },
    })

    // Auto-provision a basic user row if missing
    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          id: user.id,
          email: user.email ?? '',
          email_verified: !!user.email_confirmed_at,
          is_verified: false,
        },
      })
    }

    const {
      full_name,
      avatar_url,
      phone,
      bio,
      is_driver,
      driver_verified,
      car_make,
      car_model,
      car_year,
      car_color,
      car_plate,
      car_photo_url,
    } = dbUser

    return NextResponse.json({
      full_name,
      avatar_url,
      phone,
      bio,
      is_driver,
      driver_verified,
      car_make,
      car_model,
      car_year,
      car_color,
      car_plate,
      car_photo_url,
    })
  } catch (error) {
    console.error('Error fetching driver profile:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch driver profile',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')

    const { user, error } = await getUserFromToken(token ?? null)
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required', details: error },
        { status: 401 },
      )
    }

    const body = await request.json()
    const {
      full_name,
      phone,
      bio,
      avatar_url,
      car_make,
      car_model,
      car_year,
      car_color,
      car_plate,
      car_photo_url,
      accept_terms,
    } = body as {
      full_name?: string
      phone?: string
      bio?: string
      avatar_url?: string
      car_make?: string
      car_model?: string
      car_year?: number
      car_color?: string
      car_plate?: string
      car_photo_url?: string
      accept_terms?: boolean
    }

    if (!accept_terms) {
      return NextResponse.json(
        { error: 'You must accept the driver terms to continue' },
        { status: 400 },
      )
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        full_name: full_name ?? undefined,
        phone: phone ?? undefined,
        bio: bio ?? undefined,
        avatar_url: avatar_url ?? undefined,
        car_make: car_make ?? undefined,
        car_model: car_model ?? undefined,
        car_year: car_year ?? undefined,
        car_color: car_color ?? undefined,
        car_plate: car_plate ?? undefined,
        car_photo_url: car_photo_url ?? undefined,
        is_driver: true,
        driver_verified: true, // In a real system this would be set after manual review
      },
    })

    return NextResponse.json({
      message: 'Driver profile saved',
      is_driver: updated.is_driver,
      driver_verified: updated.driver_verified,
    })
  } catch (error) {
    console.error('Error updating driver profile:', error)
    return NextResponse.json(
      {
        error: 'Failed to update driver profile',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    )
  }
}

