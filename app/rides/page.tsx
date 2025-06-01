'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  MapPin, 
  Clock, 
  User, 
  Star, 
  Car, 
  Navigation, 
  Filter, 
  ArrowRight, 
  Calendar, 
  DollarSign,
  Users,
  Route,
  SlidersHorizontal
} from 'lucide-react';

const RidesPage = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Handle booking navigation
  const handleBooking = (rideId) => {
    try {
      router.push(`/booking-details?rideId=${rideId}`);
    } catch (error) {
      console.error('Navigation error:', error);
      // Fallback to window.location if router fails
      window.location.href = `/booking-details?rideId=${rideId}`;
    }
  };

  const rides = [
    {
      id: 1,
      driver: 'Sarah Johnson',
      rating: 4.8,
      reviewCount: 127,
      from: 'Downtown NYC',
      to: 'JFK Airport',
      time: '2:30 PM',
      date: 'Today',
      price: 25,
      seats: 3,
      car: 'Honda Civic',
      avatar: '👩‍💼',
      duration: '45 min',
      verified: true,
      carColor: 'Silver',
      description: 'Comfortable ride with AC and phone charger available'
    },
    {
      id: 2,
      driver: 'Michael Chen',
      rating: 4.9,
      reviewCount: 89,
      from: 'Brooklyn Heights',
      to: 'Manhattan',
      time: '4:15 PM',
      date: 'Today',
      price: 18,
      seats: 2,
      car: 'Toyota Camry',
      avatar: '👨‍💻',
      duration: '32 min',
      verified: true,
      carColor: 'Black',
      description: 'Quiet ride, perfect for work calls'
    },
    {
      id: 3,
      driver: 'Emma Davis',
      rating: 4.7,
      reviewCount: 156,
      from: 'Queens',
      to: 'LaGuardia Airport',
      time: '6:00 PM',
      date: 'Tomorrow',
      price: 22,
      seats: 4,
      car: 'Nissan Altima',
      avatar: '👩‍🎓',
      duration: '38 min',
      verified: true,
      carColor: 'White',
      description: 'Pet-friendly ride with extra space'
    },
    {
      id: 4,
      driver: 'James Wilson',
      rating: 4.6,
      reviewCount: 203,
      from: 'Times Square',
      to: 'Central Park',
      time: '7:45 PM',
      date: 'Today',
      price: 15,
      seats: 1,
      car: 'BMW 3 Series',
      avatar: '👨‍🏫',
      duration: '25 min',
      verified: false,
      carColor: 'Blue',
      description: 'Premium ride with leather seats'
    }
  ];

  const filteredRides = rides.filter(ride => {
    const matchesSearch = ride.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ride.to.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ride.driver.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedFilter === 'today') return matchesSearch && ride.date === 'Today';
    if (selectedFilter === 'tomorrow') return matchesSearch && ride.date === 'Tomorrow';
    if (selectedFilter === 'verified') return matchesSearch && ride.verified;
    
    return matchesSearch;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Available Rides
          </h1>
          <p className="text-gray-600 text-lg">Find your perfect ride and travel with confidence</p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        >
          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by location or driver name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            />
          </div>

          {/* Filter Toggle */}
          <div className="flex justify-between items-center">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <SlidersHorizontal className="w-5 h-5" />
              <span>Filters</span>
            </motion.button>
            <div className="text-sm text-gray-500">
              {filteredRides.length} ride{filteredRides.length !== 1 ? 's' : ''} found
            </div>
          </div>

          {/* Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-4 border-t border-gray-200"
              >
                <div className="flex flex-wrap gap-3">
                  {[
                    { key: 'all', label: 'All Rides' },
                    { key: 'today', label: 'Today' },
                    { key: 'tomorrow', label: 'Tomorrow' },
                    { key: 'verified', label: 'Verified Drivers' }
                  ].map((filter) => (
                    <motion.button
                      key={filter.key}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedFilter(filter.key)}
                      className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                        selectedFilter === filter.key
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {filter.label}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Rides List */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {filteredRides.length === 0 ? (
            <motion.div
              variants={cardVariants}
              className="text-center py-12"
            >
              <div className="text-6xl mb-4">🚗</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No rides found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </motion.div>
          ) : (
            filteredRides.map((ride) => (
              <motion.div
                key={ride.id}
                variants={cardVariants}
                whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
                className="bg-white rounded-2xl shadow-lg p-6 transition-all duration-300 border border-gray-100"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  {/* Driver Info */}
                  <div className="flex items-start space-x-4">
                    <div className="text-4xl">{ride.avatar}</div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h2 className="text-xl font-bold text-gray-800">{ride.driver}</h2>
                        {ride.verified && (
                          <div className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                            Verified
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-1 mb-2">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold text-gray-700">{ride.rating}</span>
                        <span className="text-gray-500 text-sm">({ride.reviewCount} reviews)</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Car className="h-4 w-4" />
                        <span className="text-sm">{ride.car} • {ride.carColor}</span>
                      </div>
                    </div>
                  </div>

                  {/* Route Info */}
                  <div className="flex-1 max-w-md">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="font-medium text-gray-800">{ride.from}</span>
                        </div>
                        <Route className="w-4 h-4 text-gray-400" />
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <span className="font-medium text-gray-800">{ride.to}</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center space-x-2 text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <span>{ride.date}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-600">
                          <Clock className="h-4 w-4" />
                          <span>{ride.time}</span>
                        </div>
                      </div>
                      
                      <div className="mt-3 text-xs text-gray-500">
                        {ride.description}
                      </div>
                    </div>
                  </div>

                  {/* Price and Booking */}
                  <div className="flex flex-col items-end space-y-4">
                    <div className="text-right">
                      <div className="flex items-center space-x-4 mb-2">
                        <div className="flex items-center space-x-2 text-gray-600">
                          <Users className="h-4 w-4" />
                          <span className="text-sm">{ride.seats} seats</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-600">
                          <Clock className="h-4 w-4" />
                          <span className="text-sm">{ride.duration}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <DollarSign className="h-5 w-5 text-green-600" />
                        <span className="text-2xl font-bold text-gray-800">{ride.price}</span>
                        <span className="text-gray-500 text-sm">per seat</span>
                      </div>
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleBooking(ride.id)}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
                    >
                      <span>Book Now</span>
                      <ArrowRight className="h-4 w-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>

        {/* Load More Button */}
        {filteredRides.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-12"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white hover:bg-gray-50 text-gray-700 px-8 py-3 rounded-xl font-semibold border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300"
            >
              Load More Rides
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default RidesPage;