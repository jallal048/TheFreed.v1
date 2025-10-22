import { PrismaClient } from '@prisma/client'

let prisma: PrismaClient

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined
}

if (typeof window === 'undefined') {
  if (typeof global.__prisma === 'undefined') {
    global.__prisma = new PrismaClient()
  }
  prisma = global.__prisma
} else {
  throw new Error('Prisma client should not be used in the browser')
}

export default prisma
