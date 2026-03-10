'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Users,
  Car,
  Search,
  User as UserIcon,
  MapPin,
  Calendar,
  Ticket,
  Ban,
  XCircle,
  MessageSquare,
  BookOpen,
} from 'lucide-react';

// Ticket type for contact/support list
interface AdminTicket {
  id: string;
  email: string;
  subject: string;
  message: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  createdAt: string;
}

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

// Sample tickets for demo
const MOCK_TICKETS: AdminTicket[] = [
  { id: 't1', email: 'user@example.com', subject: 'Payment issue', message: 'I was charged twice for my last ride.', status: 'Open', createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: 't2', email: 'driver@test.com', subject: 'Account verification', message: 'When will my driver account be verified?', status: 'In Progress', createdAt: new Date(Date.now() - 172800000).toISOString() },
  { id: 't3', email: 'rider@mail.com', subject: 'Cancel booking', message: 'Need to cancel my booking for tomorrow.', status: 'Resolved', createdAt: new Date(Date.now() - 259200000).toISOString() },
];

const AdminPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AdminOverviewResponse | null>(null);
  const [search, setSearch] = useState('');
  const [tickets, setTickets] = useState<AdminTicket[]>(MOCK_TICKETS);
  const [cancelledRideIds, setCancelledRideIds] = useState<Set<string>>(new Set());
  const [blockedRideIds, setBlockedRideIds] = useState<Set<string>>(new Set());
  const [blockedUserIds, setBlockedUserIds] = useState<Set<string>>(new Set());
  const [cancelledBookingIds, setCancelledBookingIds] = useState<Set<string>>(new Set());
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch('/api/admin/overview', { credentials: 'include' });
        const json = (await res.json()) as AdminOverviewResponse;

        if (!res.ok || json.error) {
          setError(json.error || 'Not authorized to view admin panel');
          setData(null);
          if (res.status === 401 || res.status === 403) {
            router.push('/admin/login');
          }
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
  const openTickets = tickets.filter((t) => t.status !== 'Resolved').length;

  const updateTicketStatus = (id: string, status: AdminTicket['status']) => {
    setTickets((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
  };

  const cancelRide = (rideId: string) => {
    setCancelledRideIds((prev) => new Set(prev).add(rideId));
  };
  const blockRide = (rideId: string) => {
    setBlockedRideIds((prev) => new Set(prev).add(rideId));
  };
  const unblockRide = (rideId: string) => {
    setBlockedRideIds((prev) => {
      const next = new Set(prev);
      next.delete(rideId);
      return next;
    });
  };
  const blockUser = (userId: string) => {
    setBlockedUserIds((prev) => new Set(prev).add(userId));
  };
  const unblockUser = (userId: string) => {
    setBlockedUserIds((prev) => {
      const next = new Set(prev);
      next.delete(userId);
      return next;
    });
  };
  const cancelBooking = (bookingId: string) => {
    setCancelledBookingIds((prev) => new Set(prev).add(bookingId));
  };

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
              Overview of users, rides, bookings, and tickets.
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
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">Bookings</p>
              <p className="text-xl font-semibold text-slate-900">{totalBookings}</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Ticket className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">Open tickets</p>
              <p className="text-xl font-semibold text-slate-900">{openTickets}</p>
            </div>
          </div>
        </section>

        {/* Tickets (contact/support) */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 space-y-3">
          <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-slate-500" />
            Tickets (contact & support)
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-xs text-slate-700">
              <thead>
                <tr className="border-b border-slate-100 text-slate-500">
                  <th className="py-2 pr-4 font-medium">Email</th>
                  <th className="py-2 pr-4 font-medium">Subject</th>
                  <th className="py-2 pr-4 font-medium">Message</th>
                  <th className="py-2 pr-4 font-medium">Date</th>
                  <th className="py-2 pr-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((t) => (
                  <tr key={t.id} className="border-b border-slate-50 last:border-0">
                    <td className="py-2 pr-4 text-slate-600">{t.email}</td>
                    <td className="py-2 pr-4 font-medium">{t.subject}</td>
                    <td className="py-2 pr-4 max-w-[200px] truncate">{t.message}</td>
                    <td className="py-2 pr-4 text-slate-500">
                      {new Date(t.createdAt).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}
                    </td>
                    <td className="py-2 pr-4">
                      <select
                        value={t.status}
                        onChange={(e) => updateTicketStatus(t.id, e.target.value as AdminTicket['status'])}
                        className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-300"
                      >
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
            Rides
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
                  <th className="py-2 pr-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.rides.slice(0, 20).map((ride) => {
                  const isCancelled = cancelledRideIds.has(ride.id);
                  const isBlocked = blockedRideIds.has(ride.id);
                  const displayStatus = isBlocked ? 'Blocked' : isCancelled ? 'Cancelled' : ride.status;
                  return (
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
                            displayStatus === 'Blocked'
                              ? 'bg-red-50 text-red-700'
                              : displayStatus === 'Cancelled'
                              ? 'bg-slate-100 text-slate-600'
                              : displayStatus === 'ACTIVE'
                              ? 'bg-emerald-50 text-emerald-700'
                              : displayStatus === 'COMPLETED'
                              ? 'bg-slate-50 text-slate-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          {displayStatus}
                        </span>
                      </td>
                      <td className="py-2 pr-4">
                        <div className="flex items-center gap-1 flex-wrap">
                          {!isCancelled && (
                            <button
                              type="button"
                              onClick={() => cancelRide(ride.id)}
                              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs"
                            >
                              <XCircle className="w-3 h-3" />
                              Cancel
                            </button>
                          )}
                          {isBlocked ? (
                            <button
                              type="button"
                              onClick={() => unblockRide(ride.id)}
                              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-100 text-emerald-700 hover:bg-emerald-200 text-xs"
                            >
                              Unblock
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => blockRide(ride.id)}
                              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 text-xs"
                            >
                              <Ban className="w-3 h-3" />
                              Block
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Bookings */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 space-y-3">
          <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-slate-500" />
            Bookings
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-xs text-slate-700">
              <thead>
                <tr className="border-b border-slate-100 text-slate-500">
                  <th className="py-2 pr-4 font-medium">Ride</th>
                  <th className="py-2 pr-4 font-medium">Passenger</th>
                  <th className="py-2 pr-4 font-medium">Seats · Total</th>
                  <th className="py-2 pr-4 font-medium">Status</th>
                  <th className="py-2 pr-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.bookings.slice(0, 25).map((b) => {
                  const isCancelled = cancelledBookingIds.has(b.id);
                  return (
                    <tr key={b.id} className="border-b border-slate-50 last:border-0">
                      <td className="py-2 pr-4">
                        <span className="text-xs">
                          {b.ride?.origin} → {b.ride?.destination}
                        </span>
                      </td>
                      <td className="py-2 pr-4 text-xs">
                        {b.passenger?.full_name || b.passenger?.username || b.passenger?.email || '—'}
                      </td>
                      <td className="py-2 pr-4 text-xs">
                        {b.seats_booked} · ₹{b.total_price}
                      </td>
                      <td className="py-2 pr-4 text-xs">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-full ${
                            isCancelled ? 'bg-slate-100 text-slate-600' : 'bg-slate-50 text-slate-700'
                          }`}
                        >
                          {isCancelled ? 'Cancelled' : b.status}
                        </span>
                      </td>
                      <td className="py-2 pr-4">
                        {!isCancelled && (
                          <button
                            type="button"
                            onClick={() => cancelBooking(b.id)}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs"
                          >
                            <XCircle className="w-3 h-3" />
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
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
                  <th className="py-2 pr-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.users.slice(0, 50).map((u) => {
                  const isBlocked = blockedUserIds.has(u.id);
                  return (
                    <tr key={u.id} className={`border-b border-slate-50 last:border-0 ${isBlocked ? 'bg-red-50/50' : ''}`}>
                      <td className="py-2 pr-4">
                        <span className="text-xs font-medium">
                          {u.full_name || u.username || 'User'}
                        </span>
                        {isBlocked && (
                          <span className="ml-1 inline-flex px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs">
                            Blocked
                          </span>
                        )}
                      </td>
                      <td className="py-2 pr-4 text-xs text-slate-500">{u.email}</td>
                      <td className="py-2 pr-4 text-xs">
                        <span className="inline-flex px-2 py-0.5 rounded-full bg-slate-50 text-slate-700 uppercase tracking-wide">
                          {u.role}
                        </span>
                      </td>
                      <td className="py-2 pr-4 text-xs">{u.total_rides}</td>
                      <td className="py-2 pr-4 text-xs">{u.rating.toFixed(1)}</td>
                      <td className="py-2 pr-4">
                        {isBlocked ? (
                          <button
                            type="button"
                            onClick={() => unblockUser(u.id)}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-100 text-emerald-700 hover:bg-emerald-200 text-xs"
                          >
                            Unblock
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => blockUser(u.id)}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 text-xs"
                          >
                            <Ban className="w-3 h-3" />
                            Block
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminPage;

