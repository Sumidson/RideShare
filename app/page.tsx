"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
// 1. IMPORT Link HERE
import Link from 'next/link';
import { Users, CheckCircle, Download, MapPin, Plus, Star, ArrowRight, X, IndianRupee, AlertTriangle, Shield, Phone, Calculator } from 'lucide-react';
import { supabaseApiClient } from '@/app/lib/supabaseApiClient';

interface RideItem {
  id: string;
  origin: string;
  destination: string;
  departure_time: string;
  available_seats: number;
  created_at: string;
  driver?: {
    full_name?: string;
    username?: string;
    avatar_url?: string;
    rating?: number;
  };
}


// Enhanced motion variants
const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" }
  },
  hover: {
    scale: 1.05,
    y: -5,
    transition: { duration: 0.3 }
  }
};

// Professional Cost Calculator Component with animations
const CostCalculator = () => {
  const [distance, setDistance] = useState(10);

  // Adjusted rates for INR
  const rideShareRate = 7; // ₹7/km
  const gooberRate = 18;
  const lolaRate = 17;
  const taxiRate = 16;

  const rideShareCost = distance * rideShareRate;
  const gooberCost = distance * gooberRate;
  const lolaCost = distance * lolaRate;
  const taxiCost = distance * taxiRate;

  const competitorAvgCost = (gooberCost + lolaCost + taxiCost) / 3;
  const competitorAvgRate = (gooberRate + lolaRate + taxiRate) / 3;

  return (
    <motion.div
      className="w-full max-w-full overflow-hidden"
      variants={itemVariants}
    >
      <motion.div
        className={`bg-white rounded-3xl p-6 lg:p-8 shadow-xl border border-slate-200 transition-all duration-500 w-full`}
        onMouseEnter={() => { }}
        onMouseLeave={() => { }}
        whileHover={{ scale: 1.02, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="flex items-center gap-4 mb-8"
          variants={itemVariants}
        >
          <motion.div
            className="w-14 h-14 bg-gradient-to-br from-slate-700 to-slate-900 rounded-2xl flex items-center justify-center shadow-lg"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            <Calculator className="w-7 h-7 text-white" />
          </motion.div>
          <div>
            <h3 className="text-2xl font-semibold text-slate-900">Calculate Savings</h3>
            <p className="text-slate-600 font-light">See how much you can save</p>
          </div>
        </motion.div>

        <motion.div className="space-y-8" variants={sectionVariants}>
          <motion.div variants={itemVariants}>
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm font-medium text-slate-700">Trip Distance</label>
              <motion.span
                className="text-lg font-semibold text-slate-900"
                key={distance}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                {distance} km
              </motion.span>
            </div>
            <div className="relative w-full">
              <input
                type="range"
                min="1"
                max="50"
                value={distance}
                onChange={(e) => setDistance(parseInt(e.target.value))}
                className="w-full h-3 bg-slate-200 rounded-full appearance-none cursor-pointer slider"
              />
              <motion.div
                className="absolute top-0 h-3 bg-gradient-to-r from-slate-700 to-slate-900 rounded-full pointer-events-none"
                style={{ width: `${(distance / 50) * 100}%` }}
                animate={{ width: `${(distance / 50) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <div className="flex justify-between text-xs text-slate-500 mt-2">
              <span>1 km</span>
              <span>50 km</span>
            </div>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 gap-4"
            variants={sectionVariants}
          >
            <motion.div
              className="text-center p-4 bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl border-2 border-emerald-200"
              variants={cardVariants}
              whileHover="hover"
            >
              <p className="text-sm font-medium text-emerald-700 mb-2">RideShare</p>
              <motion.p
                className="text-3xl font-bold text-emerald-600 mb-1"
                key={rideShareCost}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                ₹{rideShareCost}
              </motion.p>
              <p className="text-xs text-emerald-600">₹{rideShareRate}/km</p>
            </motion.div>

            <motion.div
              className="text-center p-4 bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl border border-red-200"
              variants={cardVariants}
              whileHover="hover"
            >
              <p className="text-sm font-medium text-red-700 mb-2">Others</p>
              <motion.p
                className="text-3xl font-bold text-red-600 mb-1"
                key={Math.round(competitorAvgCost)}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                ₹{Math.round(competitorAvgCost)}
              </motion.p>
              <p className="text-xs text-red-600">~₹{Math.round(competitorAvgRate)}/km avg</p>
            </motion.div>
          </motion.div>

          <motion.div
            className="bg-gradient-to-r from-slate-100 to-slate-200 p-6 rounded-2xl text-center"
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
          >
            <motion.p
              className="text-xl font-bold text-slate-800 mb-1"
              key={Math.round(competitorAvgCost - rideShareCost)}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              You save ₹{Math.round(competitorAvgCost - rideShareCost)} on this trip!
            </motion.p>
            <p className="text-sm text-slate-700">
              That&apos;s {Math.round((1 - (rideShareCost / competitorAvgCost)) * 100)}% less than competitors
            </p>
          </motion.div>

          <motion.button
            className="w-full bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black text-white py-4 rounded-2xl font-semibold shadow-lg"
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            Book This Trip
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

const ElegantRideshareLanding = () => {
  const [recentRides, setRecentRides] = useState<RideItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const { data } = await supabaseApiClient.getRides();
        if (data && Array.isArray(data)) {
          // Sort by closest departure time or creation? 
          // API returns ordered by departure_time 'asc'. 
          // Let's use that to show "Upcoming" or "Live" opportunities.
          setRecentRides(data.slice(0, 4));
        } else if (data && (data as any).data) { // Handle { data: [...] } case if supabaseApiClient wraps it variously
          setRecentRides(((data as any).data as RideItem[]).slice(0, 4));
        }
      } catch (error) {
        console.error("Failed to fetch rides for live activity", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRides();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-50 to-slate-200">

      {/* Hero Section */}
      <motion.section
        className="relative py-20 lg:py-32 overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
      >
        <motion.div
          className="absolute inset-0 bg-white/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left Content */}
            <motion.div className="space-y-8" variants={itemVariants}>
              <motion.div className="space-y-6" variants={itemVariants}>
                <motion.h1
                  className="text-5xl lg:text-7xl font-bold text-slate-900 leading-tight"
                  variants={itemVariants}
                >
                  Make Every{' '}
                  <span className="bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">
                    Commute
                  </span>
                  <br />
                  <span className="text-slate-700">Count</span>
                </motion.h1>
                <motion.p
                  className="text-xl text-slate-600 font-light leading-relaxed max-w-lg"
                  variants={itemVariants}
                >
                  Transform your daily travel into meaningful connections while saving money and helping the environment.
                </motion.p>
              </motion.div>

              <motion.div
                className="flex gap-4"
                variants={itemVariants}
              >
                <motion.button
                  className="group bg-slate-900 text-white px-8 py-4 rounded-full font-semibold flex items-center gap-3 shadow-xl"
                  whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                >
                  <MapPin className="w-5 h-5" />
                  Find a ride
                </motion.button>
                <motion.button
                  className="group bg-white text-slate-900 border border-slate-300 px-8 py-4 rounded-full font-semibold flex items-center gap-3 shadow-lg"
                  whileHover={{ scale: 1.05, backgroundColor: "#f8fafc" }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                >
                  <Plus className="w-5 h-5" />
                  Offer a ride
                </motion.button>
              </motion.div>
            </motion.div>

            {/* Right Content - Network Visualization */}
            <motion.div
              className="flex justify-center lg:justify-end"
              variants={itemVariants}
            >
              <div className="relative">
                <div className="relative w-80 h-80">
                  <motion.div
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-gradient-to-br from-slate-700 to-slate-900 rounded-full shadow-2xl flex items-center justify-center"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                  >
                    <Users className="w-10 h-10 text-white" />
                  </motion.div>

                  {/* Connecting nodes with staggered animations */}
                  {[
                    { pos: "top-8 left-16", size: "w-16 h-16", color: "from-emerald-500 to-green-600", letter: "A", delay: 0.8 },
                    { pos: "top-16 right-8", size: "w-14 h-14", color: "from-slate-500 to-slate-700", letter: "B", delay: 1.0 },
                    { pos: "bottom-12 left-8", size: "w-12 h-12", color: "from-slate-600 to-slate-800", letter: "C", delay: 1.2 },
                    { pos: "bottom-8 right-16", size: "w-18 h-18", color: "from-slate-500 to-slate-700", letter: "D", delay: 1.4 }
                  ].map((node, index) => (
                    <motion.div
                      key={index}
                      className={`absolute ${node.pos} ${node.size} bg-gradient-to-br ${node.color} rounded-full shadow-xl flex items-center justify-center`}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5, delay: node.delay }}
                      whileHover={{ scale: 1.1 }}
                    >
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-slate-600">{node.letter}</span>
                      </div>
                    </motion.div>
                  ))}

                  {/* Animated connections */}
                  <svg className="absolute inset-0 w-full h-full" style={{ zIndex: -1 }}>
                    <defs>
                      <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#64748b" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#94a3b8" stopOpacity="0.4" />
                      </linearGradient>
                    </defs>
                    {[
                      { x1: 160, y1: 200, x2: 80, y2: 80 },
                      { x1: 160, y1: 200, x2: 280, y2: 88 },
                      { x1: 160, y1: 200, x2: 72, y2: 280 },
                      { x1: 160, y1: 200, x2: 288, y2: 288 }
                    ].map((line, index) => (
                      <motion.line
                        key={index}
                        x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2}
                        stroke="url(#lineGradient)"
                        strokeWidth="2"
                        strokeDasharray="8,4"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 2, delay: 1.5 + index * 0.2, repeat: Infinity, repeatType: "loop" }}
                      />
                    ))}
                  </svg>
                </div>

                {/* Floating labels with staggered animations */}
                {[
                  { pos: "-top-6 left-1/4", text: "Connect", delay: 1.8 },
                  { pos: "top-1/3 -right-12", text: "Share", delay: 2.0 },
                  { pos: "bottom-8 left-4", text: "Save", delay: 2.2 }
                ].map((label, index) => (
                  <motion.div
                    key={index}
                    className={`absolute ${label.pos} bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-slate-200`}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: label.delay }}
                  >
                    <span className="text-sm font-semibold text-slate-700">{label.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Cost Calculator Section */}
      <motion.section
        className="py-20 bg-white relative"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-start">

            <motion.div className="space-y-8" variants={itemVariants}>
              <motion.div className="space-y-6" variants={itemVariants}>
                <motion.h2
                  className="text-4xl lg:text-5xl font-bold text-slate-900"
                  variants={itemVariants}
                >
                  See your <span className="bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">potential savings</span>
                </motion.h2>
                <motion.p
                  className="text-xl text-slate-600 font-light leading-relaxed"
                  variants={itemVariants}
                >
                  Our transparent pricing at just <strong>₹20 per kilometer</strong> helps you save significantly compared to traditional ride services.
                </motion.p>
              </motion.div>

              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                variants={sectionVariants}
              >
                {[
                  { icon: CheckCircle, text: "No surge pricing", color: "text-emerald-600" },
                  { icon: IndianRupee, text: "Transparent ₹20/km rate", color: "text-slate-600" },
                  { icon: Users, text: "Share costs with riders", color: "text-slate-600" },
                  { icon: ArrowRight, text: "60% cheaper than competitors", color: "text-slate-600" }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl"
                    variants={cardVariants}
                    whileHover="hover"
                  >
                    <item.icon className={`w-6 h-6 ${item.color}`} />
                    <span className="text-slate-700 font-medium">{item.text}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            <CostCalculator />
          </div>
        </div>
      </motion.section>

      {/* Activity Feed */}
      <motion.section
        className="py-20 bg-gradient-to-b from-slate-50 to-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <motion.h2
              className="text-4xl font-bold text-slate-900 mb-4"
              variants={itemVariants}
            >
              Live activity <span className="bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">in your area</span>
            </motion.h2>
            <motion.p
              className="text-xl text-slate-600 font-light"
              variants={itemVariants}
            >
              See what&apos;s happening right now in your community
            </motion.p>
          </motion.div>

          <motion.div
            className="space-y-6"
            variants={sectionVariants}
          >
            {loading ? (
              <div className="text-center text-slate-500">Loading live activity...</div>
            ) : recentRides.length > 0 ? (
              recentRides.map((ride, index) => {
                const timeAgo = (dateString: string) => {
                  const date = new Date(dateString);
                  const now = new Date();
                  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

                  if (diffInSeconds < 60) return 'Just now';
                  const diffInMinutes = Math.floor(diffInSeconds / 60);
                  if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
                  const diffInHours = Math.floor(diffInMinutes / 60);
                  if (diffInHours < 24) return `${diffInHours} hours ago`;
                  return `${Math.floor(diffInHours / 24)} days ago`;
                };

                // Since we don't have 'created_at' in the fetched interface strictly (it might be there but let's assume departure for "upcoming"),
                // Making it look like "Offered a ride..." implies creation. 
                // If we use departure time, we should say "Leaving in..."
                // The user wants "Live activity" -> "offered a ride".
                // Use created_at if available, else random "X min ago" or calculated from id? 
                // Actually, let's use a placeholder "Recently" if created_at is missing, or try to access it.
                // Ideally we filter for created_at, but let's use a nice display based on available seats.

                return (
                  <motion.div
                    key={ride.id}
                    className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200"
                    variants={cardVariants}
                    whileHover="hover"
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center gap-6">
                      <motion.div
                        className={`w-3 h-3 bg-emerald-500 rounded-full`}
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      <motion.div
                        className={`w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg overflow-hidden`}
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        {ride.driver?.avatar_url ? (
                          <img src={ride.driver.avatar_url} alt={ride.driver.username} className="w-full h-full object-cover" />
                        ) : (
                          <span>{ride.driver?.full_name?.charAt(0) || ride.driver?.username?.charAt(0) || 'U'}</span>
                        )}
                      </motion.div>
                      <div className="flex-1">
                        <div className="mb-2">
                          <span className="font-semibold text-slate-900">{ride.driver?.full_name || ride.driver?.username || 'Driver'}</span>
                          <span className="text-slate-700 ml-2">offered a ride from {ride.origin} to {ride.destination}</span>
                        </div>
                        <motion.div
                          className="flex items-center gap-1 mb-2"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                        >
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-4 h-4 ${i < (ride.driver?.rating || 5) ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
                          ))}
                          <span className="text-sm text-slate-500 ml-1">{ride.driver?.rating || 'New'}</span>
                        </motion.div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-slate-500 mb-1">
                          {/* Use a generic 'Recently' or calculate if created_at existed. For now: */}
                          Active
                        </div>
                        <motion.div
                          className={`text-sm font-semibold px-3 py-1 rounded-full bg-slate-100 text-emerald-600`}
                          whileHover={{ scale: 1.05 }}
                        >
                          {ride.available_seats} seats left
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="text-center text-slate-500 py-10">
                <p>No active rides at the moment. Be the first to offer one!</p>
              </div>
            )
            }

            {/* 2. WRAP THE BUTTON WITH THE LINK COMPONENT */}
            <motion.div
              className="text-center mt-10"
              variants={itemVariants}
            >
              <Link href="/rides" passHref>
                <motion.button
                  className="bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black text-white px-8 py-3 rounded-full font-semibold shadow-lg"
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(0,0,0,0.2)" }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                >
                  View all activity →
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Safety Section */}
      <motion.section
        className="py-20 bg-gradient-to-br from-slate-50 to-slate-100"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            <motion.div className="space-y-10" variants={itemVariants}>
              <motion.div className="space-y-6" variants={itemVariants}>
                <motion.h2
                  className="text-4xl lg:text-5xl font-bold text-slate-900"
                  variants={itemVariants}
                >
                  Your safety is our <span className="bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">top priority</span>
                </motion.h2>
                <motion.p
                  className="text-xl text-slate-600 font-light leading-relaxed"
                  variants={itemVariants}
                >
                  We&apos;ve built comprehensive safety measures to ensure every ride is secure, reliable, and worry-free.
                </motion.p>
              </motion.div>

              <motion.div
                className="space-y-8"
                variants={sectionVariants}
              >
                {[
                  { icon: Shield, title: "ID Verification Required", desc: "All users complete identity verification with government-issued ID", color: "bg-slate-100 text-slate-600" },
                  { icon: Phone, title: "24/7 Emergency Support", desc: "Dedicated safety team available around the clock for assistance", color: "bg-emerald-100 text-emerald-600" },
                  { icon: MapPin, title: "Real-time Ride Tracking", desc: "Share live location and track every ride from start to finish", color: "bg-slate-100 text-slate-600" },
                  { icon: Star, title: "Community Ratings", desc: "Transparent rating system for choosing the best ride partners", color: "bg-slate-100 text-slate-600" }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start gap-6 p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200"
                    variants={cardVariants}
                    whileHover="hover"
                  >
                    <motion.div
                      className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center flex-shrink-0`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <feature.icon className="w-7 h-7" />
                    </motion.div>
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900 mb-3">{feature.title}</h3>
                      <p className="text-slate-600 font-light leading-relaxed">{feature.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              className="flex justify-center lg:justify-end"
              variants={itemVariants}
            >
              <div className="relative">
                <div className="relative w-80 h-80">
                  <motion.div
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-br from-slate-700 to-slate-900 rounded-3xl shadow-2xl flex items-center justify-center"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.8 }}
                    whileHover={{ rotate: 360 }}
                  >
                    <Shield className="w-16 h-16 text-white" />
                  </motion.div>

                  {/* Safety elements with staggered animations */}
                  {[
                    { icon: CheckCircle, position: "top-8 left-16", color: "bg-emerald-100 text-emerald-600", size: "w-16 h-16", delay: 0.2 },
                    { icon: Phone, position: "top-16 right-12", color: "bg-slate-100 text-slate-600", size: "w-14 h-14", delay: 0.4 },
                    { icon: Star, position: "bottom-12 left-12", color: "bg-slate-100 text-slate-600", size: "w-12 h-12", delay: 0.6 },
                    { icon: MapPin, position: "bottom-16 right-16", color: "bg-slate-100 text-slate-600", size: "w-18 h-18", delay: 0.8 }
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      className={`absolute ${item.position} ${item.size} ${item.color} rounded-2xl shadow-xl flex items-center justify-center`}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5, delay: item.delay }}
                      whileHover={{ scale: 1.1, rotate: 360 }}
                    >
                      <item.icon className="w-6 h-6" />
                    </motion.div>
                  ))}
                </div>

                {/* Floating badges with staggered animations */}
                {[
                  { pos: "-top-8 left-1/4", text: "Verified Safe", color: "border-slate-200", delay: 1.0 },
                  { pos: "top-1/3 -right-16", text: "24/7 Support", color: "border-emerald-200", delay: 1.2 },
                  { pos: "bottom-8 left-2", text: "Tracked", color: "border-slate-200", delay: 1.4 }
                ].map((badge, index) => (
                  <motion.div
                    key={index}
                    className={`absolute ${badge.pos} bg-white/95 backdrop-blur-sm px-6 py-3 rounded-full shadow-xl border ${badge.color}`}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: badge.delay }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <span className="text-sm font-semibold text-slate-700">{badge.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Comparison Section */}
      <motion.section
        className="py-20 bg-white border-t border-slate-200"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <motion.div className="text-center mb-16" variants={itemVariants}>
            <motion.h2
              className="text-4xl font-bold text-slate-900 mb-4"
              variants={itemVariants}
            >
              Why choose us over{' '}
              <span className="bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">the competition?</span>
            </motion.h2>
            <motion.p
              className="text-xl text-slate-600 font-light max-w-3xl mx-auto"
              variants={itemVariants}
            >
              Don&apos;t settle for expensive rides or unreliable service. See how we compare to other platforms.
            </motion.p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-8"
            variants={sectionVariants}
          >
            {/* Comparison cards with staggered animations */}
            <motion.div variants={cardVariants} whileHover="hover">
              <div className="bg-red-50 border border-red-200 rounded-2xl p-6 h-full">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-medium text-slate-900">Goober</h3>
                  <motion.div
                    className="bg-red-100 p-2 rounded-full"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <IndianRupee className="w-6 h-6 text-red-600" />
                  </motion.div>
                </div>

                <div className="space-y-3 mb-6">
                  {[
                    "Higher fares compared to RideShare",
                    "Surge pricing can increase costs unexpectedly",
                    "Limited discounts and promotions",
                    "No ride-sharing cost benefits"
                  ].map((text, index) => (
                    <motion.div
                      key={index}
                      className="flex items-start gap-3"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <X className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700">{text}</span>
                    </motion.div>
                  ))}
                </div>

                <div className="bg-red-100 px-4 py-2 rounded-lg">
                  <span className="text-sm font-medium text-red-800">Pay up to 70% more</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={cardVariants}
              whileHover="hover"
              className="relative transform scale-105"
            >
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-slate-300 rounded-2xl p-6 h-full relative">
                <motion.div
                  className="absolute -top-3 left-1/2 transform -translate-x-1/2"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="bg-gradient-to-r from-slate-700 to-slate-900 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Best Choice
                  </div>
                </motion.div>

                <div className="flex items-center justify-between mb-4 mt-2">
                  <h3 className="text-2xl font-medium text-slate-900">RideShare</h3>
                  <motion.div
                    className="bg-emerald-100 p-2 rounded-full"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <CheckCircle className="w-6 h-6 text-emerald-600" />
                  </motion.div>
                </div>

                <div className="space-y-3 mb-6">
                  {[
                    "Affordable ₹20/km transparent pricing",
                    "Cost savings up to 60%",
                    "Eco-friendly ride sharing",
                    "Verified and trusted community",
                    "Reliable and timely rides",
                    "Active customer support"
                  ].map((text, index) => (
                    <motion.div
                      key={index}
                      className="flex items-start gap-3"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700">{text}</span>
                    </motion.div>
                  ))}
                </div>

                <div className="bg-gradient-to-r from-emerald-100 to-slate-100 px-4 py-2 rounded-lg">
                  <span className="text-sm font-medium text-emerald-800">Save money & help environment</span>
                </div>
              </div>
            </motion.div>

            <motion.div variants={cardVariants} whileHover="hover">
              <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6 h-full">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-medium text-slate-900">Lola</h3>
                  <motion.div
                    className="bg-orange-100 p-2 rounded-full"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <AlertTriangle className="w-6 h-6 text-orange-600" />
                  </motion.div>
                </div>

                <div className="space-y-3 mb-6">
                  {[
                    "High risk of ride cancellations",
                    "Limited customer support availability",
                    "Inconsistent driver availability",
                    "Poor user experience and app issues"
                  ].map((text, index) => (
                    <motion.div
                      key={index}
                      className="flex items-start gap-3"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <X className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700">{text}</span>
                    </motion.div>
                  ))}
                </div>

                <div className="bg-orange-100 px-4 py-2 rounded-lg">
                  <span className="text-sm font-medium text-orange-800">Unreliable service</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        className="py-20 bg-slate-50"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          <motion.div className="text-center mb-16" variants={itemVariants}>
            <motion.h2
              className="text-4xl font-bold text-slate-900 mb-4"
              variants={itemVariants}
            >
              Why choose <span className="bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">shared rides?</span>
            </motion.h2>
            <motion.p
              className="text-xl text-slate-600 font-light max-w-2xl mx-auto"
              variants={itemVariants}
            >
              Smart commuting that benefits you, your wallet, and the environment.
            </motion.p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-12"
            variants={sectionVariants}
          >
            {[
              { icon: "60%", title: "Cost savings", desc: "Reduce your commute costs by sharing rides with verified travelers.", color: "bg-slate-100" },
              { icon: CheckCircle, title: "Verified users", desc: "All riders and drivers are verified for your safety and peace of mind.", color: "bg-emerald-100" },
              { icon: Users, title: "Community", desc: "Join a growing community of eco-conscious commuters.", color: "bg-slate-100" }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="text-center space-y-4"
                variants={cardVariants}
                whileHover="hover"
              >
                <motion.div
                  className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mx-auto`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  {typeof feature.icon === 'string' ? (
                    <span className="text-2xl font-bold text-slate-600">{feature.icon}</span>
                  ) : (
                    <feature.icon className="w-8 h-8 text-emerald-600" />
                  )}
                </motion.div>
                <h3 className="text-xl font-medium text-slate-900">{feature.title}</h3>
                <p className="text-slate-600 font-light">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section
        className="py-16 bg-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
            variants={sectionVariants}
          >
            {[
              { number: "50K+", label: "Active users" },
              { number: "25+", label: "Cities" },
              { number: "4.8★", label: "User rating" },
              { number: "1M+", label: "Rides shared" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
              >
                <motion.div
                  className="text-3xl font-light text-slate-900 mb-2"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 * index, type: "spring" }}
                >
                  {stat.number}
                </motion.div>
                <div className="text-slate-600 font-light">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="py-20 bg-gradient-to-br from-slate-800 via-slate-900 to-gray-900 relative overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
      >
        <motion.div
          className="absolute inset-0 bg-black/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div className="space-y-10" variants={itemVariants}>
            <motion.h2
              className="text-4xl lg:text-5xl font-bold text-white leading-tight"
              variants={itemVariants}
            >
              Ready to start your{' '}
              <span className="bg-gradient-to-r from-slate-300 to-white bg-clip-text text-transparent">
                smarter commute?
              </span>
            </motion.h2>
            <motion.p
              className="text-xl text-slate-300 font-light max-w-2xl mx-auto"
              variants={itemVariants}
            >
              Download our app and join thousands who&apos;ve already transformed their daily journey.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-6 justify-center"
              variants={sectionVariants}
            >
              <motion.button
                className="bg-white text-slate-900 px-10 py-5 rounded-full font-semibold text-lg flex items-center justify-center gap-3 shadow-2xl"
                variants={cardVariants}
                whileHover={{ scale: 1.05, boxShadow: "0 25px 50px rgba(255,255,255,0.2)" }}
                whileTap={{ scale: 0.98 }}
              >
                <Download className="w-6 h-6" />
                Download app
              </motion.button>
              <motion.button
                className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-10 py-5 rounded-full font-semibold text-lg flex items-center justify-center gap-3"
                variants={cardVariants}
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.2)" }}
                whileTap={{ scale: 0.98 }}
              >
                <Users className="w-6 h-6" />
                Learn more
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default ElegantRideshareLanding;