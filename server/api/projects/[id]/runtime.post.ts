import { createError, defineEventHandler, getRouterParam, readBody } from 'h3'
import { prisma } from '../../../utils/prisma'
import { runtimeDataFromInput } from '../../../utils/projectMappers'
import { projectRuntimeMutationSchema } from '../../../utils/projectSchemas'

export default defineEventHandler(async (event) => {
  const projectId = getRouterParam(event, 'id')

  if (!projectId) {
    throw createError({ statusCode: 400, statusMessage: '缺少项目 ID' })
  }

  const result = projectRuntimeMutationSchema.safeParse(await readBody(event))

  if (!result.success) {
    throw createError({ statusCode: 400, statusMessage: '运行环境表单校验失败', data: result.error.flatten() })
  }

  return prisma.projectRuntime.create({
    data: {
      projectId,
      ...runtimeDataFromInput(result.data)
    }
  })
})
