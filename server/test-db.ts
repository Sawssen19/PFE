import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    const result = await prisma.$connect()
    console.log('Connected to database successfully!')
    return result
  } catch (error) {
    console.error('Error connecting to database:', error)
    return null
  } finally {
    await prisma.$disconnect()
  }
}

main()