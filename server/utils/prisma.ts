import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prismaClient?: PrismaClient
}

export const prisma = globalForPrisma.prismaClient ?? new PrismaClient()

if (import.meta.dev) {
  globalForPrisma.prismaClient = prisma
}
