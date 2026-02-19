import { PrismaClient } from '@prisma/client'
// import { Pool } from 'pg'
// import { PrismaPg } from '@prisma/adapter-pg'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

// const createPrismaClient = () => {
//   const connectionString = process.env.DATABASE_URL
//   if (!connectionString) {
//     throw new Error('DATABASE_URL is not defined. Please check your .env file.')
//   }
//   const pool = new Pool({ connectionString })
//   const adapter = new PrismaPg(pool)
//   return new PrismaClient({ adapter })
// }

// export const prisma = globalForPrisma.prisma || createPrismaClient()

// if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// MOCK (Simulación) del cliente Prisma para evitar errores de conexión
export const prisma = {
  room: {
    findMany: async () => [],
  }
} as unknown as PrismaClient

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// This file ensures we don't create multiple DB connections when Next.js hot-reloads