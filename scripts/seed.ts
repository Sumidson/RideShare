import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create sample users
  const user1 = await prisma.user.create({
    data: {
      email: 'john.doe@example.com',
      username: 'johndoe',
      full_name: 'John Doe',
      phone: '+1234567890',
      bio: 'Experienced driver, love to share rides!',
      rating: 4.8,
      total_rides: 25,
      email_verified: true,
      is_verified: true
    }
  })

  const user2 = await prisma.user.create({
    data: {
      email: 'jane.smith@example.com',
      username: 'janesmith',
      full_name: 'Jane Smith',
      phone: '+1234567891',
      bio: 'Friendly passenger, always on time!',
      rating: 4.9,
      total_rides: 15,
      email_verified: true,
      is_verified: true
    }
  })

  // Create sample rides
  const ride1 = await prisma.ride.create({
    data: {
      driver_id: user1.id,
      origin: 'New York, NY',
      destination: 'Philadelphia, PA',
      departure_time: new Date('2024-02-15T09:00:00Z'),
      available_seats: 3,
      price_per_seat: 25.00,
      description: 'Comfortable ride in a sedan. Non-smoking vehicle.',
      status: 'ACTIVE'
    }
  })

  const ride2 = await prisma.ride.create({
    data: {
      driver_id: user1.id,
      origin: 'Los Angeles, CA',
      destination: 'San Francisco, CA',
      departure_time: new Date('2024-02-16T14:30:00Z'),
      available_seats: 2,
      price_per_seat: 45.00,
      description: 'Highway trip with great music and AC.',
      status: 'ACTIVE'
    }
  })

  const ride3 = await prisma.ride.create({
    data: {
      driver_id: user2.id,
      origin: 'Chicago, IL',
      destination: 'Milwaukee, WI',
      departure_time: new Date('2024-02-17T11:00:00Z'),
      available_seats: 4,
      price_per_seat: 20.00,
      description: 'Weekend trip, pet-friendly vehicle.',
      status: 'ACTIVE'
    }
  })

  console.log('Database seeded successfully!')
  console.log(`Created ${await prisma.user.count()} users`)
  console.log(`Created ${await prisma.ride.count()} rides`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })