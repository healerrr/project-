import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const baseProjects = [
  ['nebula-web', '星云官网', '官网', '生产环境', 'online', 128, 'github.com/galaxy/nebula-web', '192.168.1.10', 'Ubuntu 22.04', 'Nginx + PM2', '企业官网与品牌展示站点，支持多语言与 SEO 优化。', 'https://nebula.example.com', 'globe', 'blue', '2024-01-15T10:30:22.000Z', '2024-05-24T14:25:18.000Z'],
  ['admin-system', '管理后台系统', '管理后台', '生产环境', 'online', 98, 'github.com/galaxy/admin-system', '192.168.1.11', 'Ubuntu 22.04', 'Docker Compose', '后台管理系统，包含用户与权限管理。', 'https://admin.example.com', 'monitor', 'violet', '2024-01-22T09:18:45.000Z', '2024-05-25T09:20:11.000Z'],
  ['user-center-api', '用户中心 API', 'API', '生产环境', 'online', 72, 'github.com/galaxy/user-center-api', '192.168.1.12', 'Ubuntu 22.04', 'Docker + PM2', '提供用户相关的 RESTful API。', 'https://api.example.com/user', 'api', 'rose', '2024-02-02T11:40:09.000Z', '2024-05-23T18:01:30.000Z'],
  ['nebula-mp', '星云小程序', '微信小程序', '生产环境', 'online', 156, 'github.com/galaxy/nebula-mp', '-', '-', '云开发', '微信小程序，提供核心业务服务。', 'https://mp.weixin.qq.com', 'mini', 'sky', '2024-02-12T15:36:44.000Z', '2024-05-22T10:10:16.000Z'],
  ['official-account', '星云科技公众号', '微信公众号', '生产环境', 'online', 200, 'github.com/galaxy/nebula-mp-official', '-', '-', '云函数', '公众号服务与消息推送。', 'https://mp.weixin.qq.com', 'wechat', 'mint', '2024-02-20T13:22:51.000Z', '2024-05-16T11:25:09.000Z'],
  ['data-screen', '运营数据大屏', '管理后台', '测试环境', 'testing', 210, 'github.com/galaxy/data-screen', '192.168.1.20', 'CentOS 7.9', 'Nginx', '实时运营数据可视化大屏。', 'https://screen.example.com', 'monitor', 'violet', '2024-03-01T10:12:40.000Z', '2024-05-18T16:40:27.000Z'],
  ['tool-platform', '内部工具平台', '管理后台', '测试环境', 'testing', 310, 'github.com/galaxy/tool-platform', '192.168.1.21', 'Ubuntu 20.04', 'Docker Compose', '内部效率工具集合。', 'https://tools.example.com', 'monitor', 'violet', '2024-03-16T08:48:12.000Z', '2024-05-12T19:34:01.000Z'],
  ['ecommerce-api', '电商服务', 'API', '生产环境', 'warning', null, 'github.com/galaxy/ecommerce-api', '192.168.1.13', 'Ubuntu 22.04', 'Docker + PM2', '电商核心服务，异常告警中。', 'https://api.example.com/shop', 'api', 'rose', '2024-04-05T17:21:00.000Z', '2024-05-21T20:08:35.000Z'],
  ['exp-project', '实验性项目', '管理后台', '开发环境', 'stopped', null, 'github.com/galaxy/exp-project', '-', '-', '-', '实验性功能验证项目。', '', 'monitor', 'violet', '2024-04-28T12:00:00.000Z', null]
]

const projectTypes = ['官网', '管理后台', 'API', '微信公众号', '微信小程序']
const icons = ['globe', 'monitor', 'api', 'wechat', 'mini', 'chart', 'api', 'tool']
const accents = ['blue', 'violet', 'green', 'mint', 'sky', 'orange', 'rose', 'slate']
const statuses = ['online', 'online', 'online', 'online', 'online', 'online', 'online', 'online', 'online', 'online', 'online', 'online', 'online', 'warning', 'offline']

const extraProjects = statuses.map((status, index) => {
  const type = projectTypes[index % projectTypes.length]
  const projectNumber = index + 10
  const environment = index % 3 === 0 ? '预发布环境' : index % 2 === 0 ? '测试环境' : '生产环境'
  const createdDay = String((index % 18) + 1).padStart(2, '0')
  const deployDay = String((index % 20) + 1).padStart(2, '0')

  return [
    `archive-project-${projectNumber}`,
    `${type}项目 ${projectNumber}`,
    type,
    environment,
    status,
    status === 'offline' ? null : 80 + index * 9,
    `github.com/galaxy/archive-${projectNumber}`,
    status === 'offline' ? '-' : `192.168.2.${projectNumber}`,
    status === 'offline' ? '-' : 'Ubuntu 22.04',
    index % 2 === 0 ? 'Docker Compose' : 'Nginx + PM2',
    `${type}补充项目，用于完整呈现项目池统计。`,
    `https://archive-${projectNumber}.example.com`,
    icons[index % icons.length],
    accents[index % accents.length],
    `2024-04-${createdDay}T09:30:00.000Z`,
    status === 'offline' ? null : `2024-05-${deployDay}T16:20:00.000Z`
  ]
})

function toRecord(row) {
  const [slug, name, type, environment, status, responseTime, repositoryUrl, serverHost, serverOs, startMethod, remark, websiteUrl, icon, accent, createdAt, lastDeployAt] = row

  return {
    slug,
    name,
    type,
    environment,
    status,
    responseTime,
    repositoryUrl,
    serverHost,
    serverOs,
    startMethod,
    remark,
    websiteUrl,
    icon,
    accent,
    createdAt: new Date(createdAt),
    lastDeployAt: lastDeployAt ? new Date(lastDeployAt) : null
  }
}

async function main() {
  await prisma.projectRuntime.deleteMany()
  await prisma.project.deleteMany()

  for (const record of [...baseProjects, ...extraProjects].map(toRecord)) {
    await prisma.project.create({
      data: {
        name: record.name,
        slug: record.slug,
        type: record.type,
        description: record.remark,
        websiteUrl: record.websiteUrl,
        repositoryUrl: record.repositoryUrl,
        owner: '星云科技',
        icon: record.icon,
        accent: record.accent,
        tags: JSON.stringify([record.type, record.environment]),
        createdAt: record.createdAt,
        runtimes: {
          create: {
            environment: record.environment,
            status: record.status,
            healthCheckType: record.status === 'stopped' ? 'MANUAL' : 'HTTP',
            healthCheckUrl: record.websiteUrl || null,
            serverHost: record.serverHost,
            serverOs: record.serverOs,
            startMethod: record.startMethod,
            startCommand: record.startMethod,
            responseTime: record.responseTime,
            lastCheckedAt: record.lastDeployAt,
            lastDeployAt: record.lastDeployAt,
            remark: record.remark
          }
        }
      }
    })
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (error) => {
    console.error(error)
    await prisma.$disconnect()
    process.exit(1)
  })
