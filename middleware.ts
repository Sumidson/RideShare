import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  // Define protected API routes
  const protectedRoutes = [
    '/api/rides',
    '/api/bookings',
    '/api/users/profile',
    '/api/reviews'
  ]

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  )

  if (isProtectedRoute) {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/api/rides/:path*',
    '/api/bookings/:path*',
    '/api/users/profile/:path*',
    '/api/reviews/:path*'
  ]
} 