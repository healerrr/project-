import { createError, defineEventHandler, readBody } from 'h3'
import { prisma } from '../../utils/prisma'
import { createProjectSlug, projectDataFromInput, projectToDto, runtimeDataFromProjectInput } from '../../utils/projectMappers'
import { projectMutationSchema } from '../../utils/projectSchemas'

export default defineEventHandler(async (event) => {
  const result = projectMutationSchema.safeParse(await readBody(event))

  if (!result.success) {
    throw createError({ statusCode: 400, statusMessage: '项目表单校验失败', data: result.error.flatten() })
  }

  const input = result.data
  const project = await prisma.project.create({
    data: {
      ...projectDataFromInput(input),
      slug: createProjectSlug(input.name),
      runtimes: {
        create: runtimeDataFromProjectInput(input)
      }
    },
    include: {
      runtimes: true
    }
  })

  return projectToDto(project)
})
