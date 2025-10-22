import { PrismaClient } from '@prisma/client'

let prisma: PrismaClient

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined
}

if (typeof window === 'undefined') {
  // Solo en servidor/Node.js
  if (typeof global.__prisma === 'undefined') {
    global.__prisma = new PrismaClient()
  }
  prisma = global.__prisma
} else {
  // En cliente, usar una instancia simple (aunque no debería usarse en cliente normalmente)
  throw new Error('Prisma client should not be used in the browser')
}

export default prisma