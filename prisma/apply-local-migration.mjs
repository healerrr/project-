import { readFile } from 'node:fs/promises'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const sql = await readFile(new URL('./migrations/20260617000000_init/migration.sql', import.meta.url), 'utf8')

try {
  await prisma.$executeRawUnsafe('PRAGMA foreign_keys = ON')

  for (const statement of sql.split(';').map((part) => part.trim()).filter(Boolean)) {
    await prisma.$executeRawUnsafe(statement)
  }
} finally {
  await prisma.$disconnect()
}
