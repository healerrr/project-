import { createError, defineEventHandler, getRouterParam } from 'h3'
import { prisma } from '../../utils/prisma'
import { projectToDto } from '../../utils/projectMappers'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: '缺少项目 ID' })
  }

  const project = await prisma.project.findUnique({
    where: { id },
    include: { runtimes: true }
  })

  if (!project) {
    throw createError({ statusCode: 404, statusMessage: '项目不存在' })
  }

  return projectToDto(project)
})
