import { createError, defineEventHandler, getRouterParam, readBody } from 'h3'
import { prisma } from '../../utils/prisma'
import { projectDataFromInput, projectToDto, runtimeDataFromProjectInput } from '../../utils/projectMappers'
import { projectMutationSchema } from '../../utils/projectSchemas'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: '缺少项目 ID' })
  }

  const result = projectMutationSchema.safeParse(await readBody(event))

  if (!result.success) {
    throw createError({ statusCode: 400, statusMessage: '项目表单校验失败', data: result.error.flatten() })
  }

  const input = result.data
  const existing = await prisma.project.findUnique({
    where: { id },
    include: { runtimes: true }
  })

  if (!existing) {
    throw createError({ statusCode: 404, statusMessage: '项目不存在' })
  }

  const runtimeId = input.runtimeId ?? existing.runtimes[0]?.id

  const project = await prisma.$transaction(async (transaction) => {
    await transaction.project.update({
      where: { id },
      data: projectDataFromInput(input)
    })

    if (runtimeId) {
      await transaction.projectRuntime.update({
        where: { id: runtimeId },
        data: runtimeDataFromProjectInput(input)
      })
    } else {
      await transaction.projectRuntime.create({
        data: {
          projectId: id,
          ...runtimeDataFromProjectInput(input)
        }
      })
    }

    return transaction.project.findUniqueOrThrow({
      where: { id },
      include: { runtimes: true }
    })
  })

  return projectToDto(project)
})
