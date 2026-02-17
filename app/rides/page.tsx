'use client';
import React, { useEffect, useState } from 'react';
import { apiClient } from '@/app/lib/api';
import { useRouter } from 'next/navigation';
// 1. Import motion and AnimatePresence from framer-motion
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  ArrowRight,
  ChevronDown,
  Bookmark,
  BookmarkCheck,
} from 'lucide-react';
import { addSavedRide, getSavedRidesFromStorage } from '@/app/lib/savedRides';


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

  const handleBooking = (rideId: string) => {
    router.push(`/booking-detials/${rideId}`);
  };

  interface RideItem {
    id: string
    origin: string
    destination: string
    departure_time: string
    available_seats: number
    price_per_seat: number
    description?: string
    driver?: { full_name?: string; username?: string; rating?: number }
  }

  const [rides, setRides] = useState<RideItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    setSavedIds(new Set(getSavedRidesFromStorage().map((s) => s.rideId)));
  }, []);

  const handleSaveRide = (e: React.MouseEvent, ride: RideItem) => {
    e.preventDefault();
    e.stopPropagation();
    const added = addSavedRide({
      id: ride.id,
      origin: ride.origin,
      destination: ride.destination,
      departure_time: ride.departure_time,
      price_per_seat: ride.price_per_seat,
    });
    if (added) setSavedIds((prev) => new Set(prev).add(ride.id));
  };

  useEffect(() => {
    const fetchRides = async () => {
      setLoading(true);
      try {
        const { data, error } = await apiClient.getRides();
        if (error) {
          console.error('Failed to fetch rides:', error);
          // If it's a database connection error, show a helpful message
          if (error.includes('Database connection error')) {
            setRides([]);
            // You could set a state to show a database setup message
          }
        } else {
          const items = ((data as { data: RideItem[] })?.data) || [];
          setRides(items);
        }
      } catch (err) {
        console.error('Error fetching rides:', err);
        setRides([]);
      } finally {
        setLoading(false);
      }
    }
    fetchRides();
  }, []);

  // ... your filtering logic remains unchanged
  const filteredRides = rides.filter(ride => {
    const matchesSearch = (
      ride.origin?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
      ride.destination?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
      ride.driver?.full_name?.toLowerCase()?.includes(searchTerm.toLowerCase())
    );
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
                { key: 'all', label: 'All Rides', count: rides.length }
              ].map((filter) => (
                <motion.button
                  key={filter.key}
                  onClick={() => setSelectedFilter(filter.key)}
                  className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${selectedFilter === filter.key
                      ? 'bg-gray-900 text-white shadow-md'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                    }`}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {filter.label}
                  {filter.count > 0 && (
                    <span className={`ml-2 text-sm ${selectedFilter === filter.key ? 'text-gray-300' : 'text-gray-400'
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
            {filteredRides.length} ride{filteredRides.length !== 1 ? "s" : ""} available
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
            {loading ? (
              <motion.div className="text-center py-20">Loading rides...</motion.div>
            ) : filteredRides.length === 0 ? (
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
                <p className="text-gray-600 font-light">
                  {rides.length === 0 && !loading ?
                    "No rides available. This might be because the database is not set up yet. Please check the DATABASE_SETUP.md file for setup instructions." :
                    "Try adjusting your search or filters"
                  }
                </p>
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
                  <div className="grid lg:grid-cols-12 gap-6 items-center">
                    <div className="lg:col-span-3">
                      <div className="font-medium text-gray-900">{ride.driver?.full_name || ride.driver?.username || 'Driver'}</div>
                      <div className="text-gray-500 text-sm">Rating: {ride.driver?.rating ?? '-'}</div>
                    </div>
                    <div className="lg:col-span-4">
                      <div className="text-gray-900 font-medium">{ride.origin} → {ride.destination}</div>
                      <div className="text-gray-500 text-sm">{new Date(ride.departure_time).toLocaleString()}</div>
                    </div>
                    <div className="lg:col-span-3">
                      <div className="text-gray-900">Seats: {ride.available_seats}</div>
                      <div className="text-gray-900">Price: ₹{ride.price_per_seat}</div>
                    </div>
                    <div className="lg:col-span-2 text-right flex flex-col sm:flex-row items-end gap-2 justify-end">
                      <motion.button
                        type="button"
                        onClick={(e) => handleSaveRide(e, ride)}
                        className="p-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-slate-50 hover:border-slate-300 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                        title={savedIds.has(ride.id) ? 'Saved' : 'Save for later'}
                      >
                        {savedIds.has(ride.id) ? (
                          <BookmarkCheck className="w-5 h-5 text-slate-700 fill-slate-700" />
                        ) : (
                          <Bookmark className="w-5 h-5" />
                        )}
                      </motion.button>
                      <motion.button
                        onClick={() => handleBooking(ride.id)}
                        className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2"
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
            Can’t find the perfect ride?
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