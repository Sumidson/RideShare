"use client"
import Link from "next/link";
import { useState } from "react";
import { useSupabaseAuth } from '@/app/providers/SupabaseAuthProvider';
import { Car, Menu, X, User, Plus, MapPin, Home, LogIn, LogOut, UserPlus, Users } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useSupabaseAuth();
  const isLoggedIn = !!user;

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/rides", label: "Find Rides", icon: MapPin },
    { href: "/create-ride", label: "Offer Ride", icon: Plus },
    { href: "/profile", label: "Profile", icon: User },
    { href: "/about", label: "About", icon: Users },
  ];

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
              {navItems.map((item) => {
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
                {!isOpen ? (
                  <Menu className="h-6 w-6" />
                ) : (
                  <X className="h-6 w-6" />
                )}
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
