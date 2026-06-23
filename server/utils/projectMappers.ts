import type { Project as DbProject, ProjectRuntime } from '@prisma/client'
import type { Project } from '~/types/project'
import type { ProjectMutationInput, ProjectRuntimeMutationInput } from './projectSchemas'

export type ProjectWithRuntimes = DbProject & {
  runtimes: ProjectRuntime[]
}

export function formatDateTime(value: Date | null) {
  if (!value) return '-'

  const formatter = new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  })

  return formatter.format(value).replaceAll('/', '-')
}

export function projectToDto(project: ProjectWithRuntimes): Project {
  const runtime = project.runtimes[0]

  return {
    id: project.id,
    runtimeId: runtime?.id,
    name: project.name,
    alias: project.alias,
    gitlabUrl: project.gitlabUrl,
    testEnvironment: project.testEnvironment,
    testAccount: project.testAccount,
    testPassword: project.testPassword,
    productionEnvironment: project.productionEnvironment,
    testServer: project.testServer,
    developer: project.developer,
    type: project.type as Project['type'],
    environment: (runtime?.environment ?? '生产环境') as Project['environment'],
    status: (runtime?.status ?? 'stopped') as Project['status'],
    responseTime: runtime?.responseTime ?? null,
    repositoryUrl: project.repositoryUrl,
    serverHost: runtime?.serverHost ?? '-',
    serverOs: runtime?.serverOs ?? '-',
    startMethod: runtime?.startMethod ?? '-',
    remark: runtime?.remark ?? project.description,
    createdAt: formatDateTime(project.createdAt),
    lastDeployAt: formatDateTime(runtime?.lastDeployAt ?? null),
    websiteUrl: project.websiteUrl,
    icon: project.icon as Project['icon'],
    accent: project.accent as Project['accent']
  }
}

export function createProjectSlug(name: string) {
  const normalized = name
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '')

  return `${normalized || 'project'}-${Math.random().toString(36).slice(2, 8)}`
}

export function projectDataFromInput(input: ProjectMutationInput) {
  const gitlabUrl = input.gitlabUrl || input.repositoryUrl
  const productionEnvironment = input.productionEnvironment || input.websiteUrl
  const testServer = input.testServer || input.serverHost
  const alias = input.alias || input.remark

  return {
    name: input.name,
    alias,
    gitlabUrl,
    testEnvironment: input.testEnvironment,
    testAccount: input.testAccount,
    testPassword: input.testPassword,
    productionEnvironment,
    testServer,
    developer: input.developer,
    type: input.type,
    description: alias || input.remark,
    websiteUrl: input.websiteUrl || productionEnvironment,
    repositoryUrl: input.repositoryUrl || gitlabUrl,
    owner: input.developer || '未指定',
    icon: input.icon,
    accent: input.accent,
    tags: JSON.stringify([input.type, input.environment])
  }
}

export function runtimeDataFromProjectInput(input: ProjectMutationInput) {
  const productionEnvironment = input.productionEnvironment || input.websiteUrl
  const testEnvironment = input.testEnvironment
  const testServer = input.testServer || input.serverHost

  return {
    environment: input.environment,
    status: input.status,
    healthCheckType: input.status === 'stopped' ? 'MANUAL' : 'HTTP',
    healthCheckUrl: productionEnvironment || testEnvironment || input.websiteUrl || null,
    serverHost: testServer,
    serverOs: input.serverOs || '未记录',
    startMethod: input.startMethod || '未记录',
    startCommand: input.startMethod || null,
    responseTime: input.responseTime,
    lastCheckedAt: null,
    lastDeployAt: null,
    remark: input.remark || input.alias || input.name
  }
}

export function runtimeDataFromInput(input: ProjectRuntimeMutationInput) {
  return {
    environment: input.environment,
    status: input.status,
    healthCheckType: input.healthCheckType,
    healthCheckUrl: input.healthCheckUrl || null,
    serverHost: input.serverHost,
    serverOs: input.serverOs,
    startMethod: input.startMethod,
    startCommand: input.startCommand || null,
    responseTime: input.responseTime,
    lastDeployAt: input.lastDeployAt ? new Date(input.lastDeployAt) : null,
    remark: input.remark
  }
}
