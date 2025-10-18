import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  // Define routes that require authentication for all methods
  const fullyProtectedRoutes = [
    '/api/bookings',
    '/api/users/profile',
    '/api/reviews'
  ]

  // Define routes that only require auth for POST/PUT/DELETE (not GET)
  const partiallyProtectedRoutes = [
    '/api/rides'
  ]

  const isFullyProtected = fullyProtectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  )

  const isPartiallyProtected = partiallyProtectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  )

  // Check if authentication is required
  const requiresAuth = isFullyProtected || 
    (isPartiallyProtected && request.method !== 'GET')

  if (requiresAuth) {
    // Get the session token from authorization header
    const authHeader = request.headers.get('authorization')
    const sessionToken = authHeader?.replace('Bearer ', '')

    if (!sessionToken) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Let the API route handle the token validation
    // Just pass the token through
    return NextResponse.next()
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