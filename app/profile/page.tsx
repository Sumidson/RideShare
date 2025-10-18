'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
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
  MessageCircle
} from 'lucide-react';
import { useSupabaseAuth } from '@/app/providers/SupabaseAuthProvider';
import { apiClient } from '@/app/lib/api';
import AuthGuard from '@/components/auth/AuthGuard';
import { useRouter } from 'next/navigation';

// Animation variants for consistency across the app
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const cardHoverVariant = {
  hover: {
    scale: 1.03,
    transition: { duration: 0.2 }
  }
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
        const { data, error } = await apiClient.getBookings();
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
    ['PENDING', 'CONFIRMED'].includes(booking.status)
  );

  const pastBookings = bookings.filter(booking => 
    ['COMPLETED', 'CANCELLED'].includes(booking.status)
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return 'text-green-600 bg-green-50';
      case 'PENDING': return 'text-yellow-600 bg-yellow-50';
      case 'COMPLETED': return 'text-blue-600 bg-blue-50';
      case 'CANCELLED': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return <CheckCircle className="h-4 w-4" />;
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
        <motion.div 
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Profile Header */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8 border border-gray-100"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
              <div className="flex items-center space-x-6 mb-4 md:mb-0">
                <div className="relative">
                  <motion.div 
                    className="w-24 h-24 bg-gradient-to-r from-slate-600 to-slate-800 rounded-full flex items-center justify-center text-4xl text-white"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, type: 'spring' }}
                  >
                    {user.full_name?.[0] || user.username?.[0] || user.email[0].toUpperCase()}
                  </motion.div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute -top-2 -right-2 bg-slate-700 rounded-full p-2 text-white hover:bg-slate-800 transition-colors shadow-md border-2 border-white"
                  >
                    <Camera className="h-3 w-3" />
                  </motion.button>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-1">
                    {user.full_name || user.username || 'User'}
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
                <motion.button 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }} 
                  onClick={() => router.push('/reviews')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-semibold flex items-center space-x-2 transition-colors"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>View Reviews</span>
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }} 
                  onClick={() => setIsEditing(!isEditing)} 
                  className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-xl font-semibold flex items-center space-x-2 transition-colors"
                >
                  <Edit3 className="h-4 w-4" />
                  <span>Edit Profile</span>
                </motion.button>
              </div>
            </div>
            
            {/* Stats Cards */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
              variants={containerVariants}
            >
              {[
                { label: 'Total Bookings', value: bookings.length, icon: Activity, color: 'blue' },
                { label: 'Upcoming', value: upcomingBookings.length, icon: Calendar, color: 'green' },
                { label: 'Completed', value: pastBookings.filter(b => b.status === 'COMPLETED').length, icon: Award, color: 'purple' },
                { label: 'Total Spent', value: `$${bookings.reduce((sum, b) => sum + b.total_price, 0).toFixed(2)}`, icon: TrendingUp, color: 'orange' },
              ].map(stat => (
                <motion.div 
                  key={stat.label} 
                  className="bg-gradient-to-r from-slate-50 to-gray-100 p-4 rounded-xl border border-slate-100"
                  variants={{...itemVariants, ...cardHoverVariant}}
                  whileHover="hover"
                >
                  <div className="flex items-center space-x-2 text-slate-800 font-semibold">
                    <stat.icon className="h-5 w-5 text-blue-500" />
                    <span>{stat.label}</span>
                  </div>
                  <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Tab Navigation */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-2xl shadow-lg p-2 mb-8 border border-gray-100"
          >
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
                  className={`relative flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-semibold transition-colors ${
                    activeTab === tab.id ? 'text-white' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTabPill"
                      className="absolute inset-0 bg-slate-800 rounded-xl z-0"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                  <tab.icon className="h-4 w-4 z-10" />
                  <span className="hidden sm:inline z-10">{tab.label}</span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="space-y-6"
            >
              {activeTab === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <motion.div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100" variants={itemVariants}>
                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                      <User className="h-5 w-5" />
                      <span>Personal Information</span>
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Full Name</label>
                        <p className="text-gray-900">{user.full_name || 'Not provided'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Email</label>
                        <p className="text-gray-900">{user.email}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Username</label>
                        <p className="text-gray-900">{user.username || 'Not provided'}</p>
                      </div>
                    </div>
                  </motion.div>
                  <motion.div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100" variants={itemVariants}>
                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                      <Settings className="h-5 w-5" />
                      <span>Account Status</span>
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Email Verified</label>
                        <p className="text-gray-900">{user.email_verified ? 'Yes' : 'No'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Member Since</label>
                        <p className="text-gray-900">{new Date(user.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}
              
              {activeTab === 'upcoming' && (
                <motion.div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100" variants={itemVariants}>
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                    <Calendar className="h-5 w-5" />
                    <span>Upcoming Rides ({upcomingBookings.length})</span>
                  </h2>
                  {loading ? (
                    <div className="text-center py-8">Loading...</div>
                  ) : upcomingBookings.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">No upcoming rides</div>
                  ) : (
                    <motion.div className="space-y-4" variants={containerVariants}>
                      {upcomingBookings.map((booking) => (
                        <motion.div 
                          key={booking.id} 
                          variants={{...itemVariants, ...cardHoverVariant}} 
                          whileHover="hover" 
                          className="border border-gray-200 rounded-xl p-4 transition-shadow hover:shadow-md"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium text-gray-900">
                                {booking.ride.origin} → {booking.ride.destination}
                              </h3>
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
                                ${booking.total_price} ({booking.seats_booked} seats)
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </motion.div>
              )}
              
              {activeTab === 'history' && (
                <motion.div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100" variants={itemVariants}>
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                    <Clock className="h-5 w-5" />
                    <span>Ride History ({pastBookings.length})</span>
                  </h2>
                  {loading ? (
                    <div className="text-center py-8">Loading...</div>
                  ) : pastBookings.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">No ride history</div>
                  ) : (
                    <motion.div className="space-y-4" variants={containerVariants}>
                      {pastBookings.map((booking) => (
                        <motion.div 
                          key={booking.id} 
                          variants={{...itemVariants, ...cardHoverVariant}} 
                          whileHover="hover" 
                          className="border border-gray-200 rounded-xl p-4 transition-shadow hover:shadow-md"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium text-gray-900">
                                {booking.ride.origin} → {booking.ride.destination}
                              </h3>
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
                                ${booking.total_price} ({booking.seats_booked} seats)
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </motion.div>
              )}
              
              {activeTab === 'settings' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <motion.div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100" variants={itemVariants}>
                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                      <Settings className="h-5 w-5" />
                      <span>Account Settings</span>
                    </h2>
                    <p className="text-gray-600">Profile editing functionality coming soon...</p>
                  </motion.div>
                  <motion.div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100" variants={itemVariants}>
                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                      <Lock className="h-5 w-5" />
                      <span>Security</span>
                    </h2>
                    <p className="text-gray-600">Security settings coming soon...</p>
                  </motion.div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </AuthGuard>
  );
};

export default ProfilePage;