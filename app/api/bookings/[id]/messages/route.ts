import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'
import { z } from 'zod'
import { Prisma } from '@prisma/client'

const sendMessageSchema = z.object({
  message: z.string().min(1).max(1000),
})

async function getUserFromToken(token: string | null) {
  if (!token) return null
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  const { createClient } = await import('@supabase/supabase-js')
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  })
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  return error || !user ? null : user
}

async function getBookingForUser(bookingId: string, userId: string) {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    select: {
      id: true,
      passenger_id: true,
      ride: { select: { driver_id: true } },
    },
  })

  if (!booking) return { booking: null, role: null as 'driver' | 'passenger' | null }
  if (booking.passenger_id === userId) return { booking, role: 'passenger' as const }
  if (booking.ride.driver_id === userId) return { booking, role: 'driver' as const }
  return { booking: null, role: null as 'driver' | 'passenger' | null }
}

async function getMessagesForBooking(bookingId: string) {
  const prismaWithOptionalModel = prisma as unknown as {
    chatMessage?: {
      findMany: (...args: unknown[]) => Promise<unknown[]>
    }
  }

  if (prismaWithOptionalModel.chatMessage?.findMany) {
    return prismaWithOptionalModel.chatMessage.findMany({
      where: { booking_id: bookingId },
      orderBy: { created_at: 'asc' },
      include: {
        sender: {
          select: {
            id: true,
            full_name: true,
            username: true,
            avatar_url: true,
          },
        },
      },
    })
  }

  // Fallback for stale Prisma client delegates in long-running dev sessions.
  return prisma.$queryRaw<
    Array<{
      id: string
      sender_id: string
      receiver_id: string
      booking_id: string
      message: string
      created_at: Date
      sender: { id: string; full_name: string | null; username: string | null; avatar_url: string | null }
    }>
  >(Prisma.sql`
    SELECT
      cm.id,
      cm.sender_id,
      cm.receiver_id,
      cm.booking_id,
      cm.message,
      cm.created_at,
      json_build_object(
        'id', u.id,
        'full_name', u.full_name,
        'username', u.username,
        'avatar_url', u.avatar_url
      ) AS sender
    FROM chat_messages cm
    JOIN users u ON u.id = cm.sender_id
    WHERE cm.booking_id = ${bookingId}
    ORDER BY cm.created_at ASC
  `)
}

async function createMessageForBooking(
  bookingId: string,
  senderId: string,
  receiverId: string,
  messageText: string
) {
  const prismaWithOptionalModel = prisma as unknown as {
    chatMessage?: {
      create: (...args: unknown[]) => Promise<unknown>
    }
  }

  if (prismaWithOptionalModel.chatMessage?.create) {
    return prismaWithOptionalModel.chatMessage.create({
      data: {
        booking_id: bookingId,
        sender_id: senderId,
        receiver_id: receiverId,
        message: messageText,
      },
      include: {
        sender: {
          select: {
            id: true,
            full_name: true,
            username: true,
            avatar_url: true,
          },
        },
      },
    })
  }

  const id = crypto.randomUUID()
  await prisma.$executeRaw(
    Prisma.sql`
      INSERT INTO chat_messages (id, booking_id, sender_id, receiver_id, message, created_at)
      VALUES (${id}, ${bookingId}, ${senderId}, ${receiverId}, ${messageText}, NOW())
    `
  )

  const rows = await prisma.$queryRaw<
    Array<{
      id: string
      sender_id: string
      receiver_id: string
      booking_id: string
      message: string
      created_at: Date
      sender: { id: string; full_name: string | null; username: string | null; avatar_url: string | null }
    }>
  >(Prisma.sql`
    SELECT
      cm.id,
      cm.sender_id,
      cm.receiver_id,
      cm.booking_id,
      cm.message,
      cm.created_at,
      json_build_object(
        'id', u.id,
        'full_name', u.full_name,
        'username', u.username,
        'avatar_url', u.avatar_url
      ) AS sender
    FROM chat_messages cm
    JOIN users u ON u.id = cm.sender_id
    WHERE cm.id = ${id}
    LIMIT 1
  `)
  return rows[0] ?? null
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    const user = await getUserFromToken(token ?? null)
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const { booking } = await getBookingForUser(id, user.id)
    if (!booking) {
      return NextResponse.json({ error: 'Booking not found or access denied' }, { status: 404 })
    }

    const messages = await getMessagesForBooking(id)

    return NextResponse.json({ messages })
  } catch (error) {
    console.error('Error fetching chat messages:', error)
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    const user = await getUserFromToken(token ?? null)
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const { booking, role } = await getBookingForUser(id, user.id)
    if (!booking || !role) {
      return NextResponse.json({ error: 'Booking not found or access denied' }, { status: 404 })
    }

    const body = await request.json()
    const parsed = sendMessageSchema.parse(body)
    const receiverId =
      role === 'driver' ? booking.passenger_id : booking.ride.driver_id

    const message = await createMessageForBooking(
      id,
      user.id,
      receiverId,
      parsed.message.trim()
    )

    return NextResponse.json({ message }, { status: 201 })
  } catch (error) {
    console.error('Error sending chat message:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.issues }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}
