import { NextRequest, NextResponse } from 'next/server'
import { verifyJWT } from '@/app/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader) {
      return NextResponse.json({ error: 'No auth header' })
    }

    const token = authHeader.replace('Bearer ', '')
    const decoded = verifyJWT(token)
    
    return NextResponse.json({
      hasToken: !!token,
      tokenLength: token.length,
      decoded: decoded,
      jwtSecret: !!process.env.JWT_SECRET
    })
  } catch (error) {
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'An unknown error occurred' 
    })
  }
}
