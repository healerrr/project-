<script setup lang="ts">
import { FolderGit2, Link2, Server, TerminalSquare } from 'lucide-vue-next'
import type { Project } from '~/types/project'
import { statusText, statusTone } from '~/utils/projectMetrics'

defineProps<{
  project: Project
  selected: boolean
  compact: boolean
}>()

const emit = defineEmits<{
  select: [project: Project]
}>()
</script>

<template>
  <button
    type="button"
    :class="[
      'soft-card group block w-full rounded-[18px] p-5 text-left transition duration-200 hover:-translate-y-1 hover:shadow-panel',
      selected ? 'border-blue-400 shadow-glow' : 'border-line',
      compact ? 'min-h-[188px]' : 'min-h-[226px]'
    ]"
    @click="emit('select', project)"
  >
    <div class="mb-5 flex items-start gap-4">
      <ProjectIcon :icon="project.icon" :accent="project.accent" />
      <div class="min-w-0 flex-1">
        <div class="mb-2 flex items-center justify-between gap-3">
          <h3 class="truncate text-[17px] font-bold leading-6 text-ink">{{ project.name }}</h3>
          <span :class="['shrink-0 text-xs font-semibold', statusTone[project.status]]">{{ statusText[project.status] }}</span>
        </div>
        <p class="mb-2 truncate text-xs font-semibold text-muted">{{ project.alias || '暂无别名' }}</p>
        <div class="flex flex-wrap gap-2">
          <span class="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-600">{{ project.type }}</span>
          <span class="ml-auto text-xs font-semibold text-muted">
            {{ project.developer || '未指定开发' }}
          </span>
        </div>
      </div>
    </div>

    <dl :class="['space-y-3 text-[13px]', compact ? 'space-y-2.5' : 'space-y-3']">
      <div class="grid grid-cols-[22px_78px_minmax(0,1fr)] items-center">
        <Link2 class="text-slate-500" :size="15" />
        <dt class="font-semibold text-muted">GitLab</dt>
        <dd class="truncate font-medium text-ink">{{ project.gitlabUrl || project.repositoryUrl || '-' }}</dd>
      </div>
      <div class="grid grid-cols-[22px_78px_minmax(0,1fr)] items-center">
        <Server class="text-slate-500" :size="15" />
        <dt class="font-semibold text-muted">测试环境</dt>
        <dd class="truncate font-medium text-ink">{{ project.testEnvironment || '-' }}</dd>
      </div>
      <div class="grid grid-cols-[22px_78px_minmax(0,1fr)] items-center">
        <FolderGit2 class="text-slate-500" :size="15" />
        <dt class="font-semibold text-muted">生产环境</dt>
        <dd class="truncate font-medium text-ink">{{ project.productionEnvironment || project.websiteUrl || '-' }}</dd>
      </div>
      <div class="grid grid-cols-[22px_78px_minmax(0,1fr)] items-center">
        <TerminalSquare class="text-slate-500" :size="15" />
        <dt class="font-semibold text-muted">测试服务器</dt>
        <dd class="truncate font-medium text-ink">{{ project.testServer || project.serverHost || '-' }}</dd>
      </div>
    </dl>
  </button>
</template>
