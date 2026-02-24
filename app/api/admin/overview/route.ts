import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'

// Hardcoded admin – no Supabase. Must match app/api/admin/login/route.ts
const ADMIN_COOKIE_NAME = 'admin_session'
const ADMIN_COOKIE_VALUE = 'rideshare-admin-hardcoded'

const ADMIN_USER_IDS = [
  '00000000-0000-0000-0000-000000000000',
]

async function getUserFromToken(token: string | null) {
  if (!token) {
    return { user: null, error: 'Authentication required' }
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

  const { data, error } = await supabase.auth.getUser()
  if (error || !data.user) {
    return { user: null, error: error?.message ?? 'Invalid authentication token' }
  }

  return { user: data.user, error: null }
}

export async function GET(request: NextRequest) {
  try {
    // Hardcoded admin: allow if cookie is set (no Supabase)
    const cookie = request.cookies.get(ADMIN_COOKIE_NAME)?.value
    if (cookie === ADMIN_COOKIE_VALUE) {
      const [users, rides, bookings] = await Promise.all([
        prisma.user.findMany({
          orderBy: { created_at: 'desc' },
          select: {
            id: true,
            email: true,
            username: true,
            full_name: true,
            role: true,
            rating: true,
            total_rides: true,
            created_at: true,
          },
        }),
        prisma.ride.findMany({
          orderBy: { created_at: 'desc' },
          include: {
            driver: {
              select: {
                id: true,
                full_name: true,
                username: true,
                email: true,
              },
            },
            _count: {
              select: {
                bookings: true,
              },
            },
          },
        }),
        prisma.booking.findMany({
          orderBy: { created_at: 'desc' },
          include: {
            ride: {
              select: {
                id: true,
                origin: true,
                destination: true,
                departure_time: true,
                driver: {
                  select: {
                    id: true,
                    full_name: true,
                    username: true,
                    email: true,
                  },
                },
              },
            },
            passenger: {
              select: {
                id: true,
                full_name: true,
                username: true,
                email: true,
              },
            },
          },
        }),
      ])
      return NextResponse.json({ users, rides, bookings })
    }

    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')

    const { user, error } = await getUserFromToken(token ?? null)
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required', details: error },
        { status: 401 },
      )
    }

    const isHardcodedAdmin = ADMIN_USER_IDS.includes(user.id)
    const isDefaultAdmin = user.email?.toLowerCase() === 'admin@admin.com'

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true },
    })

    const isRoleAdmin = dbUser?.role === 'ADMIN'

    if (!isHardcodedAdmin && !isDefaultAdmin && !isRoleAdmin) {
      return NextResponse.json(
        { error: 'Not authorized to access admin overview' },
        { status: 403 },
      )
    }

    const [users, rides, bookings] = await Promise.all([
      prisma.user.findMany({
        orderBy: { created_at: 'desc' },
        select: {
          id: true,
          email: true,
          username: true,
          full_name: true,
          role: true,
          rating: true,
          total_rides: true,
          created_at: true,
        },
      }),
      prisma.ride.findMany({
        orderBy: { created_at: 'desc' },
        include: {
          driver: {
            select: {
              id: true,
              full_name: true,
              username: true,
              email: true,
            },
          },
          _count: {
            select: {
              bookings: true,
            },
          },
        },
      }),
      prisma.booking.findMany({
        orderBy: { created_at: 'desc' },
        include: {
          ride: {
            select: {
              id: true,
              origin: true,
              destination: true,
              departure_time: true,
              driver: {
                select: {
                  id: true,
                  full_name: true,
                  username: true,
                  email: true,
                },
              },
            },
          },
          passenger: {
            select: {
              id: true,
              full_name: true,
              username: true,
              email: true,
            },
          },
        },
      }),
    ])

    return NextResponse.json({
      users,
      rides,
      bookings,
    })
  } catch (error) {
    console.error('Error in admin overview:', error)
    return NextResponse.json(
      {
        error: 'Failed to load admin overview',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    )
  }
}

