import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const origin = searchParams.get('origin')
    const destination = searchParams.get('destination')
    const date = searchParams.get('date')

    const whereClause: Record<string, unknown> = {
      status: 'ACTIVE',
      available_seats: {
        gt: 0
      }
    }

    // Add filters if provided
    if (origin) {
      whereClause.origin = {
        contains: origin,
        mode: 'insensitive'
      }
    }

    if (destination) {
      whereClause.destination = {
        contains: destination,
        mode: 'insensitive'
      }
    }

    if (date) {
      const searchDate = new Date(date)
      const nextDay = new Date(searchDate)
      nextDay.setDate(nextDay.getDate() + 1)
      
      whereClause.departure_time = {
        gte: searchDate,
        lt: nextDay
      }
    }

    const rides = await prisma.ride.findMany({
      where: whereClause,
      include: {
        driver: {
          select: {
            id: true,
            full_name: true,
            username: true,
            avatar_url: true,
            rating: true,
            total_rides: true
          }
        },
        _count: {
          select: {
            bookings: true
          }
        }
      },
      orderBy: {
        departure_time: 'asc'
      }
    })

    return NextResponse.json({
      success: true,
      data: rides,
      count: rides.length
    })
  } catch (error) {
    console.error('Error fetching rides:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch rides',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('POST /api/rides - Starting ride creation')
    
    // Get the session token from authorization header
    const authHeader = request.headers.get('authorization')
    const sessionToken = authHeader?.replace('Bearer ', '')

    console.log('Auth header present:', !!authHeader)
    console.log('Session token present:', !!sessionToken)

    if (!sessionToken) {
      console.log('No session token found')
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Validate the token with Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    
    console.log('Supabase URL present:', !!supabaseUrl)
    console.log('Supabase key present:', !!supabaseAnonKey)
    
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${sessionToken}`
        }
      }
    })

    console.log('Validating user with Supabase...')
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    console.log('Auth error:', authError)
    console.log('User found:', !!user)
    
    if (authError || !user) {
      console.log('Authentication failed:', authError?.message)
      return NextResponse.json(
        { error: 'Invalid authentication token', details: authError?.message },
        { status: 401 }
      )
    }

    const userId = user.id
    const userEmail = user.email
    
    console.log('User authenticated:', userId)

    console.log('Parsing request body...')
    const body = await request.json()
    console.log('Request body:', body)
    
    const {
      origin,
      destination,
      departure_time,
      available_seats,
      price_per_seat,
      description
    } = body

    // Validate required fields
    if (!origin || !destination || !departure_time || !available_seats || !price_per_seat) {
      console.log('Missing required fields:', { origin, destination, departure_time, available_seats, price_per_seat })
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    console.log('Checking if user exists in database...')
    // Check if user exists in our database, create if not
    let dbUser = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!dbUser) {
      console.log('Creating new user in database...')
      // Create user from Supabase data
      dbUser = await prisma.user.create({
        data: {
          id: userId,
          email: userEmail || '',
          email_verified: true,
          is_verified: true
        }
      })
      console.log('User created:', dbUser.id)
    } else {
      console.log('User found in database:', dbUser.id)
    }

    console.log('Creating ride with data:', {
      driver_id: userId,
      origin,
      destination,
      departure_time: new Date(departure_time),
      available_seats: parseInt(available_seats),
      price_per_seat: parseFloat(price_per_seat),
      description: description || null,
      status: 'ACTIVE'
    })

    const ride = await prisma.ride.create({
      data: {
        driver_id: userId,
        origin,
        destination,
        departure_time: new Date(departure_time),
        available_seats: parseInt(available_seats),
        price_per_seat: parseFloat(price_per_seat),
        description: description || null,
        status: 'ACTIVE'
      },
      include: {
        driver: {
          select: {
            id: true,
            full_name: true,
            username: true,
            avatar_url: true,
            rating: true,
            total_rides: true
          }
        }
      }
    })

    console.log('Ride created successfully:', ride.id)

    return NextResponse.json({
      success: true,
      data: ride,
      message: 'Ride created successfully'
    })
  } catch (error) {
    console.error('Error creating ride:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create ride',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}