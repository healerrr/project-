import { describe, expect, it } from 'vitest'
import { projectMutationSchema, projectRuntimeMutationSchema } from '../../server/utils/projectSchemas'

describe('project API schemas', () => {
  it('accepts a valid project mutation payload', () => {
    const result = projectMutationSchema.safeParse({
      name: '测试项目',
      type: '官网',
      environment: '生产环境',
      status: 'online',
      responseTime: 88,
      repositoryUrl: 'github.com/galaxy/test',
      serverHost: '192.168.10.10',
      serverOs: 'Ubuntu 22.04',
      startMethod: 'Nginx + PM2',
      remark: '用于接口校验测试',
      websiteUrl: 'https://test.example.com',
      icon: 'globe',
      accent: 'blue'
    })

    expect(result.success).toBe(true)
  })

  it('rejects missing required project fields', () => {
    const result = projectMutationSchema.safeParse({
      name: '',
      type: '官网',
      environment: '生产环境',
      status: 'online',
      responseTime: 88,
      repositoryUrl: '',
      serverHost: '192.168.10.10',
      serverOs: 'Ubuntu 22.04',
      startMethod: 'Nginx + PM2',
      remark: '',
      websiteUrl: '',
      icon: 'globe',
      accent: 'blue'
    })

    expect(result.success).toBe(false)
  })

  it('accepts runtime payloads for a project environment', () => {
    const result = projectRuntimeMutationSchema.safeParse({
      environment: '测试环境',
      status: 'testing',
      healthCheckType: 'MANUAL',
      healthCheckUrl: '',
      serverHost: '192.168.10.11',
      serverOs: 'Ubuntu 22.04',
      startMethod: 'Docker Compose',
      startCommand: 'docker compose up -d',
      responseTime: null,
      remark: '测试环境'
    })

    expect(result.success).toBe(true)
  })
})
