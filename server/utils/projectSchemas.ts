import { z } from 'zod'

export const projectTypeSchema = z.enum([
  '官网',
  '管理后台',
  'API',
  '微信公众号',
  '微信小程序'
])

export const projectEnvironmentSchema = z.enum(['生产环境', '测试环境', '预发布环境', '开发环境'])
export const projectStatusSchema = z.enum(['online', 'warning', 'offline', 'testing', 'stopped'])
export const projectIconSchema = z.enum(['globe', 'monitor', 'api', 'mini', 'wechat', 'chart', 'tool', 'shop', 'lab'])
export const projectAccentSchema = z.enum(['blue', 'violet', 'green', 'mint', 'sky', 'orange', 'rose', 'slate'])
export const healthCheckTypeSchema = z.enum(['HTTP', 'TCP', 'MANUAL', 'NONE'])

const optionalUrlSchema = z.string().trim().max(300).optional().default('')
const requiredTextSchema = z.string().trim().min(1).max(300)
const optionalTextSchema = z.string().trim().max(300).optional().default('')

export const projectMutationSchema = z.object({
  name: requiredTextSchema,
  alias: optionalTextSchema,
  gitlabUrl: optionalUrlSchema,
  testEnvironment: optionalUrlSchema,
  testAccount: optionalTextSchema,
  testPassword: optionalTextSchema,
  productionEnvironment: optionalUrlSchema,
  testServer: optionalTextSchema,
  developer: optionalTextSchema,
  type: projectTypeSchema,
  environment: projectEnvironmentSchema,
  status: projectStatusSchema,
  responseTime: z.number().int().min(0).nullable(),
  repositoryUrl: optionalTextSchema,
  serverHost: z.string().trim().max(120).optional().default(''),
  serverOs: z.string().trim().max(120).optional().default('未记录'),
  startMethod: z.string().trim().max(300).optional().default('未记录'),
  remark: z.string().trim().max(600).optional().default(''),
  websiteUrl: optionalUrlSchema,
  icon: projectIconSchema,
  accent: projectAccentSchema,
  runtimeId: z.string().optional()
})

export const projectRuntimeMutationSchema = z.object({
  environment: projectEnvironmentSchema,
  status: projectStatusSchema,
  healthCheckType: healthCheckTypeSchema.default('MANUAL'),
  healthCheckUrl: optionalUrlSchema,
  serverHost: z.string().trim().min(1).max(120),
  serverOs: z.string().trim().min(1).max(120),
  startMethod: requiredTextSchema,
  startCommand: z.string().trim().max(300).optional().default(''),
  responseTime: z.number().int().min(0).nullable(),
  lastDeployAt: z.string().datetime().nullable().optional(),
  remark: requiredTextSchema.max(600)
})

export type ProjectMutationInput = z.infer<typeof projectMutationSchema>
export type ProjectRuntimeMutationInput = z.infer<typeof projectRuntimeMutationSchema>
