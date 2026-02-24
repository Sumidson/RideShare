'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, HelpCircle, CalendarCheck, Car, Bookmark } from 'lucide-react';

const sidebarRoutes = [
  { href: '/profile', label: 'Profile', icon: User },
  { href: '/support', label: 'Support', icon: HelpCircle },
  { href: '/my-bookings', label: 'My Bookings', icon: CalendarCheck },
  { href: '/driver', label: 'Driver', icon: Car },
  { href: '/saved', label: 'Saved Rides', icon: Bookmark },
];

export default function Sidebar() {
  const pathname = usePathname();

  // Hide sidebar on the home page
  if (pathname === '/') {
    return null;
  }

  return (
    <aside className="hidden md:block w-56 flex-shrink-0 border-r border-slate-200 bg-white/80 backdrop-blur-sm">
      <nav className="sticky top-16 p-4 space-y-1">
        <p className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Account &amp; help
        </p>
        {sidebarRoutes.map((route) => {
          const Icon = route.icon;
          const isActive = pathname === route.href;
          return (
            <Link
              key={route.href}
              href={route.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span>{route.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
