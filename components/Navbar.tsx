"use client"
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useSupabaseAuth } from '@/app/providers/SupabaseAuthProvider';
import { Car, User, Plus, MapPin, Home, LogIn, LogOut, UserPlus, Users, ShieldCheck, LayoutDashboard, ArrowLeft } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { user, signOut } = useSupabaseAuth();
  const isLoggedIn = !!user;
  const isAdminRoute = pathname?.startsWith('/admin');

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/rides", label: "Find Rides", icon: MapPin },
    { href: "/create-ride", label: "Offer Ride", icon: Plus },
    { href: "/driver", label: "Driver Portal", icon: Car },
    { href: "/profile", label: "Profile", icon: User },
    { href: "/about", label: "About", icon: Users },
  ];

  const desktopNavItems = navItems.filter((item) => item.href !== "/driver");

  const handleAdminLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST', credentials: 'include' });
    window.location.href = '/admin/login';
  };

  if (isAdminRoute) {
    return (
      <nav className="bg-slate-800/95 backdrop-blur-md border-b border-slate-700 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link
              href="/"
              className="flex items-center space-x-3 text-xl font-bold text-white hover:text-slate-200 transition-colors"
            >
              <ShieldCheck className="w-7 h-7 text-amber-400" />
              <span>RideShare Admin</span>
            </Link>
            <div className="flex items-center space-x-3">
              <Link
                href="/admin"
                className="flex items-center space-x-2 px-4 py-2 rounded-xl text-slate-200 hover:text-white hover:bg-slate-700/50 transition-all font-medium"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
              <Link
                href="/"
                className="flex items-center space-x-2 px-4 py-2 rounded-xl border border-slate-600 text-slate-300 hover:bg-slate-700/50 hover:text-white transition-all font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to site</span>
              </Link>
              <button
                onClick={handleAdminLogout}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 border border-amber-500/40 font-medium transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span>Log out</span>
              </button>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <>
      <nav className="bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center space-x-3 text-2xl font-bold text-slate-900 hover:text-slate-700 transition-colors duration-300"
            >
              <div className="relative">
                <Car className="w-8 h-8 text-slate-700" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              </div>
              <span className="bg-gradient-to-r from-slate-600 to-slate-800 bg-clip-text text-transparent">
                RideShare
              </span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-1">
              {desktopNavItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center space-x-2 px-4 py-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-all duration-300 font-medium"
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              {/* Auth Buttons */}
              <div className="ml-6 pl-6 border-l border-gray-200 flex items-center space-x-3">
                {!isLoggedIn ? (
                  <>
                    <Link
                      href="/login"
                      className="flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-xl font-medium transition-all duration-300 shadow-sm hover:shadow-md hover:scale-105"
                    >
                      <LogIn className="w-4 h-4" />
                      <span>Sign In</span>
                    </Link>
                    <Link
                      href="/signup"
                      className="flex items-center space-x-2 bg-white text-slate-900 border border-slate-300 hover:bg-slate-50 px-6 py-2.5 rounded-xl font-medium transition-all duration-300 shadow-sm hover:shadow-md hover:scale-105"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>Sign Up</span>
                    </Link>
                  </>
                ) : (
                  <button onClick={signOut} className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-xl font-medium transition-all duration-300 shadow-sm hover:shadow-md hover:scale-105">
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                )}
              </div>

              {/* Desktop Driver Portal (right-most) */}
              <Link
                href="/driver"
                className="ml-4 flex items-center space-x-2 px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-all duration-300 font-medium"
              >
                <Car className="w-4 h-4" />
                <span>Driver Portal</span>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all duration-300"
                aria-controls="mobile-menu"
                aria-expanded={isOpen}
              >
                <span className="sr-only">Open main menu</span>
                <span className="relative w-6 h-6 flex items-center justify-center">
                  <span
                    className={[
                      "absolute h-0.5 w-6 bg-current rounded-full transition-transform duration-200 ease-out",
                      isOpen ? "translate-y-0 rotate-45" : "-translate-y-2 rotate-0",
                    ].join(" ")}
                  />
                  <span
                    className={[
                      "absolute h-0.5 w-6 bg-current rounded-full transition-all duration-200 ease-out",
                      isOpen ? "opacity-0 scale-x-0" : "opacity-100 scale-x-100",
                    ].join(" ")}
                  />
                  <span
                    className={[
                      "absolute h-0.5 w-6 bg-current rounded-full transition-transform duration-200 ease-out",
                      isOpen ? "translate-y-0 -rotate-45" : "translate-y-2 rotate-0",
                    ].join(" ")}
                  />
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${isOpen
          ? 'max-h-96 opacity-100'
          : 'max-h-0 opacity-0 overflow-hidden'
          }`}>
          <div className="bg-white/95 backdrop-blur-sm border-t border-gray-100 shadow-lg">
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-all duration-300 font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    <IconComponent className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              {/* Mobile Auth Buttons */}
              <div className="pt-4 border-t border-gray-100 space-y-3">
                {!isLoggedIn ? (
                  <>
                    <Link
                      href="/login"
                      className="flex items-center justify-center space-x-3 w-full px-4 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-medium transition-all duration-300 shadow-sm"
                      onClick={() => setIsOpen(false)}
                    >
                      <LogIn className="w-5 h-5" />
                      <span>Sign In</span>
                    </Link>
                    <Link
                      href="/signup"
                      className="flex items-center justify-center space-x-3 w-full px-4 py-3 bg-white text-slate-900 border border-slate-300 hover:bg-slate-50 rounded-xl font-medium transition-all duration-300 shadow-sm"
                      onClick={() => setIsOpen(false)}
                    >
                      <UserPlus className="w-5 h-5" />
                      <span>Sign Up</span>
                    </Link>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      signOut();
                    }}
                    className="flex items-center justify-center space-x-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300 font-medium"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Navbar;
