
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    try {
        console.log('Fetching all rides...')
        const rides = await prisma.ride.findMany({
            include: {
                driver: true
            }
        })
        console.log(`Found ${rides.length} rides.`)
        rides.forEach(ride => {
            console.log('---------------------------------------------------')
            console.log(`ID: ${ride.id}`)
            console.log(`Origin: ${ride.origin}`)
            console.log(`Destination: ${ride.destination}`)
            console.log(`Departure Time: ${ride.departure_time} (ISO: ${ride.departure_time.toISOString()})`)
            console.log(`Status: ${ride.status}`)
            console.log(`Available Seats: ${ride.available_seats}`)
            console.log(`Driver: ${ride.driver?.username} (${ride.driver_id})`)
        })
    } catch (e) {
        console.error('Error fetching rides:', e)
    } finally {
        await prisma.$disconnect()
    }
}

main()
