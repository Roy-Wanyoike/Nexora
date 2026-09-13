import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Only log queries in dev when explicitly requested via DEBUG_PRISMA=1
// Avoids leaking sensitive data (emails, account numbers) to stdout/logs.
const logLevel = process.env.DEBUG_PRISMA === '1' && process.env.NODE_ENV !== 'production'
  ? ['query', 'warn', 'error'] as const
  : ['warn', 'error'] as const

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: logLevel,
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
