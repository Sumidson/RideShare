'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { MessageCircle, Send, ArrowLeft } from 'lucide-react'
import AuthGuard from '@/components/auth/AuthGuard'
import { useSupabaseAuth } from '@/app/providers/SupabaseAuthProvider'
import { supabaseApiClient } from '@/app/lib/supabaseApiClient'
import { supabase } from '@/lib/supabase'

interface ChatMessage {
  id: string
  sender_id: string
  receiver_id: string
  message: string
  created_at: string
  sender?: {
    id: string
    full_name?: string | null
    username?: string | null
  }
}

interface BookingSummary {
  id: string
  ride?: {
    origin?: string
    destination?: string
  }
}

export default function BookingChatPage() {
  const params = useParams<{ bookingId: string }>()
  const bookingId = String(params?.bookingId ?? '')
  const { user } = useSupabaseAuth()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [booking, setBooking] = useState<BookingSummary | null>(null)
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const endRef = useRef<HTMLDivElement | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const title = useMemo(() => {
    const origin = booking?.ride?.origin
    const destination = booking?.ride?.destination
    if (origin && destination) return `${origin} -> ${destination}`
    return 'Booking chat'
  }, [booking])

  const scrollToBottom = () => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const loadMessages = useCallback(async () => {
    if (!bookingId) return
    const { data, error: chatError } = await supabaseApiClient.getBookingMessages(bookingId)
    if (chatError) {
      setError(chatError)
      return
    }
    const res = data as { messages?: ChatMessage[] }
    setMessages(res.messages ?? [])
    setError(null)
  }, [bookingId])

  useEffect(() => {
    const init = async () => {
      if (!bookingId) return
      setLoading(true)
      try {
        const [{ data: bookingData }] = await Promise.all([
          supabaseApiClient.getBooking(bookingId),
          loadMessages(),
        ])
        setBooking((bookingData as { booking?: BookingSummary })?.booking ?? null)
      } finally {
        setLoading(false)
      }
    }

    init()
  }, [bookingId, loadMessages])

  // Supabase Realtime subscription (WebSocket) for new chat messages.
  // Important: only subscribe once we have the authenticated user, otherwise
  // RLS can block delivery for the receiver.
  useEffect(() => {
    if (!bookingId || !user) return

    const channel = supabase
      .channel(`booking-chat-${bookingId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `booking_id=eq.${bookingId}`,
        },
        () => {
          // Refresh the thread to include sender info.
          if (debounceRef.current) clearTimeout(debounceRef.current)
          debounceRef.current = setTimeout(() => {
            void loadMessages()
          }, 150)
        }
      )
      .subscribe()

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      supabase.removeChannel(channel)
    }
  }, [bookingId, user, loadMessages])

  useEffect(() => {
    scrollToBottom()
  }, [messages.length])

  const handleSend = async () => {
    const message = newMessage.trim()
    if (!message || !bookingId || sending) return
    setSending(true)
    const { error: sendError } = await supabaseApiClient.sendBookingMessage(bookingId, { message })
    if (sendError) {
      setError(sendError)
    } else {
      setNewMessage('')
      // Realtime subscription will refresh the list; fallback refresh just in case.
      void loadMessages()
    }
    setSending(false)
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-linear-to-br from-slate-100 via-gray-50 to-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-wide text-slate-500">Booking Chat</p>
                <h1 className="text-lg font-semibold text-slate-900 truncate">{title}</h1>
              </div>
              <Link
                href="/my-bookings"
                className="inline-flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Link>
            </div>

            <div className="h-[60vh] overflow-y-auto p-4 bg-slate-50">
              {loading ? (
                <p className="text-slate-600">Loading messages...</p>
              ) : messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-500">
                  <MessageCircle className="w-10 h-10 mb-2 text-slate-300" />
                  <p>No messages yet. Start the conversation.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {messages.map((m) => {
                    const isMine = m.sender_id === user?.id
                    return (
                      <div key={m.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                        <div
                          className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                            isMine ? 'bg-slate-800 text-white' : 'bg-white text-slate-900 border border-slate-200'
                          }`}
                        >
                          {!isMine && (
                            <p className="text-xs mb-1 text-slate-500">
                              {m.sender?.full_name || m.sender?.username || 'User'}
                            </p>
                          )}
                          <p className="text-sm whitespace-pre-wrap wrap-break-word">{m.message}</p>
                          <p className={`text-[11px] mt-1 ${isMine ? 'text-slate-200' : 'text-slate-400'}`}>
                            {new Date(m.created_at).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                  <div ref={endRef} />
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-200 bg-white">
              {error && <p className="text-sm text-red-600 mb-2">{error}</p>}
              <div className="flex items-center gap-2">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  rows={2}
                  placeholder="Type your message..."
                  className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-slate-900 resize-none"
                />
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={!newMessage.trim() || sending}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 text-white hover:bg-slate-900 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
