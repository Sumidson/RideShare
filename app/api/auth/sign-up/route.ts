import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { z } from 'zod'

const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  username: z.string().optional(),
  full_name: z.string().optional()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, username, full_name } = signUpSchema.parse(body)

    // Sign up user with Supabase
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          full_name
        }
      }
    })

    if (error) {
      console.error('Supabase auth error:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json({
      message: 'User created successfully. Please check your email to verify your account.',
      user: data.user,
      session: data.session
    })
  } catch (error: unknown) {
    console.error('Signup error:', error)

    if (error instanceof z.ZodError) {
      console.error('Validation error details:', JSON.stringify(error.issues, null, 2))
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      )
    }

    let errorMessage = 'An internal server error occurred';

    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}