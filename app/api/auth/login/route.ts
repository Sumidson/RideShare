import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = loginSchema.parse(body)

    // Sign in user with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      )
    }

    return NextResponse.json({ 
      message: 'Login successful',
      user: data.user,
      session: data.session
    })
  } catch (error: unknown) {
    console.error('Login error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error' },
        { status: 400 }
      )
    }

    const errorMessage = error instanceof Error ? error.message : 'An internal server error occurred';
    console.error('Detailed error:', errorMessage);

    return NextResponse.json(
      { error: 'An internal server error occurred', details: errorMessage },
      { status: 500 }
    )
  }
}