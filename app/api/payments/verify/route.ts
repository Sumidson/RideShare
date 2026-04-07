import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import crypto from 'crypto'

const bodySchema = z.object({
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
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

    const secret = process.env.RAZORPAY_KEY_SECRET
    if (!secret) return NextResponse.json({ error: 'Razorpay is not configured' }, { status: 500 })

    const payload = `${parsed.razorpay_order_id}|${parsed.razorpay_payment_id}`
    const expected = crypto.createHmac('sha256', secret).update(payload).digest('hex')
    const ok = expected === parsed.razorpay_signature

    if (!ok) return NextResponse.json({ verified: false, error: 'Invalid payment signature' }, { status: 400 })

    return NextResponse.json({ verified: true })
  } catch (error) {
    console.error('Error verifying payment:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.issues }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to verify payment' }, { status: 500 })
  }
}

