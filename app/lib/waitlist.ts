import { prisma } from '@/app/lib/prisma'

export async function promoteWaitlistedBookings(rideId: string) {
  const ride = await prisma.ride.findUnique({
    where: { id: rideId },
    select: {
      available_seats: true,
      bookings: {
        where: { status: 'CONFIRMED' },
        select: { seats_booked: true },
      },
    },
  })

  if (!ride) return []

  const confirmedSeats = ride.bookings.reduce((sum, b) => sum + b.seats_booked, 0)
  let seatsLeft = Math.max(ride.available_seats - confirmedSeats, 0)
  if (seatsLeft === 0) return []

  const waitlisted = await prisma.booking.findMany({
    where: { ride_id: rideId, status: 'WAITLISTED' },
    orderBy: { created_at: 'asc' },
    select: { id: true, seats_booked: true },
  })

  const promotedIds: string[] = []
  for (const booking of waitlisted) {
    if (booking.seats_booked <= seatsLeft) {
      await prisma.booking.update({
        where: { id: booking.id },
        data: { status: 'CONFIRMED' },
      })
      promotedIds.push(booking.id)
      seatsLeft -= booking.seats_booked
      if (seatsLeft === 0) break
    }
  }

  return promotedIds
}
