<script setup lang="ts">
import {
  CalendarClock,
  Clock3,
  ExternalLink,
  Github,
  Link2,
  Pencil,
  Server,
  TerminalSquare,
  Trash2,
  Timer,
  X
} from 'lucide-vue-next'
import type { Project } from '~/types/project'
import { statusText, statusTone } from '~/utils/projectMetrics'

defineProps<{
  project: Project | null
  open: boolean
}>()

const emit = defineEmits<{
  edit: [project: Project]
  delete: [project: Project]
  close: []
}>()

function externalUrl(value: string) {
  if (!value) return '#'
  return /^https?:\/\//.test(value) ? value : `https://${value}`
}
</script>

<template>
  <aside
    :class="[
      'soft-card fixed inset-x-3 top-3 z-20 max-h-[calc(100vh-1.5rem)] overflow-y-auto rounded-[22px] p-4 transition duration-200 sm:inset-x-6 sm:top-6 sm:max-h-[calc(100vh-3rem)] sm:p-5 xl:sticky xl:top-5 xl:h-[calc(100vh-150px)] xl:min-h-[620px]',
      open ? 'block' : 'hidden'
    ]"
  >
    <div v-if="project" :key="project.id" class="animate-[fadeIn_220ms_ease-out]">
      <button
        type="button"
        class="absolute right-5 top-5 z-30 grid h-9 w-9 place-items-center rounded-full text-blue-400 transition hover:bg-blue-50"
        title="关闭详情"
        @click.stop="emit('close')"
      >
        <X :size="21" />
      </button>

      <div class="pointer-events-none absolute right-8 top-6 h-24 w-40 overflow-hidden rounded-full opacity-80">
        <img
          src="/reference/detail-planet.png"
          alt=""
          class="h-full w-full object-cover"
        >
      </div>

      <div class="relative mb-7 flex items-center gap-5 px-3 pt-4">
        <ProjectIcon :icon="project.icon" :accent="project.accent" size="lg" />
        <div class="min-w-0">
          <div class="mb-2 flex items-center gap-3">
            <h2 class="truncate text-[21px] font-bold text-ink">{{ project.name }}</h2>
            <span :class="['text-sm font-semibold', statusTone[project.status]]">● {{ statusText[project.status] }}</span>
          </div>
          <p class="mb-2 truncate text-sm font-semibold text-muted">{{ project.alias || '暂无别名' }}</p>
          <div class="flex gap-2">
            <span class="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-600">{{ project.type }}</span>
          </div>
        </div>
      </div>

      <dl class="mx-1 rounded-[18px] border border-line bg-white/72 px-5">
        <div class="grid grid-cols-[30px_110px_minmax(0,1fr)] items-center border-b border-line py-4">
          <Timer class="text-blue-500" :size="20" />
          <dt class="font-semibold text-muted">开发</dt>
          <dd class="font-semibold text-ink">{{ project.developer || '未指定' }}</dd>
        </div>
        <div class="grid grid-cols-[30px_110px_minmax(0,1fr)] items-center border-b border-line py-4">
          <Link2 class="text-blue-500" :size="20" />
          <dt class="font-semibold text-muted">GitLab地址</dt>
          <dd class="flex min-w-0 items-center gap-2 font-semibold text-ink">
            <span class="truncate">{{ project.gitlabUrl || project.repositoryUrl || '-' }}</span>
            <ExternalLink class="shrink-0 text-slate-400" :size="16" />
          </dd>
        </div>
        <div class="grid grid-cols-[30px_110px_minmax(0,1fr)] items-center border-b border-line py-4">
          <Server class="text-blue-500" :size="20" />
          <dt class="font-semibold text-muted">测试服务器</dt>
          <dd class="font-semibold text-ink">{{ project.testServer || project.serverHost || '-' }}</dd>
        </div>
        <div class="grid grid-cols-[30px_110px_minmax(0,1fr)] items-center border-b border-line py-4">
          <TerminalSquare class="text-blue-500" :size="20" />
          <dt class="font-semibold text-muted">测试环境</dt>
          <dd class="min-w-0 truncate font-semibold text-ink">{{ project.testEnvironment || '-' }}</dd>
        </div>
        <div class="grid grid-cols-[30px_110px_minmax(0,1fr)] items-center border-b border-line py-4">
          <Pencil class="text-blue-500" :size="20" />
          <dt class="font-semibold text-muted">测试账号</dt>
          <dd class="min-w-0 truncate font-semibold text-ink">{{ project.testAccount || '-' }}</dd>
        </div>
        <div class="grid grid-cols-[30px_110px_minmax(0,1fr)] items-center border-b border-line py-4">
          <Pencil class="text-blue-500" :size="20" />
          <dt class="font-semibold text-muted">测试密码</dt>
          <dd class="min-w-0 truncate font-semibold text-ink">{{ project.testPassword || '-' }}</dd>
        </div>
        <div class="grid grid-cols-[30px_110px_minmax(0,1fr)] items-center border-b border-line py-4">
          <Clock3 class="text-blue-500" :size="20" />
          <dt class="font-semibold text-muted">生产环境</dt>
          <dd class="min-w-0 truncate font-semibold text-ink">{{ project.productionEnvironment || project.websiteUrl || '-' }}</dd>
        </div>
        <div class="grid grid-cols-[30px_110px_minmax(0,1fr)] items-center border-b border-line py-4">
          <CalendarClock class="text-blue-500" :size="20" />
          <dt class="font-semibold text-muted">创建时间</dt>
          <dd class="font-semibold text-ink">{{ project.createdAt }}</dd>
        </div>
        <div class="grid grid-cols-[30px_110px_minmax(0,1fr)] items-start py-4">
          <Pencil class="mt-0.5 text-blue-500" :size="20" />
          <dt class="font-semibold text-muted">别名</dt>
          <dd class="font-semibold leading-6 text-ink">{{ project.alias || project.remark || '-' }}</dd>
        </div>
      </dl>

      <div class="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-4">
        <a
          :href="externalUrl(project.productionEnvironment || project.websiteUrl)"
          target="_blank"
          rel="noopener noreferrer"
          class="flex h-11 items-center justify-center gap-2 rounded-xl border border-line bg-white/80 text-sm font-semibold text-ink shadow-sm transition hover:border-blue-200 hover:text-blue-600"
        >
          <ExternalLink :size="18" />
          访问生产
        </a>
        <a
          :href="externalUrl(project.gitlabUrl || project.repositoryUrl)"
          target="_blank"
          rel="noopener noreferrer"
          class="flex h-11 items-center justify-center gap-2 rounded-xl border border-line bg-white/80 text-sm font-semibold text-ink shadow-sm transition hover:border-blue-200 hover:text-blue-600"
        >
          <Github :size="18" />
          打开GitLab
        </a>
        <button
          type="button"
          class="flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5"
          @click="emit('edit', project)"
        >
          <Pencil :size="18" />
          编辑项目
        </button>
        <button
          type="button"
          class="flex h-11 items-center justify-center gap-2 rounded-xl border border-rose-100 bg-rose-50 text-sm font-semibold text-rose-600 shadow-sm transition hover:border-rose-200 hover:bg-rose-100"
          @click="emit('delete', project)"
        >
          <Trash2 :size="18" />
          删除项目
        </button>
      </div>
    </div>
  </aside>
</template>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(4px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
