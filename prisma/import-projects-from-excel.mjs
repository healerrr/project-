import path from 'node:path'
import process from 'node:process'
import { PrismaClient } from '@prisma/client'
import XLSX from 'xlsx'

const prisma = new PrismaClient()

const excelFilename = `${String.fromCharCode(0x9879, 0x76ee, 0x73af, 0x5883)}.xlsx`
const defaultExcelPath = path.join(process.env.USERPROFILE || 'C:/Users/Thinkpad User', 'Desktop', excelFilename)
const excelPath = process.argv[2] || defaultExcelPath

const projectTypes = {
  website: '官网',
  admin: '管理后台',
  api: 'API',
  wechat: '微信公众号',
  mini: '微信小程序'
}

const typeVisuals = {
  [projectTypes.website]: { icon: 'globe', accent: 'blue' },
  [projectTypes.admin]: { icon: 'monitor', accent: 'violet' },
  [projectTypes.api]: { icon: 'api', accent: 'rose' },
  [projectTypes.wechat]: { icon: 'wechat', accent: 'mint' },
  [projectTypes.mini]: { icon: 'mini', accent: 'sky' }
}

function cell(row, key) {
  return String(row[key] ?? '').trim()
}

function inferType(name, alias, gitlabUrl) {
  const text = `${name} ${alias} ${gitlabUrl}`.toLowerCase()

  if (/api|接口|server|service/.test(text)) return projectTypes.api
  if (/admin|后台|manage/.test(text)) return projectTypes.admin
  if (/公众号|wechat|mp/.test(text)) return projectTypes.wechat
  if (/小程序|mini/.test(text)) return projectTypes.mini
  if (/oa|erp|crm|oms|wms|tool|工具|数据|大屏|screen|chart|bi|user|用户/.test(text)) return projectTypes.admin

  return projectTypes.website
}

function slugify(value, index) {
  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '')

  return `${normalized || 'project'}-${index + 1}`
}

async function ensureExcelColumns() {
  const columns = [
    ['alias', 'TEXT NOT NULL DEFAULT ""'],
    ['gitlabUrl', 'TEXT NOT NULL DEFAULT ""'],
    ['testEnvironment', 'TEXT NOT NULL DEFAULT ""'],
    ['testAccount', 'TEXT NOT NULL DEFAULT ""'],
    ['testPassword', 'TEXT NOT NULL DEFAULT ""'],
    ['productionEnvironment', 'TEXT NOT NULL DEFAULT ""'],
    ['testServer', 'TEXT NOT NULL DEFAULT ""'],
    ['developer', 'TEXT NOT NULL DEFAULT ""']
  ]
  const existing = await prisma.$queryRawUnsafe('PRAGMA table_info("Project")')
  const existingNames = new Set(existing.map((column) => column.name))

  for (const [name, definition] of columns) {
    if (!existingNames.has(name)) {
      await prisma.$executeRawUnsafe(`ALTER TABLE "Project" ADD COLUMN "${name}" ${definition}`)
    }
  }
}

function readRows() {
  const workbook = XLSX.readFile(excelPath, { cellDates: true })
  const worksheet = workbook.Sheets['网站'] ?? workbook.Sheets[workbook.SheetNames[0]]

  if (!worksheet) {
    throw new Error('Excel 文件中没有可导入的工作表')
  }

  return XLSX.utils
    .sheet_to_json(worksheet, { defval: '', raw: false })
    .map((row) => ({
      name: cell(row, '项目'),
      alias: cell(row, '别名'),
      gitlabUrl: cell(row, 'gitlab地址'),
      testEnvironment: cell(row, '测试环境'),
      testAccount: cell(row, '测试账号'),
      testPassword: cell(row, '测试密码'),
      productionEnvironment: cell(row, '生产环境'),
      testServer: cell(row, '测试服务器'),
      developer: cell(row, '开发')
    }))
    .filter((row) => row.name || row.alias || row.gitlabUrl)
}

function toProjectCreate(row, index) {
  const name = row.name || row.alias || `未命名项目 ${index + 1}`
  const type = inferType(name, row.alias, row.gitlabUrl)
  const visual = typeVisuals[type]
  const environment = row.productionEnvironment ? '生产环境' : row.testEnvironment ? '测试环境' : '开发环境'
  const status = row.productionEnvironment || row.testEnvironment ? 'online' : 'stopped'
  const websiteUrl = row.productionEnvironment || row.testEnvironment

  return {
    name,
    slug: slugify(name, index),
    alias: row.alias,
    gitlabUrl: row.gitlabUrl,
    testEnvironment: row.testEnvironment,
    testAccount: row.testAccount,
    testPassword: row.testPassword,
    productionEnvironment: row.productionEnvironment,
    testServer: row.testServer,
    developer: row.developer,
    type,
    description: row.alias || name,
    websiteUrl,
    repositoryUrl: row.gitlabUrl,
    owner: row.developer || '未指定',
    icon: visual.icon,
    accent: visual.accent,
    tags: JSON.stringify([type, environment, row.developer].filter(Boolean)),
    runtimes: {
      create: {
        environment,
        status,
        healthCheckType: websiteUrl ? 'HTTP' : 'MANUAL',
        healthCheckUrl: websiteUrl || null,
        serverHost: row.testServer || '-',
        serverOs: row.testServer ? '未记录' : '-',
        startMethod: '未记录',
        startCommand: null,
        responseTime: null,
        lastCheckedAt: null,
        lastDeployAt: null,
        remark: row.alias || name
      }
    }
  }
}

try {
  await ensureExcelColumns()

  const rows = readRows()

  await prisma.$transaction(async (transaction) => {
    await transaction.projectRuntime.deleteMany()
    await transaction.project.deleteMany()

    for (const [index, row] of rows.entries()) {
      await transaction.project.create({
        data: toProjectCreate(row, index)
      })
    }
  })

  console.log(`已从 ${excelPath} 导入 ${rows.length} 个项目。`)
} finally {
  await prisma.$disconnect()
}
