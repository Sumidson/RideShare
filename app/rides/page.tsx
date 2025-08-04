'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
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

const RidesPage = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const handleBooking = (rideId) => {
    try {
      router.push(`/booking-details/${rideId}`);
    } catch (error) {
      console.error('Navigation error:', error);
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
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="pt-12 pb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-4">
            Available <span className="font-medium">Rides</span>
          </h1>
          <p className="text-xl text-gray-600 font-light">
            Find your perfect journey with trusted drivers
          </p>
        </div>

        {/* Search Section */}
        <div className="bg-gray-50 rounded-2xl p-8 mb-12 border border-gray-100">
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
            <div className="flex flex-wrap gap-3 justify-center">
              {[
                { key: 'all', label: 'All Rides', count: rides.length },
                { key: 'today', label: 'Today', count: rides.filter(r => r.date === 'Today').length },
                { key: 'tomorrow', label: 'Tomorrow', count: rides.filter(r => r.date === 'Tomorrow').length },
                { key: 'verified', label: 'Verified', count: rides.filter(r => r.verified).length },
                { key: 'instant', label: 'Instant Book', count: rides.filter(r => r.instantBook).length }
              ].map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setSelectedFilter(filter.key)}
                  className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                    selectedFilter === filter.key
                      ? 'bg-gray-900 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {filter.label}
                  {filter.count > 0 && (
                    <span className={`ml-2 text-sm ${
                      selectedFilter === filter.key ? 'text-gray-300' : 'text-gray-400'
                    }`}>
                      {filter.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-8">
          <p className="text-gray-600 font-light">
            {filteredRides.length} ride{filteredRides.length !== 1 ? 's' : ''} available
          </p>
          <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-300">
            <span className="text-sm font-medium">Sort by price</span>
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        {/* Rides Grid */}
        <div className="space-y-6">
          {filteredRides.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">No rides found</h3>
              <p className="text-gray-600 font-light">Try adjusting your search or filters</p>
            </div>
          ) : (
            filteredRides.map((ride) => (
              <div
                key={ride.id}
                className="bg-white border border-gray-100 rounded-2xl p-6 hover:border-gray-200 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="grid lg:grid-cols-12 gap-6 items-center">
                  
                  {/* Driver Info */}
                  <div className="lg:col-span-3">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                        {ride.avatar}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-gray-900">{ride.driver}</h3>
                          {ride.verified && (
                            <div className="flex items-center gap-1">
                              <Shield className="w-3 h-3 text-green-600" />
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm text-gray-600">{ride.rating}</span>
                          <span className="text-xs text-gray-400">({ride.reviewCount})</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{ride.car} • {ride.carColor}</p>
                      </div>
                    </div>
                  </div>

                  {/* Route */}
                  <div className="lg:col-span-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="font-medium text-gray-900">{ride.from}</span>
                      </div>
                      <div className="flex items-center gap-3 pl-5">
                        <div className="w-px h-6 bg-gray-200"></div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="font-medium text-gray-900">{ride.to}</span>
                      </div>
                    </div>
                  </div>

                  {/* Trip Details */}
                  <div className="lg:col-span-3">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{ride.date}, {ride.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{ride.duration} • {ride.distance}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="w-4 h-4" />
                        <span>{ride.seats} seats available</span>
                      </div>
                      {ride.instantBook && (
                        <div className="flex items-center gap-2 text-sm text-blue-600">
                          <Zap className="w-4 h-4" />
                          <span>Instant booking</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Price & Action */}
                  <div className="lg:col-span-2 text-right">
                    <div className="mb-4">
                      <div className="text-2xl font-light text-gray-900 mb-1">
                        ${ride.price}
                      </div>
                      <p className="text-sm text-gray-500">per seat</p>
                    </div>
                    
                    <button
                      onClick={() => handleBooking(ride.id)}
                      className="w-full bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 group-hover:scale-105 flex items-center justify-center gap-2"
                    >
                      <span>Book Now</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Description */}
                <div className="mt-4 pt-4 border-t border-gray-50">
                  <p className="text-sm text-gray-600 font-light">{ride.description}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Load More */}
        {filteredRides.length > 0 && (
          <div className="text-center py-16">
            <button className="px-8 py-4 border border-gray-200 text-gray-700 rounded-xl font-medium hover:border-gray-300 hover:bg-gray-50 transition-all duration-300">
              Load more rides
            </button>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="py-16 text-center border-t border-gray-100 mt-16">
          <h2 className="text-2xl font-light text-gray-900 mb-4">
            Can't find the perfect ride?
          </h2>
          <p className="text-gray-600 font-light mb-8">
            Create your own trip and let drivers come to you
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-medium transition-all duration-300 hover:scale-105">
            Post Your Trip
          </button>
        </div>
      </div>
    </div>
  );
};

export default RidesPage;
