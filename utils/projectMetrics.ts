import type { Project, ProjectFilters, ProjectStats, ProjectStatus } from '~/types/project'

export const statusText: Record<ProjectStatus, string> = {
  online: '运行中',
  warning: '预警',
  offline: '离线',
  testing: '测试中',
  stopped: '已停止'
}

export const statusTone: Record<ProjectStatus, string> = {
  online: 'text-emerald-500',
  warning: 'text-amber-500',
  offline: 'text-violet-500',
  testing: 'text-blue-500',
  stopped: 'text-slate-400'
}

export const categoryOptions = [
  '全部项目',
  '官网',
  '管理后台',
  'API',
  '微信公众号',
  '微信小程序'
] as const

export const projectTypeOrder: Record<Project['type'], number> = {
  官网: 1,
  管理后台: 2,
  API: 3,
  微信公众号: 4,
  微信小程序: 5
}

export const environmentOptions = ['全部环境', '生产环境', '测试环境', '预发布环境', '开发环境'] as const
export const statusOptions = ['全部状态', 'online', 'warning', 'offline', 'testing', 'stopped'] as const
export const typeOptions = categoryOptions.map((item) => (item === '全部项目' ? '全部类型' : item))

export function calculateProjectStats(projects: Project[]): ProjectStats {
  return {
    total: projects.length,
    online: projects.filter((project) => project.status === 'online').length,
    offline: projects.filter((project) => project.status === 'offline').length,
    warning: projects.filter((project) => project.status === 'warning').length
  }
}

export function filterProjects(projects: Project[], filters: ProjectFilters): Project[] {
  const query = filters.search.trim().toLowerCase()

  return projects.filter((project) => {
    const matchesCategory = filters.category === '全部项目' || project.type === filters.category
    const matchesEnvironment = filters.environment === '全部环境' || project.environment === filters.environment
    const matchesStatus = filters.status === '全部状态' || project.status === filters.status
    const matchesType = filters.type === '全部类型' || project.type === filters.type
    const searchable = [
      project.name,
      project.alias,
      project.type,
      project.gitlabUrl,
      project.testEnvironment,
      project.productionEnvironment,
      project.testServer,
      project.developer,
      project.repositoryUrl,
      project.remark
    ].join(' ').toLowerCase()
    const matchesSearch = query.length === 0 || searchable.includes(query)

    return matchesCategory && matchesEnvironment && matchesStatus && matchesType && matchesSearch
  })
}

export function sortProjectsByType(projects: Project[]): Project[] {
  return [...projects].sort((first, second) => {
    const typeDelta = projectTypeOrder[first.type] - projectTypeOrder[second.type]
    if (typeDelta !== 0) return typeDelta
    return first.name.localeCompare(second.name, 'zh-CN')
  })
}
