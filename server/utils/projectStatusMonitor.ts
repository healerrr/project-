import { prisma } from './prisma'

const CHECK_INTERVAL_MS = 10 * 60 * 1000
const REQUEST_TIMEOUT_MS = 8000
const CONCURRENCY = 8

type MonitorResult = {
  checked: number
  online: number
  warning: number
  offline: number
  skipped: number
}

type MonitorRuntimeState = {
  running: boolean
  timer?: ReturnType<typeof setInterval>
}

const globalForMonitor = globalThis as typeof globalThis & {
  projectStatusMonitor?: MonitorRuntimeState
}

function normalizeUrl(value: string) {
  const url = value.trim()

  if (!url || url === '-' || url === '无') return ''
  if (/^https?:\/\//i.test(url)) return url
  return `https://${url}`
}

async function checkUrl(url: string) {
  const startedAt = Date.now()
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  try {
    const response = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      signal: controller.signal
    })
    const responseTime = Date.now() - startedAt

    if (response.ok) {
      return { status: 'online', responseTime }
    }

    return {
      status: response.status >= 500 ? 'offline' : 'warning',
      responseTime
    }
  } catch {
    return {
      status: 'offline',
      responseTime: Date.now() - startedAt
    }
  } finally {
    clearTimeout(timeout)
  }
}

async function updateProjectStatus(projectId: string, status: string, responseTime: number, healthCheckUrl: string) {
  const runtime = await prisma.projectRuntime.findFirst({
    where: { projectId },
    orderBy: [{ environment: 'desc' }, { createdAt: 'asc' }]
  })

  const data = {
    status,
    responseTime,
    healthCheckType: 'HTTP',
    healthCheckUrl,
    lastCheckedAt: new Date()
  }

  if (runtime) {
    await prisma.projectRuntime.update({
      where: { id: runtime.id },
      data
    })
    return
  }

  await prisma.projectRuntime.create({
    data: {
      projectId,
      environment: '生产环境',
      serverHost: '-',
      serverOs: '-',
      startMethod: '未记录',
      startCommand: null,
      lastDeployAt: null,
      remark: '自动巡检创建',
      ...data
    }
  })
}

async function runWithConcurrency<T>(items: T[], task: (item: T) => Promise<void>) {
  let cursor = 0
  const workers = Array.from({ length: Math.min(CONCURRENCY, items.length) }, async () => {
    while (cursor < items.length) {
      const item = items[cursor]
      cursor += 1
      await task(item)
    }
  })

  await Promise.all(workers)
}

export async function checkProjectProductionStatuses(): Promise<MonitorResult> {
  const result: MonitorResult = {
    checked: 0,
    online: 0,
    warning: 0,
    offline: 0,
    skipped: 0
  }

  const projects = await prisma.project.findMany({
    select: {
      id: true,
      productionEnvironment: true,
      websiteUrl: true
    }
  })

  await runWithConcurrency(projects, async (project) => {
    const url = normalizeUrl(project.productionEnvironment || project.websiteUrl)

    if (!url) {
      result.skipped += 1
      return
    }

    const checked = await checkUrl(url)
    result.checked += 1
    result[checked.status as 'online' | 'warning' | 'offline'] += 1
    await updateProjectStatus(project.id, checked.status, checked.responseTime, url)
  })

  return result
}

export function startProjectStatusMonitor() {
  const state = globalForMonitor.projectStatusMonitor ?? { running: false }
  globalForMonitor.projectStatusMonitor = state

  if (state.timer) return

  const run = async () => {
    if (state.running) return

    state.running = true
    try {
      await checkProjectProductionStatuses()
    } finally {
      state.running = false
    }
  }

  state.timer = setInterval(() => {
    void run()
  }, CHECK_INTERVAL_MS)

  void run()
}
