'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
// 1. Import motion and AnimatePresence from framer-motion
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  MapPin, 
  Clock, 
  Star, 
  Car, 
  Filter, 
  ArrowRight, 
  Calendar, 
  DollarSign,
  Users,
  Shield,
  Zap,
  ChevronDown
} from 'lucide-react';


// 2. Define animation variants (similar to your landing page for a consistent feel)
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const rideCardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" }
  },
  hover: {
    scale: 1.03,
    boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.1)",
    transition: { duration: 0.3 }
  }
};


const RidesPage = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const handleBooking = (rideId) => {
    router.push(`/booking-details/${rideId}`);
  };

  const rides = [
    // ... your existing rides data remains unchanged
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
        avatar: 'SJ',
        duration: '45 min',
        verified: true,
        carColor: 'Silver',
        description: 'Comfortable ride with AC and phone charger',
        distance: '18.5 km',
        instantBook: true
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
        avatar: 'MC',
        duration: '32 min',
        verified: true,
        carColor: 'Black',
        description: 'Quiet ride, perfect for work calls',
        distance: '12.3 km',
        instantBook: false
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
        avatar: 'ED',
        duration: '38 min',
        verified: true,
        carColor: 'White',
        description: 'Pet-friendly ride with extra space',
        distance: '15.7 km',
        instantBook: true
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
        avatar: 'JW',
        duration: '25 min',
        verified: false,
        carColor: 'Blue',
        description: 'Premium ride with leather seats',
        distance: '8.2 km',
        instantBook: false
      }
  ];

  // ... your filtering logic remains unchanged
  const filteredRides = rides.filter(ride => {
    const matchesSearch = ride.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          ride.to.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          ride.driver.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedFilter === 'today') return matchesSearch && ride.date === 'Today';
    if (selectedFilter === 'tomorrow') return matchesSearch && ride.date === 'Tomorrow';
    if (selectedFilter === 'verified') return matchesSearch && ride.verified;
    if (selectedFilter === 'instant') return matchesSearch && ride.instantBook;
    
    return matchesSearch;
  });

  return (
    // 3. Apply motion to components throughout the page
    <motion.div 
      className="min-h-screen bg-white"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div className="pt-12 pb-8 text-center" variants={itemVariants}>
          <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-4">
            Available <span className="font-medium">Rides</span>
          </h1>
          <p className="text-xl text-gray-600 font-light">
            Find your perfect journey with trusted drivers
          </p>
        </motion.div>

        {/* Search Section */}
        <motion.div 
          className="bg-gray-50 rounded-2xl p-8 mb-12 border border-gray-100"
          variants={itemVariants}
        >
          <div className="max-w-2xl mx-auto">
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search destinations or driver names..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-300"
              />
            </div>

            {/* Filters */}
            <motion.div 
              className="flex flex-wrap gap-3 justify-center"
              variants={containerVariants}
            >
              {[
                { key: 'all', label: 'All Rides', count: rides.length },
                { key: 'today', label: 'Today', count: rides.filter(r => r.date === 'Today').length },
                { key: 'tomorrow', label: 'Tomorrow', count: rides.filter(r => r.date === 'Tomorrow').length },
                { key: 'verified', label: 'Verified', count: rides.filter(r => r.verified).length },
                { key: 'instant', label: 'Instant Book', count: rides.filter(r => r.instantBook).length }
              ].map((filter) => (
                <motion.button
                  key={filter.key}
                  onClick={() => setSelectedFilter(filter.key)}
                  className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                    selectedFilter === filter.key
                      ? 'bg-gray-900 text-white shadow-md'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {filter.label}
                  {filter.count > 0 && (
                    <span className={`ml-2 text-sm ${
                      selectedFilter === filter.key ? 'text-gray-300' : 'text-gray-400'
                    }`}>
                      {filter.count}
                    </span>
                  )}
                </motion.button>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Results Summary */}
        <motion.div className="flex items-center justify-between mb-8" variants={itemVariants}>
          <p className="text-gray-600 font-light">
            {filteredRides.length} ride{filteredRides.length !== 1 ? 's' : ''} available
          </p>
          <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-300">
            <span className="text-sm font-medium">Sort by price</span>
            <ChevronDown className="w-4 h-4" />
          </button>
        </motion.div>

        {/* Rides Grid */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={selectedFilter} // Re-animate when filter changes
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {filteredRides.length === 0 ? (
              <motion.div 
                className="text-center py-20"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">No rides found</h3>
                <p className="text-gray-600 font-light">Try adjusting your search or filters</p>
              </motion.div>
            ) : (
              filteredRides.map((ride) => (
                <motion.div
                  key={ride.id}
                  className="bg-white border border-gray-100 rounded-2xl p-6"
                  variants={rideCardVariants}
                  whileHover="hover"
                  layout // This prop animates layout changes smoothly
                >
                    {/* ... The inner structure of your ride card remains unchanged ... */}
                    <div className="grid lg:grid-cols-12 gap-6 items-center">
                        <div className="lg:col-span-3">
                            {/* ... driver info ... */}
                        </div>
                        <div className="lg:col-span-4">
                            {/* ... route info ... */}
                        </div>
                        <div className="lg:col-span-3">
                            {/* ... trip details ... */}
                        </div>
                        <div className="lg:col-span-2 text-right">
                            {/* ... price & action ... */}
                            <motion.button
                              onClick={() => handleBooking(ride.id)}
                              className="w-full bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <span>Book Now</span>
                              <ArrowRight className="w-4 h-4" />
                            </motion.button>
                        </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-50">
                        <p className="text-sm text-gray-600 font-light">{ride.description}</p>
                    </div>
                </motion.div>
              ))
            )}
          </motion.div>
        </AnimatePresence>
      </div>

       {/* Load More & Bottom CTA can also be wrapped in motion.div with itemVariants */}
      <motion.div className="text-center" variants={itemVariants}>
        {filteredRides.length > 0 && (
          <div className="text-center py-16">
            <motion.button 
              className="px-8 py-4 border border-gray-200 text-gray-700 rounded-xl font-medium hover:border-gray-300 hover:bg-gray-50 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Load more rides
            </motion.button>
          </div>
        )}

        <div className="py-16 text-center border-t border-gray-100 mt-16">
          <h2 className="text-2xl font-light text-gray-900 mb-4">
            Can't find the perfect ride?
          </h2>
          <p className="text-gray-600 font-light mb-8">
            Create your own trip and let drivers come to you
          </p>
          <motion.button 
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-medium transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Post Your Trip
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default RidesPage;