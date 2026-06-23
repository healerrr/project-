import { defineEventHandler } from 'h3'
import { prisma } from '../../utils/prisma'
import { projectToDto } from '../../utils/projectMappers'

export default defineEventHandler(async () => {
  const projects = await prisma.project.findMany({
    include: {
      runtimes: {
        orderBy: [{ environment: 'desc' }, { createdAt: 'asc' }]
      }
    },
    orderBy: {
      createdAt: 'asc'
    }
  })

  return projects.map(projectToDto)
})
