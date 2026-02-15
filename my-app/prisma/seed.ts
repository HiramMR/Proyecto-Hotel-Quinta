import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

// Load environment variables (Node.js 20+)
if (!process.env.DATABASE_URL) {
  process.loadEnvFile()
}

const connectionString = `${process.env.DATABASE_URL}`
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  // 1. Clean the database (optional, but good for testing)
  // We delete reservations first because they depend on rooms
  await prisma.reservation.deleteMany()
  await prisma.room.deleteMany()

  console.log('Deleted old data.')

  // 2. Create Rooms
  const rooms = await prisma.room.createMany({
    data: [
      {
        name: 'Suite Presidencial',
        description: 'Nuestra habitación más lujosa con vista al mar, jacuzzi privado y cama King Size. Ideal para lunas de miel.',
        price: 350000, // $3,500.00 (stored in cents)
        capacity: 2,
        imageUrl: '/img/carrusel/1.jpg', // Make sure this image exists in public/img/carrusel/
      },
      {
        name: 'Habitación Doble Deluxe',
        description: 'Espaciosa habitación con dos camas matrimoniales, balcón privado y todas las comodidades para tu familia.',
        price: 180000, // $1,800.00
        capacity: 4,
        imageUrl: '/img/carrusel/2.jpg',
      },
      {
        name: 'Habitación Sencilla',
        description: 'Perfecta para viajeros de negocios. Cama Queen Size, escritorio de trabajo y wifi de alta velocidad.',
        price: 120000, // $1,200.00
        capacity: 2,
        imageUrl: '/img/carrusel/3.jpg',
      },
    ],
  })

  console.log(`Database has been seeded with ${rooms.count} rooms! 🚀`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })