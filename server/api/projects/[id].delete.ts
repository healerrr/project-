import { createError, defineEventHandler, getRouterParam } from 'h3'
import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: '缺少项目 ID' })
  }

  await prisma.project.delete({
    where: { id }
  })

  return { ok: true }
})
