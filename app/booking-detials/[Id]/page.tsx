"use client"
import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabaseApiClient } from '@/app/lib/supabaseApiClient'
import AuthGuard from '@/components/auth/AuthGuard'
import { motion } from 'framer-motion'
import { MapPin, Clock, User, Car, DollarSign, ArrowLeft, Bookmark, BookmarkCheck } from 'lucide-react'
import { addSavedRide, getSavedRidesFromStorage } from '@/app/lib/savedRides'

interface Ride {
  id: string
  origin: string
  destination: string
  departure_time: string
  available_seats: number
  price_per_seat: number
  description?: string
  driver?: {
    full_name?: string
    username?: string
    rating?: number
  }
}

export default function BookingDetailsPage() {
  const params = useParams<{ Id: string }>()
  const rideId = params?.Id
  const router = useRouter()
  const [seats, setSeats] = useState(1)
  const [loading, setLoading] = useState(false)
  const [rideLoading, setRideLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [ride, setRide] = useState<Ride | null>(null)
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsSaved(getSavedRidesFromStorage().some((s) => s.rideId === String(rideId)))
    }
  }, [rideId])

  useEffect(() => {
    const fetchRide = async () => {
      if (!rideId) return

      try {
        const { data, error } = await supabaseApiClient.getRide(String(rideId))
        if (error) {
          setError(error)
        } else {
          setRide(data as Ride)
        }
      } catch {
        setError('Failed to fetch ride details')
      } finally {
        setRideLoading(false)
      }
    }

    fetchRide()
  }, [rideId])

  const handleBook = async () => {
    if (!ride) return

    setLoading(true)
    setError(null)

    const { error } = await supabaseApiClient.createBooking({
      ride_id: String(rideId),
      seats_booked: Number(seats)
    })

    if (error) {
      setError(error)
    } else {
      router.push('/profile')
    }
    setLoading(false)
  }

  const totalPrice = ride ? seats * ride.price_per_seat : 0

  const handleSaveForLater = () => {
    if (!ride) return
    const added = addSavedRide({
      id: ride.id,
      origin: ride.origin,
      destination: ride.destination,
      departure_time: ride.departure_time,
      price_per_seat: ride.price_per_seat,
    })
    if (added) setIsSaved(true)
  }

  if (rideLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!ride) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Ride Not Found</h1>
          <button
            onClick={() => router.push('/rides')}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Back to Rides
          </button>
        </div>
      </div>
    )
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-50 to-slate-200">
        <div className="max-w-4xl mx-auto p-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <button
              onClick={() => router.push('/rides')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Rides</span>
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Book Your Ride</h1>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Ride Details */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                <Car className="h-5 w-5 text-blue-600" />
                <span>Ride Details</span>
              </h2>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-green-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">From</p>
                    <p className="font-medium text-gray-900">{ride.origin}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-red-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">To</p>
                    <p className="font-medium text-gray-900">{ride.destination}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-blue-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Departure</p>
                    <p className="font-medium text-gray-900">
                      {new Date(ride.departure_time).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <User className="h-5 w-5 text-purple-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Driver</p>
                    <p className="font-medium text-gray-900">
                      {ride.driver?.full_name || ride.driver?.username || 'Unknown'}
                    </p>
                  </div>
                </div>

                {ride.description && (
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600 mb-2">Description</p>
                    <p className="text-gray-900">{ride.description}</p>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleSaveForLater}
                    disabled={isSaved}
                    className="flex items-center gap-2 text-slate-600 hover:text-slate-900 disabled:opacity-70 disabled:cursor-default transition-colors"
                  >
                    {isSaved ? (
                      <>
                        <BookmarkCheck className="h-5 w-5 text-slate-700 fill-slate-700" />
                        <span>Saved for later</span>
                      </>
                    ) : (
                      <>
                        <Bookmark className="h-5 w-5" />
                        <span>Save for later</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Booking Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <span>Booking Details</span>
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Seats
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={Math.min(ride.available_seats, 8)}
                    value={seats}
                    onChange={(e) => setSeats(parseInt(e.target.value) || 1)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Available: {ride.available_seats} seats
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Price per seat:</span>
                    <span className="font-medium">₹{ride.price_per_seat}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Seats selected:</span>
                    <span className="font-medium">{seats}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-900">Total:</span>
                      <span className="text-2xl font-bold text-blue-600">₹{totalPrice}</span>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}

                <button
                  disabled={loading || seats > ride.available_seats}
                  onClick={handleBook}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Processing...' : 'Confirm Booking'}
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
