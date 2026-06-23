import { createError, defineEventHandler, getRouterParam, readBody } from 'h3'
import { prisma } from '../../utils/prisma'
import { runtimeDataFromInput } from '../../utils/projectMappers'
import { projectRuntimeMutationSchema } from '../../utils/projectSchemas'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: '缺少运行环境 ID' })
  }

  const result = projectRuntimeMutationSchema.safeParse(await readBody(event))

  if (!result.success) {
    throw createError({ statusCode: 400, statusMessage: '运行环境表单校验失败', data: result.error.flatten() })
  }

  return prisma.projectRuntime.update({
    where: { id },
    data: runtimeDataFromInput(result.data)
  })
})
