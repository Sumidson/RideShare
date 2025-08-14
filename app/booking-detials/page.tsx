'use client'; // Only needed for App Router
import { useParams } from 'next/navigation';

export default function BookingDetails() {
  const params = useParams<{ Id: string }>();
  const rideId = params?.Id;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Booking Details</h1>
        <p>Ride ID: {rideId}</p>
      </div>
    </div>
  );
}