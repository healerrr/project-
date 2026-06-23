import { describe, expect, it } from 'vitest'
import type { Project } from '../../types/project'
import { calculateProjectStats, filterProjects } from '../../utils/projectMetrics'

const projects: Project[] = [
  {
    id: 'a',
    name: '星云官网',
    alias: '品牌展示',
    gitlabUrl: 'github.com/demo/web',
    testEnvironment: 'https://test.example.com',
    testAccount: 'demo',
    testPassword: 'demo-password',
    productionEnvironment: 'https://example.com',
    testServer: '192.168.1.10',
    developer: '前端',
    type: '官网',
    environment: '生产环境',
    status: 'online',
    responseTime: 120,
    repositoryUrl: 'github.com/demo/web',
    serverHost: '192.168.1.10',
    serverOs: 'Ubuntu',
    startMethod: 'Nginx',
    remark: '品牌展示',
    createdAt: '2024-01-01 10:00:00',
    lastDeployAt: '2024-01-02 10:00:00',
    websiteUrl: 'https://example.com',
    icon: 'globe',
    accent: 'blue'
  },
  {
    id: 'b',
    name: '电商服务',
    alias: '电商服务接口',
    gitlabUrl: 'github.com/demo/api',
    testEnvironment: 'https://api-test.example.com',
    testAccount: 'api-demo',
    testPassword: 'api-password',
    productionEnvironment: 'https://api.example.com',
    testServer: '192.168.1.11',
    developer: '后端',
    type: 'API',
    environment: '测试环境',
    status: 'warning',
    responseTime: null,
    repositoryUrl: 'github.com/demo/api',
    serverHost: '192.168.1.11',
    serverOs: 'Ubuntu',
    startMethod: 'Docker',
    remark: '异常告警',
    createdAt: '2024-01-01 10:00:00',
    lastDeployAt: '2024-01-02 10:00:00',
    websiteUrl: 'https://api.example.com',
    icon: 'api',
    accent: 'rose'
  }
]

describe('project metrics', () => {
  it('calculates dashboard stats from all projects', () => {
    expect(calculateProjectStats(projects)).toEqual({
      total: 2,
      online: 1,
      offline: 0,
      warning: 1
    })
  })

  it('filters by search, category, environment, status and type', () => {
    const result = filterProjects(projects, {
      search: 'api',
      category: 'API',
      environment: '测试环境',
      status: 'warning',
      type: 'API'
    })

    expect(result).toHaveLength(1)
    expect(result[0]?.name).toBe('电商服务')
  })
})
