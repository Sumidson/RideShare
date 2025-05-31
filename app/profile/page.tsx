'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Star,
  MapPin,
  Clock,
  Calendar,
  Phone,
  Mail,
  Edit3,
  Settings,
  Shield,
  CreditCard,
  Bell,
  Car,
  Navigation,
  CheckCircle,
  XCircle,
  AlertCircle,
  DollarSign,
  MessageCircle,
  Camera,
  Award,
  TrendingUp,
  Activity,
  Lock,
  Eye,
  EyeOff,
  Trash2,
  Download
} from 'lucide-react';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const userData = {
    name: 'Alex Thompson',
    email: 'alex.thompson@email.com',
    phone: '+1 (555) 123-4567',
    joinDate: 'March 2023',
    rating: 4.8,
    totalRides: 127,
    verified: true,
    profileImage: '👤',
    bio: 'Friendly commuter who loves sharing rides and meeting new people. Always punctual and respectful.',
    emergencyContact: {
      name: 'Sarah Thompson',
      relationship: 'Sister',
      phone: '+1 (555) 987-6543'
    },
    preferences: {
      musicAllowed: true,
      smokingAllowed: false,
      petsAllowed: true,
      chattiness: 'Moderate'
    }
  };

  const upcomingRides = [
    {
      id: 1,
      type: 'passenger',
      driver: 'Maria Garcia',
      driverAvatar: '👩‍💼',
      from: 'Home',
      to: 'Downtown Office',
      date: '2025-06-02',
      time: '8:30 AM',
      price: 15,
      status: 'confirmed',
      car: 'Honda Accord',
      driverRating: 4.9
    },
    {
      id: 2,
      type: 'passenger',
      driver: 'John Wilson',
      driverAvatar: '👨‍💻',
      from: 'Airport Terminal 1',
      to: 'Hotel Downtown',
      date: '2025-06-05',
      time: '3:45 PM',
      price: 35,
      status: 'pending',
      car: 'Toyota Camry',
      driverRating: 4.7
    }
  ];

  const pastRides = [
    {
      id: 1,
      type: 'passenger',
      driver: 'Emma Davis',
      driverAvatar: '👩‍🎨',
      from: 'Central Mall',
      to: 'Home',
      date: '2025-05-28',
      time: '6:20 PM',
      price: 12,
      status: 'completed',
      rating: 5,
      car: 'Nissan Altima'
    },
    {
      id: 2,
      type: 'passenger',
      driver: 'Michael Chen',
      driverAvatar: '👨‍🔧',
      from: 'University Campus',
      to: 'City Center',
      date: '2025-05-25',
      time: '2:15 PM',
      price: 8,
      status: 'completed',
      rating: 4,
      car: 'Ford Focus'
    },
    {
      id: 3,
      type: 'passenger',
      driver: 'Lisa Johnson',
      driverAvatar: '👩‍⚕️',
      from: 'Home',
      to: 'Medical Center',
      date: '2025-05-20',
      time: '9:00 AM',
      price: 18,
      status: 'completed',
      rating: 5,
      car: 'Hyundai Elantra'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-600 bg-green-50';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      case 'completed':
        return 'text-blue-600 bg-blue-50';
      case 'cancelled':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-4 w-4" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8 border border-gray-100"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
            <div className="flex items-center space-x-6 mb-4 md:mb-0">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-4xl text-white">
                  {userData.profileImage}
                </div>
                {userData.verified && (
                  <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-1">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                )}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute -top-2 -right-2 bg-blue-600 rounded-full p-2 text-white hover:bg-blue-700 transition-colors"
                >
                  <Camera className="h-3 w-3" />
                </motion.button>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-1">{userData.name}</h1>
                <div className="flex items-center space-x-4 text-gray-600 mb-2">
                  <div className="flex items-center space-x-1">
                    <Mail className="h-4 w-4" />
                    <span>{userData.email}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Phone className="h-4 w-4" />
                    <span>{userData.phone}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{userData.rating}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-gray-600">
                    <Car className="h-4 w-4" />
                    <span>{userData.totalRides} rides</span>
                  </div>
                  <div className="flex items-center space-x-1 text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>Since {userData.joinDate}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex space-x-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsEditing(!isEditing)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-semibold flex items-center space-x-2 transition-colors"
              >
                <Edit3 className="h-4 w-4" />
                <span>Edit Profile</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl font-semibold flex items-center space-x-2 transition-colors"
              >
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </motion.button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl">
              <div className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-blue-600" />
                <span className="text-blue-900 font-semibold">Total Rides</span>
              </div>
              <p className="text-2xl font-bold text-blue-600">{userData.totalRides}</p>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-xl">
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-green-600" />
                <span className="text-green-900 font-semibold">Rating</span>
              </div>
              <p className="text-2xl font-bold text-green-600">{userData.rating}/5.0</p>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-xl">
              <div className="flex items-center space-x-2">
                <Award className="h-5 w-5 text-purple-600" />
                <span className="text-purple-900 font-semibold">Status</span>
              </div>
              <p className="text-2xl font-bold text-purple-600">Verified</p>
            </div>
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-xl">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-orange-600" />
                <span className="text-orange-900 font-semibold">Savings</span>
              </div>
              <p className="text-2xl font-bold text-orange-600">$1,240</p>
            </div>
          </div>

          {/* Bio */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-semibold text-gray-900 mb-2">About Me</h3>
            <p className="text-gray-600">{userData.bio}</p>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-2 mb-8 border border-gray-100"
        >
          <div className="flex space-x-1">
            {[
              { id: 'overview', label: 'Overview', icon: User },
              { id: 'upcoming', label: 'Upcoming Rides', icon: Calendar },
              { id: 'history', label: 'Ride History', icon: Clock },
              { id: 'settings', label: 'Account Settings', icon: Settings }
            ].map((tab) => (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
              {/* Personal Information */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Personal Information</span>
                </h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Full Name</label>
                      <p className="font-semibold text-gray-900">{userData.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Join Date</label>
                      <p className="font-semibold text-gray-900">{userData.joinDate}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email Address</label>
                    <p className="font-semibold text-gray-900">{userData.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Phone Number</label>
                    <p className="font-semibold text-gray-900">{userData.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Emergency Contact</label>
                    <div className="bg-gray-50 rounded-lg p-3 mt-1">
                      <p className="font-semibold text-gray-900">{userData.emergencyContact.name}</p>
                      <p className="text-sm text-gray-600">{userData.emergencyContact.relationship}</p>
                      <p className="text-sm text-gray-600">{userData.emergencyContact.phone}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ride Preferences */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>Ride Preferences</span>
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Music Allowed</span>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      userData.preferences.musicAllowed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {userData.preferences.musicAllowed ? 'Yes' : 'No'}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Smoking Allowed</span>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      userData.preferences.smokingAllowed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {userData.preferences.smokingAllowed ? 'Yes' : 'No'}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Pets Allowed</span>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      userData.preferences.petsAllowed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {userData.preferences.petsAllowed ? 'Yes' : 'No'}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Chattiness Level</span>
                    <div className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {userData.preferences.chattiness}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'upcoming' && (
            <motion.div
              key="upcoming"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Upcoming Rides ({upcomingRides.length})</span>
                </h2>
                <div className="space-y-4">
                  {upcomingRides.map((ride) => (
                    <motion.div
                      key={ride.id}
                      whileHover={{ scale: 1.01 }}
                      className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="text-2xl">{ride.driverAvatar}</div>
                          <div>
                            <p className="font-semibold text-gray-900">{ride.driver}</p>
                            <div className="flex items-center space-x-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm text-gray-600">{ride.driverRating}</span>
                              <span className="text-gray-400">•</span>
                              <span className="text-sm text-gray-600">{ride.car}</span>
                            </div>
                          </div>
                        </div>
                        <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(ride.status)}`}>
                          {getStatusIcon(ride.status)}
                          <span className="capitalize">{ride.status}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">From:</span>
                          <p className="font-semibold">{ride.from}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">To:</span>
                          <p className="font-semibold">{ride.to}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Date & Time:</span>
                          <p className="font-semibold">{ride.date} at {ride.time}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Price:</span>
                          <p className="font-semibold text-green-600">${ride.price}</p>
                        </div>
                      </div>
                      <div className="flex space-x-3 mt-4">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors"
                        >
                          <MessageCircle className="h-4 w-4" />
                          <span>Message</span>
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                          Cancel
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>Ride History ({pastRides.length})</span>
                </h2>
                <div className="space-y-4">
                  {pastRides.map((ride) => (
                    <motion.div
                      key={ride.id}
                      whileHover={{ scale: 1.01 }}
                      className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="text-2xl">{ride.driverAvatar}</div>
                          <div>
                            <p className="font-semibold text-gray-900">{ride.driver}</p>
                            <div className="flex items-center space-x-1">
                              <span className="text-sm text-gray-600">{ride.car}</span>
                              <span className="text-gray-400">•</span>
                              <span className="text-sm text-gray-600">{ride.date}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${
                                  i < ride.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm font-medium text-gray-600">({ride.rating}/5)</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">From:</span>
                          <p className="font-semibold">{ride.from}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">To:</span>
                          <p className="font-semibold">{ride.to}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Time:</span>
                          <p className="font-semibold">{ride.time}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Price:</span>
                          <p className="font-semibold text-green-600">${ride.price}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="text-center mt-6">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold transition-colors"
                  >
                    Load More History
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
              {/* Account Settings */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>Account Settings</span>
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Bell className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-700">Email Notifications</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-700">SMS Notifications</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Shield className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-700">Two-Factor Authentication</span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-sm font-medium"
                    >
                      Enabled
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProfilePage;
