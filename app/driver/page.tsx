'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Car,
  MapPin,
  Calendar,
  Users,
  ChevronDown,
  ChevronUp,
  Plus,
  User,
  Mail,
} from 'lucide-react';
import AuthGuard from '@/components/auth/AuthGuard';
import { supabase } from '@/lib/supabase';

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

const cardVariants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4 },
  },
  hover: {
    scale: 1.01,
    transition: { duration: 0.2 },
  },
};

interface Passenger {
  id: string;
  full_name: string | null;
  username: string | null;
  email: string;
  avatar_url: string | null;
}

interface BookingWithPassenger {
  id: string;
  seats_booked: number;
  total_price: number;
  status: string;
  passenger: Passenger;
}

interface DriverRide {
  id: string;
  origin: string;
  destination: string;
  departure_time: string;
  available_seats: number;
  price_per_seat: number;
  status: string;
  description: string | null;
  bookings: BookingWithPassenger[];
}

export default function DriverPage() {
  const [rides, setRides] = useState<DriverRide[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedRideId, setExpandedRideId] = useState<string | null>(null);

  useEffect(() => {
    const fetchRides = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        setRides([]);
        setLoading(false);
        return;
      }
      try {
        const res = await fetch('/api/driver/rides', {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });
        const data = await res.json();
        if (!res.ok) {
          console.error('Driver rides error:', data.error);
          setRides([]);
        } else {
          setRides(data.rides ?? []);
        }
      } catch (err) {
        console.error('Failed to fetch driver rides:', err);
        setRides([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRides();
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
          <motion.div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8" variants={itemVariants}>
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">
                Driver dashboard
              </h1>
              <p className="text-xl text-slate-600 font-light">
                Your rides and passengers
              </p>
            </div>
            <Link
              href="/create-ride"
              className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-6 py-3 rounded-xl font-semibold transition-colors shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Offer a ride
            </Link>
          </motion.div>

          {loading ? (
            <motion.div
              className="flex justify-center items-center py-20"
              variants={itemVariants}
            >
              <div className="animate-spin rounded-full h-12 w-12 border-2 border-slate-300 border-t-slate-700" />
            </motion.div>
          ) : rides.length === 0 ? (
            <motion.div
              className="bg-white rounded-2xl shadow-lg border border-slate-200 p-12 text-center"
              variants={itemVariants}
            >
              <Car className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-slate-900 mb-2">No rides yet</h2>
              <p className="text-slate-600 mb-6">
                Rides you offer will appear here with your passengers.
              </p>
              <Link
                href="/create-ride"
                className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
              >
                <Plus className="w-5 h-5" />
                Offer a ride
              </Link>
            </motion.div>
          ) : (
            <motion.div
              className="space-y-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {rides.map((ride) => (
                <motion.div
                  key={ride.id}
                  variants={cardVariants}
                  className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden"
                >
                  <button
                    type="button"
                    className="w-full p-6 text-left flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors"
                    onClick={() =>
                      setExpandedRideId(expandedRideId === ride.id ? null : ride.id)
                    }
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-slate-900 font-semibold mb-2">
                        <MapPin className="w-5 h-5 text-slate-600 flex-shrink-0" />
                        <span>
                          {ride.origin} → {ride.destination}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-slate-600 text-sm">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(ride.departure_time).toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {ride.available_seats} seats · ₹{ride.price_per_seat}/seat
                        </span>
                        <span
                          className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                            ride.status === 'ACTIVE'
                              ? 'bg-emerald-100 text-emerald-800'
                              : ride.status === 'COMPLETED'
                                ? 'bg-slate-100 text-slate-700'
                                : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {ride.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-slate-600 text-sm">
                        {ride.bookings.length} passenger{ride.bookings.length !== 1 ? 's' : ''}
                      </span>
                      {expandedRideId === ride.id ? (
                        <ChevronUp className="w-5 h-5 text-slate-500" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-500" />
                      )}
                    </div>
                  </button>

                  <AnimatePresence>
                    {expandedRideId === ride.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden border-t border-slate-100"
                      >
                        <div className="p-6 bg-slate-50/80">
                          <h3 className="text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wide">
                            Passengers
                          </h3>
                          {ride.bookings.length === 0 ? (
                            <p className="text-slate-500 text-sm">No passengers yet.</p>
                          ) : (
                            <ul className="space-y-3">
                              {ride.bookings.map((b) => (
                                <li
                                  key={b.id}
                                  className="flex flex-wrap items-center justify-between gap-2 bg-white rounded-xl p-4 border border-slate-100"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-medium">
                                      {b.passenger.avatar_url ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                          src={b.passenger.avatar_url}
                                          alt=""
                                          className="w-full h-full rounded-full object-cover"
                                        />
                                      ) : (
                                        <User className="w-5 h-5" />
                                      )}
                                    </div>
                                    <div>
                                      <p className="font-medium text-slate-900">
                                        {b.passenger.full_name ||
                                          b.passenger.username ||
                                          'Passenger'}
                                      </p>
                                      <p className="text-sm text-slate-500 flex items-center gap-1">
                                        <Mail className="w-3.5 h-3.5" />
                                        {b.passenger.email}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-slate-700 font-medium">
                                      {b.seats_booked} seat{b.seats_booked !== 1 ? 's' : ''} · ₹
                                      {b.total_price.toFixed(0)}
                                    </p>
                                    <p
                                      className={`text-xs font-medium ${
                                        b.status === 'CONFIRMED'
                                          ? 'text-green-600'
                                          : b.status === 'PENDING'
                                            ? 'text-amber-600'
                                            : 'text-slate-500'
                                      }`}
                                    >
                                      {b.status}
                                    </p>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>
    </AuthGuard>
  );
}
