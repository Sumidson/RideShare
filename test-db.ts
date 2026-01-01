
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
})

async function main() {
    console.log('--- DB TEST START ---')
    try {
        if (!process.env.DATABASE_URL) {
            throw new Error('DATABASE_URL is not defined in environment')
        }
        console.log('DATABASE_URL is defined')

        console.log('Attempting to connect...')
        await prisma.$connect()
        console.log('Connected via $connect()')

        console.log('Querying User count...')
        const count = await prisma.user.count()
        console.log(`User count: ${count}`)
        console.log('--- DB TEST SUCCESS ---')
    } catch (e: any) {
        console.error('--- DB TEST FAILED ---')
        console.error('Error name:', e.name)
        console.error('Error message:', e.message)
        // console.error('Full error:', e)
    } finally {
        await prisma.$disconnect()
    }
}

main()
