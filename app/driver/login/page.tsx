'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Car } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { apiClient } from '@/app/lib/api';
import { useRouter } from 'next/navigation';

const DriverLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const { data, error } = await apiClient.login(email, password);

      if (error) {
        setError(error);
      } else if (data?.session) {
        await supabase.auth.setSession(data.session);
        router.push('/driver');
      } else if (data?.user) {
        router.push('/driver');
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md"
      >
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center">
            <Car className="w-7 h-7 text-white" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-center text-slate-900 mb-1">
          Driver Portal
        </h2>
        <p className="text-center text-slate-600 mb-8 text-sm">
          Sign in to manage your driver profile and trips.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
              Email address
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 pl-10 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-transparent text-slate-900"
                placeholder="you@example.com"
                required
              />
              <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pl-10 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-transparent text-slate-900"
                placeholder="Enter your password"
                required
              />
              <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={submitting}
            className="w-full bg-slate-900 disabled:opacity-60 text-white py-3 px-4 rounded-xl font-semibold hover:bg-black focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 transition-colors"
          >
            {submitting ? 'Signing in…' : 'Sign in as driver'}
          </motion.button>
        </form>

        <div className="mt-6 text-center space-y-2 text-sm">
          <p className="text-slate-600">
            New to RideShare as a driver?{' '}
            <a href="/driver/signup" className="text-slate-900 font-semibold hover:underline">
              Create driver account
            </a>
          </p>
          <p className="text-slate-500">
            Looking for passenger sign in?{' '}
            <a href="/login" className="text-slate-700 hover:underline">
              Go to passenger login
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default DriverLoginPage;

