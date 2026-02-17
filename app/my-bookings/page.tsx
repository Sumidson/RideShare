'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Calendar,
  MapPin,
  User,
  ChevronRight,
  CheckCircle,
  XCircle,
  AlertCircle,
  Car,
} from 'lucide-react';
import AuthGuard from '@/components/auth/AuthGuard';
import { supabaseApiClient } from '@/app/lib/supabaseApiClient';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

const cardHoverVariant = {
  hover: {
    scale: 1.02,
    transition: { duration: 0.2 },
  },
};

interface Booking {
  id: string;
  seats_booked: number;
  total_price: number;
  status: string;
  created_at: string;
  ride: {
    id: string;
    origin: string;
    destination: string;
    departure_time: string;
    driver: {
      id: string;
      username?: string;
      full_name?: string;
      avatar_url?: string;
      rating?: number;
    };
  };
}

function getStatusColor(status: string) {
  switch (status) {
    case 'CONFIRMED':
      return 'text-green-600 bg-green-50';
    case 'PENDING':
      return 'text-yellow-600 bg-yellow-50';
    case 'COMPLETED':
      return 'text-blue-600 bg-blue-50';
    case 'CANCELLED':
      return 'text-red-600 bg-red-50';
    default:
      return 'text-gray-600 bg-gray-50';
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case 'CONFIRMED':
      return <CheckCircle className="h-4 w-4" />;
    case 'PENDING':
      return <AlertCircle className="h-4 w-4" />;
    case 'COMPLETED':
      return <CheckCircle className="h-4 w-4" />;
    case 'CANCELLED':
      return <XCircle className="h-4 w-4" />;
    default:
      return <AlertCircle className="h-4 w-4" />;
  }
}

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { data, error } = await supabaseApiClient.getBookings();
        if (error) {
          console.error('Failed to fetch bookings:', error);
          setBookings([]);
        } else {
          const res = data as { bookings?: Booking[] };
          setBookings(res?.bookings ?? []);
        }
      } catch (err) {
        console.error('Failed to fetch bookings:', err);
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-50 to-slate-200">
        <motion.div
          className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="mb-8" variants={itemVariants}>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">
              My Bookings
            </h1>
            <p className="text-xl text-slate-600 font-light">
              Rides you have booked as a passenger
            </p>
          </motion.div>

          {loading ? (
            <motion.div
              className="flex justify-center items-center py-20"
              variants={itemVariants}
            >
              <div className="animate-spin rounded-full h-12 w-12 border-2 border-slate-300 border-t-slate-700" />
            </motion.div>
          ) : bookings.length === 0 ? (
            <motion.div
              className="bg-white rounded-2xl shadow-lg border border-slate-200 p-12 text-center"
              variants={itemVariants}
            >
              <Car className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-slate-900 mb-2">No bookings yet</h2>
              <p className="text-slate-600 mb-6">
                When you book a ride, it will appear here.
              </p>
              <Link
                href="/rides"
                className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
              >
                Find rides
                <ChevronRight className="w-5 h-5" />
              </Link>
            </motion.div>
          ) : (
            <motion.div
              className="space-y-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {bookings.map((booking) => (
                <Link key={booking.id} href={`/booking-detials/${booking.ride.id}`}>
                  <motion.div
                    variants={{ ...itemVariants, ...cardHoverVariant }}
                    whileHover="hover"
                    className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 transition-shadow hover:shadow-xl"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 text-slate-900 font-semibold mb-2">
                          <MapPin className="w-5 h-5 text-slate-600 flex-shrink-0" />
                          <span>
                            {booking.ride.origin} → {booking.ride.destination}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-600 text-sm">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(booking.ride.departure_time).toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {booking.ride.driver?.full_name ||
                              booking.ride.driver?.username ||
                              'Driver'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 flex-shrink-0">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}
                        >
                          {getStatusIcon(booking.status)}
                          {booking.status}
                        </span>
                        <div className="text-right">
                          <p className="text-slate-900 font-semibold">
                            ₹{booking.total_price.toFixed(0)}
                          </p>
                          <p className="text-xs text-slate-500">
                            {booking.seats_booked} seat{booking.seats_booked !== 1 ? 's' : ''}
                          </p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-400" />
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>
    </AuthGuard>
  );
}
