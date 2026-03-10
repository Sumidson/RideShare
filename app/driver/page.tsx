'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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
  Phone,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';
import AuthGuard from '@/components/auth/AuthGuard';
import { supabase } from '@/lib/supabase';
import { supabaseApiClient } from '@/app/lib/supabaseApiClient';

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
  start_otp?: string | null;
  started_at?: string | null;
  otp_verified_at?: string | null;
}

interface DriverProfile {
  full_name?: string | null;
  avatar_url?: string | null;
  phone?: string | null;
  bio?: string | null;
  is_driver?: boolean;
  driver_verified?: boolean;
  car_make?: string | null;
  car_model?: string | null;
  car_year?: number | null;
  car_color?: string | null;
  car_plate?: string | null;
  car_photo_url?: string | null;
}

export default function DriverPage() {
  const [profile, setProfile] = useState<DriverProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [rides, setRides] = useState<DriverRide[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedRideId, setExpandedRideId] = useState<string | null>(null);
  const [startRideLoadingId, setStartRideLoadingId] = useState<string | null>(null);
  const [verifyOtpInput, setVerifyOtpInput] = useState<Record<string, string>>({});
  const [verifyOtpLoadingId, setVerifyOtpLoadingId] = useState<string | null>(null);
  const [bookingUpdateLoadingId, setBookingUpdateLoadingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.access_token) {
        setRides([]);
        setProfile(null);
        setLoading(false);
        setProfileLoading(false);
        return;
      }
      try {
        // Load driver profile
        const profileRes = await fetch('/api/driver/profile', {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });
        const profileData = await profileRes.json();
        if (profileRes.ok) {
          setProfile(profileData);
        } else {
          console.error('Driver profile error:', profileData.error);
          setProfileError(profileData.error || 'Failed to load driver profile');
        }
      } catch (error) {
        console.error('Failed to fetch driver profile:', error);
        setProfileError('Failed to load driver profile');
      } finally {
        setProfileLoading(false);
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
    fetchData();
  }, []);

  const refetchRides = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) return;
    try {
      const res = await fetch('/api/driver/rides', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      const data = await res.json();
      if (res.ok && data.rides) setRides(data.rides);
    } catch {
      // ignore
    }
  };

  const handleStartRide = async (rideId: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) return;
    setStartRideLoadingId(rideId);
    try {
      const res = await fetch(`/api/driver/rides/${rideId}/start`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      const data = await res.json();
      if (res.ok && data.ride) {
        setRides((prev) => prev.map((r) => (r.id === rideId ? data.ride : r)));
      } else {
        console.error(data.error || 'Failed to start ride');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setStartRideLoadingId(null);
    }
  };

  const handleVerifyOtp = async (rideId: string) => {
    const otp = (verifyOtpInput[rideId] ?? '').trim();
    if (!otp) return;
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) return;
    setVerifyOtpLoadingId(rideId);
    try {
      const res = await fetch(`/api/driver/rides/${rideId}/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ otp }),
      });
      const data = await res.json();
      if (res.ok && data.verified) {
        await refetchRides();
        setVerifyOtpInput((prev) => ({ ...prev, [rideId]: '' }));
      } else {
        console.error(data.error || 'Invalid OTP');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setVerifyOtpLoadingId(null);
    }
  };

  const handleAcceptBooking = async (bookingId: string) => {
    setBookingUpdateLoadingId(bookingId);
    try {
      const { error } = await supabaseApiClient.updateBooking(bookingId, { status: 'CONFIRMED' });
      if (error) {
        console.error(error);
      } else {
        await refetchRides();
      }
    } finally {
      setBookingUpdateLoadingId(null);
    }
  };

  const handleRejectBooking = async (bookingId: string) => {
    setBookingUpdateLoadingId(bookingId);
    try {
      const { error } = await supabaseApiClient.updateBooking(bookingId, { status: 'CANCELLED' });
      if (error) {
        console.error(error);
      } else {
        await refetchRides();
      }
    } finally {
      setBookingUpdateLoadingId(null);
    }
  };

  const handleProfileChange = (
    field: keyof DriverProfile,
    value: string | number | null,
  ) => {
    setProfile((prev) => ({
      ...(prev ?? {}),
      [field]: value,
    }));
  };

  const handleSaveProfile = async () => {
    setProfileError(null);
    setSavingProfile(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.access_token) {
        setProfileError('You must be signed in to save your driver profile.');
        setSavingProfile(false);
        return;
      }
      const res = await fetch('/api/driver/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          full_name: profile?.full_name,
          phone: profile?.phone,
          bio: profile?.bio,
          avatar_url: profile?.avatar_url,
          car_make: profile?.car_make,
          car_model: profile?.car_model,
          car_year: profile?.car_year,
          car_color: profile?.car_color,
          car_plate: profile?.car_plate,
          car_photo_url: profile?.car_photo_url,
          accept_terms: true,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setProfileError(data.error || 'Failed to save driver profile');
      } else {
        setProfile((prev) => ({
          ...(prev ?? {}),
          is_driver: data.is_driver,
          driver_verified: data.driver_verified,
        }));
      }
    } catch (error) {
      console.error('Failed to save driver profile:', error);
      setProfileError('Failed to save driver profile');
    } finally {
      setSavingProfile(false);
    }
  };

  return (
    <AuthGuard redirectTo="/driver/login">
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-50 to-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col gap-6 mb-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-4xl font-bold text-slate-900 mb-2">
                  Driver dashboard
                </h1>
                <p className="text-xl text-slate-600 font-light">
                  Set up your driver profile and manage your trips
                </p>
              </div>
              <Link
                href="/create-ride"
                className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-6 py-3 rounded-xl font-semibold transition-colors shadow-lg"
              >
                <Plus className="w-5 h-5" />
                Post a new trip
              </Link>
            </div>

            {/* Driver profile setup */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Driver profile
                  </h2>
                  <p className="text-sm text-slate-600">
                    Tell riders about yourself and your car. This also enables
                    driver verification.
                  </p>
                </div>
                {profile?.driver_verified ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
                    <CheckCircle className="w-4 h-4" />
                    Verified driver
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-sm font-medium text-amber-700">
                    <AlertTriangle className="w-4 h-4" />
                    Verification pending
                  </span>
                )}
              </div>

              {profileError && (
                <p className="mb-4 text-sm text-red-600">{profileError}</p>
              )}

              {profileLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-slate-600" />
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">
                        Full name
                      </label>
                      <div className="relative">
                        <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          value={profile?.full_name ?? ''}
                          onChange={(e) =>
                            handleProfileChange('full_name', e.target.value)
                          }
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm text-slate-900 focus:border-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-200"
                          placeholder="Your legal name"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">
                        Phone number
                      </label>
                      <div className="relative">
                        <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                          type="tel"
                          value={profile?.phone ?? ''}
                          onChange={(e) =>
                            handleProfileChange('phone', e.target.value)
                          }
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm text-slate-900 focus:border-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-200"
                          placeholder="+91 98765 43210"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">
                        Profile photo URL
                      </label>
                      <input
                        type="url"
                        value={profile?.avatar_url ?? ''}
                        onChange={(e) =>
                          handleProfileChange('avatar_url', e.target.value)
                        }
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 text-sm text-slate-900 focus:border-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-200"
                        placeholder="https://..."
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">
                        About you
                      </label>
                      <textarea
                        rows={3}
                        value={profile?.bio ?? ''}
                        onChange={(e) =>
                          handleProfileChange('bio', e.target.value)
                        }
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 text-sm text-slate-900 focus:border-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-200 resize-none"
                        placeholder="Share a short description to help riders know you."
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">
                          Car make
                        </label>
                        <input
                          type="text"
                          value={profile?.car_make ?? ''}
                          onChange={(e) =>
                            handleProfileChange('car_make', e.target.value)
                          }
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 text-sm text-slate-900 focus:border-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-200"
                          placeholder="Toyota"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">
                          Car model
                        </label>
                        <input
                          type="text"
                          value={profile?.car_model ?? ''}
                          onChange={(e) =>
                            handleProfileChange('car_model', e.target.value)
                          }
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 text-sm text-slate-900 focus:border-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-200"
                          placeholder="Etios"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">
                          Year
                        </label>
                        <input
                          type="number"
                          value={profile?.car_year ?? ''}
                          onChange={(e) =>
                            handleProfileChange(
                              'car_year',
                              e.target.value ? Number(e.target.value) : null,
                            )
                          }
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 text-sm text-slate-900 focus:border-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-200"
                          placeholder="2020"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">
                          Colour
                        </label>
                        <input
                          type="text"
                          value={profile?.car_color ?? ''}
                          onChange={(e) =>
                            handleProfileChange('car_color', e.target.value)
                          }
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 text-sm text-slate-900 focus:border-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-200"
                          placeholder="White"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">
                          Plate
                        </label>
                        <input
                          type="text"
                          value={profile?.car_plate ?? ''}
                          onChange={(e) =>
                            handleProfileChange('car_plate', e.target.value)
                          }
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 text-sm text-slate-900 focus:border-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-200"
                          placeholder="KA 01 AB 1234"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">
                        Car photo URL
                      </label>
                      <input
                        type="url"
                        value={profile?.car_photo_url ?? ''}
                        onChange={(e) =>
                          handleProfileChange('car_photo_url', e.target.value)
                        }
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 text-sm text-slate-900 focus:border-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-200"
                        placeholder="https://..."
                      />
                      <p className="mt-1 text-xs text-slate-500">
                        Upload your car photo to storage and paste the public
                        URL here.
                      </p>
                    </div>
                    <p className="text-xs text-slate-500">
                      By saving, you confirm that you own this vehicle and agree
                      to share accurate information with riders.
                    </p>
                  </div>
                </div>
              )}

              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveProfile}
                  disabled={savingProfile || profileLoading}
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {savingProfile ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      Saving…
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Save driver profile
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Your rides section */}
          <div className="mt-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Car className="w-7 h-7 text-slate-600" />
              Your rides
              {!loading && rides.length > 0 && (
                <span className="text-lg font-normal text-slate-500">
                  ({rides.length} trip{rides.length !== 1 ? 's' : ''})
                </span>
              )}
            </h2>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-2 border-slate-300 border-t-slate-700" />
            </div>
          ) : rides.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-12 text-center">
              <Car className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">No rides yet</h3>
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
            </div>
          ) : (
            <div className="space-y-4">
              {rides.map((ride) => (
                <div
                  key={ride.id}
                  className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden text-slate-900"
                >
                  <button
                    type="button"
                    className="w-full p-6 text-left flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors text-slate-900"
                    onClick={() =>
                      setExpandedRideId(expandedRideId === ride.id ? null : ride.id)
                    }
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 font-semibold mb-2 text-slate-900">
                        <MapPin className="w-5 h-5 text-slate-600 shrink-0" />
                        <span className="text-slate-900">
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
                              : ride.status === 'IN_PROGRESS'
                                ? 'bg-amber-100 text-amber-800'
                                : ride.status === 'COMPLETED'
                                  ? 'bg-slate-100 text-slate-700'
                                  : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {ride.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 text-slate-700">
                      <span className="text-sm">
                        {ride.bookings.length} passenger{ride.bookings.length !== 1 ? 's' : ''}
                      </span>
                      {expandedRideId === ride.id ? (
                        <ChevronUp className="w-5 h-5 text-slate-500" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-500" />
                      )}
                    </div>
                  </button>

                  {expandedRideId === ride.id && (
                    <div className="border-t border-slate-100">
                      <div className="p-6 bg-slate-50/80 space-y-6">
                          {/* Start ride / OTP / Verify */}
                          {ride.status === 'ACTIVE' && ride.bookings.length > 0 && (
                            <div className="flex flex-wrap items-center gap-3">
                              <button
                                type="button"
                                disabled={startRideLoadingId === ride.id}
                                onClick={() => handleStartRide(ride.id)}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 disabled:opacity-50"
                              >
                                {startRideLoadingId === ride.id ? (
                                  <>Starting…</>
                                ) : (
                                  <>Start ride</>
                                )}
                              </button>
                            </div>
                          )}
                          {ride.status === 'IN_PROGRESS' && (
                            <div className="rounded-xl border border-slate-200 bg-white p-4">
                              <p className="text-sm font-medium text-slate-700 mb-3">
                                Ask a passenger to show their OTP, then enter it below to verify.
                              </p>
                              {!ride.otp_verified_at ? (
                                <div className="flex flex-wrap items-center gap-2">
                                  <input
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={6}
                                    placeholder="Enter OTP"
                                    value={verifyOtpInput[ride.id] ?? ''}
                                    onChange={(e) =>
                                      setVerifyOtpInput((prev) => ({
                                        ...prev,
                                        [ride.id]: e.target.value.replace(/\D/g, ''),
                                      }))
                                    }
                                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm w-28 font-mono text-slate-900"
                                  />
                                  <button
                                    type="button"
                                    disabled={
                                      verifyOtpLoadingId === ride.id ||
                                      (verifyOtpInput[ride.id] ?? '').length !== 6
                                    }
                                    onClick={() => handleVerifyOtp(ride.id)}
                                    className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-slate-800 text-white text-sm font-medium hover:bg-slate-900 disabled:opacity-50"
                                  >
                                    {verifyOtpLoadingId === ride.id ? 'Verifying…' : 'Verify OTP'}
                                  </button>
                                </div>
                              ) : (
                                <p className="text-sm text-emerald-700 font-medium flex items-center gap-1">
                                  <CheckCircle className="w-4 h-4" />
                                  Verified
                                </p>
                              )}
                            </div>
                          )}
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
                                  <div className="text-right flex flex-col items-end gap-2">
                                    <p className="text-slate-700 font-medium">
                                      {b.seats_booked} seat{b.seats_booked !== 1 ? 's' : ''} · ₹
                                      {(Number(b.total_price) || 0).toFixed(0)}
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
                                    {b.status === 'PENDING' && (
                                      <div className="flex items-center gap-2 mt-1">
                                        <button
                                          type="button"
                                          disabled={bookingUpdateLoadingId === b.id}
                                          onClick={() => handleAcceptBooking(b.id)}
                                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 disabled:opacity-50"
                                        >
                                          {bookingUpdateLoadingId === b.id ? '…' : 'Accept'}
                                        </button>
                                        <button
                                          type="button"
                                          disabled={bookingUpdateLoadingId === b.id}
                                          onClick={() => handleRejectBooking(b.id)}
                                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-300 disabled:opacity-50"
                                        >
                                          Reject
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}
