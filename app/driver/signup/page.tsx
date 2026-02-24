"use client";

import React, { useState } from "react";
import { Car, User, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { supabase } from '@/lib/supabase';
import { apiClient } from '@/app/lib/api';
import { useRouter } from 'next/navigation';

const DriverSignUpPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    carMake: "",
    carModel: "",
    carYear: "",
    carColor: "",
    carPlate: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name as keyof typeof formData]: value,
    });
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    setApiError(null);

    try {
      const { data, error } = await apiClient.signup(
        formData.email,
        formData.password,
        undefined,
        formData.name
      );

      if (error) {
        setApiError(error);
      } else {
        // If we got a Supabase session back, store it so we can immediately
        // save the driver's car details and redirect into the portal.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (data && typeof data === 'object' && 'session' in data && (data as any).session) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await supabase.auth.setSession((data as any).session);
        }

        // Try to persist initial car details into the driver profile
        try {
          const {
            data: { session },
          } = await supabase.auth.getSession();

          if (session?.access_token) {
            await fetch('/api/driver/profile', {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${session.access_token}`,
              },
              body: JSON.stringify({
                full_name: formData.name,
                car_make: formData.carMake || undefined,
                car_model: formData.carModel || undefined,
                car_year: formData.carYear ? Number(formData.carYear) : undefined,
                car_color: formData.carColor || undefined,
                car_plate: formData.carPlate || undefined,
                accept_terms: true,
              }),
            });
          }
        } catch {
          // If this fails we still continue to the driver portal; the user
          // can complete their profile there.
        }

        router.push('/driver');
      }
    } catch {
      setApiError('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="w-14 h-14 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <Car className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-semibold text-slate-900 mb-1">
            Become a Driver
          </h1>
          <p className="text-slate-600 text-sm">
            Create a driver account to offer rides and manage your trips.
          </p>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {apiError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {apiError}
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                Full name
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl text-slate-900 placeholder-slate-400 transition-all duration-300 ${
                    errors.name
                      ? "border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                      : "border-slate-200 focus:border-slate-500 focus:ring-1 focus:ring-slate-300"
                  }`}
                  placeholder="Your legal name"
                />
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              </div>
              {errors.name && (
                <p className="mt-2 text-xs text-red-600">{errors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                Email address
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl text-slate-900 placeholder-slate-400 transition-all duration-300 ${
                    errors.email
                      ? "border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                      : "border-slate-200 focus:border-slate-500 focus:ring-1 focus:ring-slate-300"
                  }`}
                  placeholder="you@example.com"
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              </div>
              {errors.email && (
                <p className="mt-2 text-xs text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-11 py-3 border rounded-xl text-slate-900 placeholder-slate-400 transition-all duration-300 ${
                    errors.password
                      ? "border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                      : "border-slate-200 focus:border-slate-500 focus:ring-1 focus:ring-slate-300"
                  }`}
                  placeholder="Create a strong password"
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-xs text-red-600">{errors.password}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-2">
                Confirm password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-11 py-3 border rounded-xl text-slate-900 placeholder-slate-400 transition-all duration-300 ${
                    errors.confirmPassword
                      ? "border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                      : "border-slate-200 focus:border-slate-500 focus:ring-1 focus:ring-slate-300"
                  }`}
                  placeholder="Re-enter your password"
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-2 text-xs text-red-600">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Car details (optional) */}
            <div className="grid grid-cols-1 gap-4 border-t border-slate-100 pt-4 mt-2">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Car details <span className="normal-case font-normal text-slate-400">(optional)</span>
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="carMake" className="block text-xs font-medium text-slate-700 mb-1">
                    Make
                  </label>
                  <input
                    type="text"
                    id="carMake"
                    name="carMake"
                    value={formData.carMake}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-300 focus:border-slate-400"
                    placeholder="Toyota"
                  />
                </div>
                <div>
                  <label htmlFor="carModel" className="block text-xs font-medium text-slate-700 mb-1">
                    Model
                  </label>
                  <input
                    type="text"
                    id="carModel"
                    name="carModel"
                    value={formData.carModel}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-300 focus:border-slate-400"
                    placeholder="Etios"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label htmlFor="carYear" className="block text-xs font-medium text-slate-700 mb-1">
                    Year
                  </label>
                  <input
                    type="number"
                    id="carYear"
                    name="carYear"
                    value={formData.carYear}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-300 focus:border-slate-400"
                    placeholder="2020"
                  />
                </div>
                <div>
                  <label htmlFor="carColor" className="block text-xs font-medium text-slate-700 mb-1">
                    Colour
                  </label>
                  <input
                    type="text"
                    id="carColor"
                    name="carColor"
                    value={formData.carColor}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-300 focus:border-slate-400"
                    placeholder="White"
                  />
                </div>
                <div>
                  <label htmlFor="carPlate" className="block text-xs font-medium text-slate-700 mb-1">
                    Plate
                  </label>
                  <input
                    type="text"
                    id="carPlate"
                    name="carPlate"
                    value={formData.carPlate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-300 focus:border-slate-400"
                    placeholder="KA 01 AB 1234"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                isSubmitting
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                  : "bg-slate-900 hover:bg-black text-white"
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-300"></div>
                  Creating driver account…
                </>
              ) : (
                <>
                  Create driver account
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 text-center text-sm">
            <p className="text-slate-600">
              Already a driver?{" "}
              <a
                href="/driver/login"
                className="text-slate-900 font-semibold hover:underline"
              >
                Sign in to Driver Portal
              </a>
            </p>
            <p className="mt-2 text-slate-500">
              Want to ride instead?{" "}
              <a href="/signup" className="text-slate-700 hover:underline">
                Create passenger account
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverSignUpPage;

