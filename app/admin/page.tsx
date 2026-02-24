'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import {
  ShieldCheck,
  Users,
  Car,
  Search,
  User as UserIcon,
  MapPin,
  Calendar,
} from 'lucide-react';

interface AdminUser {
  id: string;
  email: string;
  username: string | null;
  full_name: string | null;
  role: string;
  rating: number;
  total_rides: number;
  created_at: string;
}

interface AdminRide {
  id: string;
  origin: string;
  destination: string;
  departure_time: string;
  available_seats: number;
  price_per_seat: number;
  status: string;
  created_at: string;
  driver: {
    id: string;
    full_name: string | null;
    username: string | null;
    email: string;
  } | null;
  _count: {
    bookings: number;
  };
}

interface AdminBooking {
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
      full_name: string | null;
      username: string | null;
      email: string;
    } | null;
  } | null;
  passenger: {
    id: string;
    full_name: string | null;
    username: string | null;
    email: string;
  } | null;
}

interface AdminOverviewResponse {
  users: AdminUser[];
  rides: AdminRide[];
  bookings: AdminBooking[];
  error?: string;
}

const AdminPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AdminOverviewResponse | null>(null);
  const [search, setSearch] = useState('');
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        router.push('/login');
        return;
      }

      try {
        const res = await fetch('/api/admin/overview', {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });
        const json = (await res.json()) as AdminOverviewResponse;

        if (!res.ok || json.error) {
          setError(json.error || 'Not authorized to view admin panel');
          setData(null);
        } else {
          setData(json);
        }
      } catch (err) {
        console.error('Failed to load admin overview:', err);
        setError('Failed to load admin data');
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [router]);

  const searchLower = search.toLowerCase();

  const filteredUsers = useMemo(() => {
    if (!data?.users || !searchLower) return data?.users ?? [];
    return data.users.filter((u) => {
      const name = (u.full_name || u.username || u.email || '').toLowerCase();
      return name.includes(searchLower);
    });
  }, [data?.users, searchLower]);

  const filteredPeopleFromBookings = useMemo(() => {
    if (!data?.bookings || !searchLower) return [];
    const seen = new Set<string>();
    const people: { id: string; name: string; email: string; role: 'driver' | 'passenger' }[] = [];

    for (const b of data.bookings) {
      const driver = b.ride?.driver;
      const passenger = b.passenger;

      if (driver) {
        const key = `driver-${driver.id}`;
        if (!seen.has(key)) {
          const name = driver.full_name || driver.username || driver.email;
          if (name.toLowerCase().includes(searchLower)) {
            seen.add(key);
            people.push({ id: driver.id, name, email: driver.email, role: 'driver' });
          }
        }
      }

      if (passenger) {
        const key = `passenger-${passenger.id}`;
        if (!seen.has(key)) {
          const name = passenger.full_name || passenger.username || passenger.email;
          if (name.toLowerCase().includes(searchLower)) {
            seen.add(key);
            people.push({ id: passenger.id, name, email: passenger.email, role: 'passenger' });
          }
        }
      }
    }

    return people;
  }, [data?.bookings, searchLower]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="h-10 w-10 rounded-full border-2 border-slate-300 border-t-slate-800 animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="max-w-md w-full bg-white shadow-lg rounded-2xl p-8 border border-slate-100 text-center">
          <ShieldCheck className="w-10 h-10 text-red-500 mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-slate-900 mb-2">Admin access required</h1>
          <p className="text-sm text-slate-600 mb-6">{error}</p>
          <button
            type="button"
            onClick={() => router.push('/')}
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-medium hover:bg-black transition-colors"
          >
            Back to home
          </button>
        </div>
      </div>
    );
  }

  const totalUsers = data.users.length;
  const totalRides = data.rides.length;
  const totalBookings = data.bookings.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-50 to-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-7 h-7 text-slate-800" />
              Admin Panel
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Overview of all users, rides, and bookings.
            </p>
          </div>
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search people by name or email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-400"
            />
          </div>
        </header>

        {/* Summary cards */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">Users</p>
              <p className="text-xl font-semibold text-slate-900">{totalUsers}</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">Rides</p>
              <p className="text-xl font-semibold text-slate-900">{totalRides}</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">Bookings</p>
              <p className="text-xl font-semibold text-slate-900">{totalBookings}</p>
            </div>
          </div>
        </section>

        {/* Search results */}
        {search && (
          <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 space-y-3">
            <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <Search className="w-4 h-4 text-slate-500" />
              People matching “{search}”
            </h2>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {filteredUsers.map((u) => (
                <div
                  key={u.id}
                  className="flex items-center justify-between gap-3 py-2 px-2 rounded-lg hover:bg-slate-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                      <UserIcon className="w-4 h-4 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {u.full_name || u.username || 'User'}
                      </p>
                      <p className="text-xs text-slate-500">{u.email}</p>
                    </div>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-700">
                    {u.role}
                  </span>
                </div>
              ))}

              {filteredPeopleFromBookings.map((p) => (
                <div
                  key={`${p.role}-${p.id}`}
                  className="flex items-center justify-between gap-3 py-2 px-2 rounded-lg hover:bg-slate-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                      <UserIcon className="w-4 h-4 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{p.name}</p>
                      <p className="text-xs text-slate-500">{p.email}</p>
                    </div>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-700">
                    {p.role === 'driver' ? 'Driver' : 'Passenger'}
                  </span>
                </div>
              ))}

              {filteredUsers.length === 0 && filteredPeopleFromBookings.length === 0 && (
                <p className="text-xs text-slate-500">No people found for this search.</p>
              )}
            </div>
          </section>
        )}

        {/* Rides table */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 space-y-3">
          <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <Car className="w-4 h-4 text-slate-500" />
            Recent rides
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-xs text-slate-700">
              <thead>
                <tr className="border-b border-slate-100 text-slate-500">
                  <th className="py-2 pr-4 font-medium">Route</th>
                  <th className="py-2 pr-4 font-medium">Departure</th>
                  <th className="py-2 pr-4 font-medium">Driver</th>
                  <th className="py-2 pr-4 font-medium">Seats</th>
                  <th className="py-2 pr-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.rides.slice(0, 20).map((ride) => (
                  <tr key={ride.id} className="border-b border-slate-50 last:border-0">
                    <td className="py-2 pr-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        <span>
                          {ride.origin} → {ride.destination}
                        </span>
                      </div>
                    </td>
                    <td className="py-2 pr-4">
                      <div className="flex items-center gap-1 text-xs">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        <span>
                          {new Date(ride.departure_time).toLocaleString(undefined, {
                            dateStyle: 'short',
                            timeStyle: 'short',
                          })}
                        </span>
                      </div>
                    </td>
                    <td className="py-2 pr-4">
                      <span className="text-xs">
                        {ride.driver?.full_name || ride.driver?.username || ride.driver?.email || '—'}
                      </span>
                    </td>
                    <td className="py-2 pr-4 text-xs">
                      {ride.available_seats} seats · {ride._count.bookings} bookings
                    </td>
                    <td className="py-2 pr-4 text-xs">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full ${
                          ride.status === 'ACTIVE'
                            ? 'bg-emerald-50 text-emerald-700'
                            : ride.status === 'COMPLETED'
                            ? 'bg-slate-50 text-slate-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {ride.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Users table */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 space-y-3">
          <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <Users className="w-4 h-4 text-slate-500" />
            Users
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-xs text-slate-700">
              <thead>
                <tr className="border-b border-slate-100 text-slate-500">
                  <th className="py-2 pr-4 font-medium">Name</th>
                  <th className="py-2 pr-4 font-medium">Email</th>
                  <th className="py-2 pr-4 font-medium">Role</th>
                  <th className="py-2 pr-4 font-medium">Rides</th>
                  <th className="py-2 pr-4 font-medium">Rating</th>
                </tr>
              </thead>
              <tbody>
                {data.users.slice(0, 50).map((u) => (
                  <tr key={u.id} className="border-b border-slate-50 last:border-0">
                    <td className="py-2 pr-4">
                      <span className="text-xs font-medium">
                        {u.full_name || u.username || 'User'}
                      </span>
                    </td>
                    <td className="py-2 pr-4 text-xs text-slate-500">{u.email}</td>
                    <td className="py-2 pr-4 text-xs">
                      <span className="inline-flex px-2 py-0.5 rounded-full bg-slate-50 text-slate-700 uppercase tracking-wide">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-2 pr-4 text-xs">{u.total_rides}</td>
                    <td className="py-2 pr-4 text-xs">{u.rating.toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminPage;

