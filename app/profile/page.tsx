'use client';
import React, { useState, useEffect } from 'react';
import {
  Clock,
  Calendar,
  Mail,
  Edit3,
  Settings,
  Car,
  CheckCircle,
  XCircle,
  AlertCircle,
  Camera,
  Award,
  TrendingUp,
  Activity,
  Lock,
  MessageCircle,
  User,
  MessageSquare
} from 'lucide-react';
import { useSupabaseAuth } from '@/app/providers/SupabaseAuthProvider';
import { supabaseApiClient } from '@/app/lib/supabaseApiClient';
import AuthGuard from '@/components/auth/AuthGuard';
import { useRouter } from 'next/navigation';

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
    status?: string;
    start_otp?: string | null;
    driver: {
      id: string;
      username?: string;
      full_name?: string;
      avatar_url?: string;
      rating?: number;
    };
  };
}

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const { user } = useSupabaseAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { data, error } = await supabaseApiClient.getBookings();
        if (error) {
          console.error('Failed to fetch bookings:', error);
        } else {
          setBookings((data as { bookings: Booking[] })?.bookings || []);
        }
      } catch (err) {
        console.error('Failed to fetch bookings:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchBookings();
    }
  }, [user]);

  const upcomingBookings = bookings.filter(booking =>
    ['PENDING', 'CONFIRMED', 'WAITLISTED'].includes(booking.status)
  );

  const pastBookings = bookings.filter(booking =>
    ['COMPLETED', 'CANCELLED'].includes(booking.status)
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return 'text-green-600 bg-green-50';
      case 'WAITLISTED': return 'text-violet-700 bg-violet-50';
      case 'PENDING': return 'text-yellow-600 bg-yellow-50';
      case 'COMPLETED': return 'text-blue-600 bg-blue-50';
      case 'CANCELLED': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return <CheckCircle className="h-4 w-4" />;
      case 'WAITLISTED': return <AlertCircle className="h-4 w-4" />;
      case 'PENDING': return <AlertCircle className="h-4 w-4" />;
      case 'COMPLETED': return <CheckCircle className="h-4 w-4" />;
      case 'CANCELLED': return <XCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  if (!user) {
    return null;
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-50 to-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Profile Header */}
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8 border border-gray-100">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
              <div className="flex items-center space-x-6 mb-4 md:mb-0">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-r from-slate-600 to-slate-800 rounded-full flex items-center justify-center text-4xl text-white">
                    {(user.user_metadata?.full_name || user.user_metadata?.username || user.email)?.[0]?.toUpperCase()}
                  </div>
                  <button
                    type="button"
                    className="absolute -top-2 -right-2 bg-slate-700 rounded-full p-2 text-white hover:bg-slate-800 transition-colors shadow-md border-2 border-white"
                  >
                    <Camera className="h-3 w-3" />
                  </button>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-1">
                    {user.user_metadata?.full_name || user.user_metadata?.username || 'User'}
                  </h1>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-gray-600 mb-2">
                    <div className="flex items-center space-x-1">
                      <Mail className="h-4 w-4" />
                      <span>{user.email}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                    <div className="flex items-center space-x-1 text-gray-600">
                      <Car className="h-4 w-4" />
                      <span>{bookings.length} bookings</span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>Since {new Date(user.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => router.push('/reviews')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-semibold flex items-center space-x-2 transition-colors"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>View Reviews</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(!isEditing)}
                  className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-xl font-semibold flex items-center space-x-2 transition-colors"
                >
                  <Edit3 className="h-4 w-4" />
                  <span>Edit Profile</span>
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {[
                { label: 'Total Bookings', value: bookings.length, icon: Activity, color: 'blue' },
                { label: 'Upcoming', value: upcomingBookings.length, icon: Calendar, color: 'green' },
                { label: 'Completed', value: pastBookings.filter(b => b.status === 'COMPLETED').length, icon: Award, color: 'purple' },
                { label: 'Total Spent', value: `₹${bookings.reduce((sum, b) => sum + b.total_price, 0).toFixed(2)}`, icon: TrendingUp, color: 'orange' },
              ].map(stat => (
                <div
                  key={stat.label}
                  className="bg-gradient-to-r from-slate-50 to-gray-100 p-4 rounded-xl border border-slate-100"
                >
                  <div className="flex items-center space-x-2 text-slate-800 font-semibold">
                    <stat.icon className="h-5 w-5 text-blue-500" />
                    <span>{stat.label}</span>
                  </div>
                  <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="bg-white rounded-2xl shadow-lg p-2 mb-8 border border-gray-100">
            <div className="flex space-x-1 relative">
              {[
                { id: 'overview', label: 'Overview', icon: User },
                { id: 'upcoming', label: 'Upcoming Rides', icon: Calendar },
                { id: 'history', label: 'Ride History', icon: Clock },
                { id: 'settings', label: 'Account Settings', icon: Settings }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex-1 flex items-center justify-center gap-2 px-3 sm:px-4 py-3 rounded-xl font-semibold transition-colors min-w-0 ${activeTab === tab.id ? 'text-white bg-slate-800' : 'text-slate-700 hover:bg-slate-100'
                    }`}
                >
                  <tab.icon className="h-4 w-4 shrink-0" />
                  <span className="inline text-left truncate">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
              {activeTab === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                      <User className="h-5 w-5" />
                      <span>Personal Information</span>
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Full Name</label>
                        <p className="text-gray-900">{user.user_metadata?.full_name || 'Not provided'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Email</label>
                        <p className="text-gray-900">{user.email}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Username</label>
                        <p className="text-gray-900">{user.user_metadata?.username || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                      <Settings className="h-5 w-5" />
                      <span>Account Status</span>
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Email Verified</label>
                        <p className="text-gray-900">{user.email_confirmed_at ? 'Yes' : 'No'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Member Since</label>
                        <p className="text-gray-900">{new Date(user.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'upcoming' && (
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
                  <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-slate-700" />
                    <span>Upcoming Rides ({upcomingBookings.length})</span>
                  </h2>
                  {loading ? (
                    <div className="text-center py-8 text-slate-600">Loading...</div>
                  ) : upcomingBookings.length === 0 ? (
                    <div className="text-center py-8 text-slate-600">No upcoming rides</div>
                  ) : (
                    <div className="space-y-4">
                      {upcomingBookings.map((booking) => (
                        <div
                          key={booking.id}
                          className="border border-slate-200 rounded-xl p-4 transition-shadow hover:shadow-md bg-slate-50/50"
                        >
                          <div className="flex justify-between items-start gap-4">
                            <div className="min-w-0">
                              <h3 className="font-semibold text-slate-900">
                                {booking.ride.origin} → {booking.ride.destination}
                              </h3>
                              {booking.ride.status === 'IN_PROGRESS' && booking.ride.start_otp && (
                                <div className="mt-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 inline-block">
                                  <p className="text-xs font-medium text-amber-800">Show driver this OTP</p>
                                  <p className="text-lg font-mono font-bold text-amber-900 tracking-widest">{booking.ride.start_otp}</p>
                                </div>
                              )}
                              <p className="text-sm text-slate-600 mt-1">
                                {new Date(booking.ride.departure_time).toLocaleString()}
                              </p>
                              <p className="text-sm text-slate-600">
                                Driver: {booking.ride.driver?.full_name || booking.ride.driver?.username || 'Unknown'}
                              </p>
                            </div>
                            <div className="text-right shrink-0">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                                {getStatusIcon(booking.status)}
                                <span className="ml-1">{booking.status}</span>
                              </span>
                              <p className="text-sm text-slate-700 mt-1 font-medium">
                                ₹{Number(booking.total_price).toFixed(0)} ({booking.seats_booked} seats)
                              </p>
                              <button
                                type="button"
                                onClick={() => router.push(`/chat/${booking.id}`)}
                                className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-slate-100 text-slate-700 px-3 py-1.5 text-sm hover:bg-slate-200"
                              >
                                <MessageSquare className="h-4 w-4" />
                                Chat
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'history' && (
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                    <Clock className="h-5 w-5" />
                    <span>Ride History ({pastBookings.length})</span>
                  </h2>
                  {loading ? (
                    <div className="text-center py-8">Loading...</div>
                  ) : pastBookings.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">No ride history</div>
                  ) : (
                    <div className="space-y-4">
                      {pastBookings.map((booking) => (
                        <div
                          key={booking.id}
                          className="border border-gray-200 rounded-xl p-4 transition-shadow hover:shadow-md"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium text-gray-900">
                                {booking.ride.origin} → {booking.ride.destination}
                              </h3>
                              {booking.ride.status === 'IN_PROGRESS' && booking.ride.start_otp && (
                                <div className="mt-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 inline-block">
                                  <p className="text-xs font-medium text-amber-800">Show driver this OTP</p>
                                  <p className="text-lg font-mono font-bold text-amber-900 tracking-widest">{booking.ride.start_otp}</p>
                                </div>
                              )}
                              <p className="text-sm text-gray-600">
                                {new Date(booking.ride.departure_time).toLocaleString()}
                              </p>
                              <p className="text-sm text-gray-600">
                                Driver: {booking.ride.driver.full_name || booking.ride.driver.username || 'Unknown'}
                              </p>
                            </div>
                            <div className="text-right">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                                {getStatusIcon(booking.status)}
                                <span className="ml-1">{booking.status}</span>
                              </span>
                              <p className="text-sm text-gray-600 mt-1">
                                ₹{booking.total_price} ({booking.seats_booked} seats)
                              </p>
                              <button
                                type="button"
                                onClick={() => router.push(`/chat/${booking.id}`)}
                                className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-slate-100 text-slate-700 px-3 py-1.5 text-sm hover:bg-slate-200"
                              >
                                <MessageSquare className="h-4 w-4" />
                                Chat
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                      <Settings className="h-5 w-5" />
                      <span>Account Settings</span>
                    </h2>
                    <p className="text-gray-600">Profile editing functionality coming soon...</p>
                  </div>
                  <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                      <Lock className="h-5 w-5" />
                      <span>Security</span>
                    </h2>
                    <p className="text-gray-600">Security settings coming soon...</p>
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>
    </AuthGuard>
  );
};

export default ProfilePage;