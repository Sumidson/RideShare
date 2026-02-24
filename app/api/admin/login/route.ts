import { NextRequest, NextResponse } from 'next/server'

// Hardcoded admin – no Supabase
const ADMIN_EMAIL = 'admin@admin.com'
const ADMIN_PASSWORD = 'admin'
const ADMIN_COOKIE_NAME = 'admin_session'
const ADMIN_COOKIE_VALUE = 'rideshare-admin-hardcoded'

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}))
  const email = (body.email ?? '').trim().toLowerCase()
  const password = body.password ?? ''

  if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Invalid login credentials' }, { status: 401 })
  }

  const res = NextResponse.json({ ok: true })
  res.cookies.set(ADMIN_COOKIE_NAME, ADMIN_COOKIE_VALUE, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
  return res
}
