export type ProjectStatus = 'online' | 'warning' | 'offline' | 'testing' | 'stopped'

export type ProjectEnvironment = '生产环境' | '测试环境' | '预发布环境' | '开发环境'

export type ProjectType =
  | '官网'
  | '管理后台'
  | 'API'
  | '微信公众号'
  | '微信小程序'

export type ProjectIconName =
  | 'globe'
  | 'monitor'
  | 'api'
  | 'mini'
  | 'wechat'
  | 'chart'
  | 'tool'
  | 'shop'
  | 'lab'

export interface Project {
  id: string
  runtimeId?: string
  name: string
  alias: string
  gitlabUrl: string
  testEnvironment: string
  testAccount: string
  testPassword: string
  productionEnvironment: string
  testServer: string
  developer: string
  type: ProjectType
  environment: ProjectEnvironment
  status: ProjectStatus
  responseTime: number | null
  repositoryUrl: string
  serverHost: string
  serverOs: string
  startMethod: string
  remark: string
  createdAt: string
  lastDeployAt: string
  websiteUrl: string
  icon: ProjectIconName
  accent: 'blue' | 'violet' | 'green' | 'mint' | 'sky' | 'orange' | 'rose' | 'slate'
}

export interface ProjectFilters {
  search: string
  category: '全部项目' | ProjectType
  environment: '全部环境' | ProjectEnvironment
  status: '全部状态' | ProjectStatus
  type: '全部类型' | ProjectType
}

export interface ProjectStats {
  total: number
  online: number
  offline: number
  warning: number
}

export interface ProjectFormInput {
  name: string
  alias: string
  gitlabUrl: string
  testEnvironment: string
  testAccount: string
  testPassword: string
  productionEnvironment: string
  testServer: string
  developer: string
  type: ProjectType
  environment: ProjectEnvironment
  status: ProjectStatus
  responseTime: number | null
  repositoryUrl: string
  serverHost: string
  serverOs: string
  startMethod: string
  remark: string
  websiteUrl: string
  icon: ProjectIconName
  accent: Project['accent']
}
