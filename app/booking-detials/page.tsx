'use client'; // Only needed for App Router
import { useSearchParams } from 'next/navigation';

export default function BookingDetails() {
  const searchParams = useSearchParams();
  const rideId = searchParams.get('rideId');

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Booking Details</h1>
        <p>Ride ID: {rideId}</p>
        {/* Add your booking form here */}
      </div>
    </div>
  );
}