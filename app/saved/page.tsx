'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  MapPin,
  Calendar,
  Trash2,
  Bookmark,
  Plus,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import {
  getSavedRidesFromStorage,
  saveRidesToStorage,
  type SavedRide,
} from '@/app/lib/savedRides';

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
    scale: 1.02,
    transition: { duration: 0.2 },
  },
};

export default function SavedPage() {
  const [saved, setSaved] = useState<SavedRide[]>([]);
  const [rideIdInput, setRideIdInput] = useState('');
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  useEffect(() => {
    setSaved(getSavedRidesFromStorage());
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = rideIdInput.trim();
    if (!id) return;
    setAdding(true);
    setAddError(null);
    try {
      const res = await fetch(`/api/rides/${id}`);
      const data = await res.json();
      if (!res.ok || data.error) {
        setAddError(data.error || 'Ride not found');
        setAdding(false);
        return;
      }
      const ride = data as {
        id: string;
        origin: string;
        destination: string;
        departure_time: string;
        price_per_seat: number;
      };
      const newSaved: SavedRide = {
        rideId: ride.id,
        origin: ride.origin ?? '',
        destination: ride.destination ?? '',
        departure_time: ride.departure_time ?? new Date().toISOString(),
        price_per_seat: ride.price_per_seat ?? 0,
        savedAt: new Date().toISOString(),
      };
      const exists = saved.some((s) => s.rideId === newSaved.rideId);
      if (exists) {
        setAddError('This ride is already saved');
        setAdding(false);
        return;
      }
      const next = [newSaved, ...saved];
      setSaved(next);
      saveRidesToStorage(next);
      setRideIdInput('');
    } catch (error) {
      console.error('Failed to fetch ride', error);
      setAddError('Failed to fetch ride');
    } finally {
      setAdding(false);
    }
  };

  const handleRemove = (rideId: string) => {
    const next = saved.filter((s) => s.rideId !== rideId);
    setSaved(next);
    saveRidesToStorage(next);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-50 to-slate-200">
      <motion.div
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="mb-8" variants={itemVariants}>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Saved rides
          </h1>
          <p className="text-xl text-slate-600 font-light">
            Rides you saved for later
          </p>
        </motion.div>

        {/* Add by Ride ID */}
        <motion.div
          className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 mb-8"
          variants={itemVariants}
        >
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add by Ride ID
          </h2>
          <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Paste ride ID (e.g. from ride URL)"
              value={rideIdInput}
              onChange={(e) => {
                setRideIdInput(e.target.value);
                setAddError(null);
              }}
              className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-200 focus:border-slate-400 outline-none text-slate-800 placeholder:text-slate-400"
            />
            <button
              type="submit"
              disabled={adding}
              className="inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 disabled:opacity-70 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
            >
              {adding ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Bookmark className="w-5 h-5" />
              )}
              {adding ? 'Adding...' : 'Add'}
            </button>
          </form>
          {addError && (
            <p className="mt-2 text-sm text-red-600">{addError}</p>
          )}
        </motion.div>

        {/* List */}
        {saved.length === 0 ? (
          <motion.div
            className="bg-white rounded-2xl shadow-lg border border-slate-200 p-12 text-center"
            variants={itemVariants}
          >
            <Bookmark className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-slate-900 mb-2">No saved rides</h2>
            <p className="text-slate-600 mb-6">
              Add a ride by ID above, or find rides and save them from the Find Rides page.
            </p>
            <Link
              href="/rides"
              className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
            >
              Find rides
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        ) : (
          <motion.div
            className="space-y-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {saved.map((ride) => (
              <motion.div
                key={ride.rideId}
                variants={cardVariants}
                whileHover="hover"
                className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <Link href={`/booking-detials/${ride.rideId}`} className="flex-1 min-w-0">
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
                    <span>₹{ride.price_per_seat}/seat</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Saved {new Date(ride.savedAt).toLocaleDateString()}
                  </p>
                </Link>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <Link
                    href={`/booking-detials/${ride.rideId}`}
                    className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-xl font-medium transition-colors text-sm"
                  >
                    View
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleRemove(ride.rideId)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                    aria-label="Remove from saved"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
