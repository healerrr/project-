<script setup lang="ts">
import { Activity, AlertTriangle, CircleDot, WifiOff } from 'lucide-vue-next'
import type { ProjectFilters, ProjectStats } from '~/types/project'

const props = defineProps<{
  stats: ProjectStats
  activeStatus: ProjectFilters['status']
}>()

const emit = defineEmits<{
  'filter-status': [status: ProjectFilters['status']]
}>()

const statCards = computed(() => [
  {
    label: '全部项目',
    status: '全部状态' as const,
    value: props.stats.total,
    icon: CircleDot,
    dot: 'bg-blue-500',
    line: 'text-sky-400'
  },
  {
    label: '在线运行',
    status: 'online' as const,
    value: props.stats.online,
    icon: Activity,
    dot: 'bg-emerald-400',
    line: 'text-emerald-400'
  },
  {
    label: '离线项目',
    status: 'offline' as const,
    value: props.stats.offline,
    icon: WifiOff,
    dot: 'bg-violet-500',
    line: 'text-violet-400'
  },
  {
    label: '预警项目',
    status: 'warning' as const,
    value: props.stats.warning,
    icon: AlertTriangle,
    dot: 'bg-amber-400',
    line: 'text-amber-400'
  }
])
</script>

<template>
  <section class="grid w-full grid-cols-2 gap-3 xl:w-auto xl:min-w-[575px] xl:grid-cols-4">
    <button
      v-for="card in statCards"
      :key="card.label"
      type="button"
      :aria-pressed="activeStatus === card.status"
      :class="[
        'soft-card relative flex h-20 cursor-pointer items-center justify-between rounded-[14px] px-4 text-left transition active:scale-[0.98]',
        activeStatus === card.status && card.status === '全部状态' ? '!border-blue-500 !bg-blue-50 ring-4 ring-blue-200 shadow-[0_14px_28px_rgba(59,130,246,0.22)]' : '',
        activeStatus === card.status && card.status === 'online' ? '!border-emerald-500 !bg-emerald-50 ring-4 ring-emerald-200 shadow-[0_14px_28px_rgba(16,185,129,0.22)]' : '',
        activeStatus === card.status && card.status === 'offline' ? '!border-violet-500 !bg-violet-50 ring-4 ring-violet-200 shadow-[0_14px_28px_rgba(139,92,246,0.22)]' : '',
        activeStatus === card.status && card.status === 'warning' ? '!border-amber-500 !bg-amber-50 ring-4 ring-amber-200 shadow-[0_14px_28px_rgba(245,158,11,0.22)]' : '',
        activeStatus !== card.status ? 'hover:border-blue-200 hover:shadow-panel' : ''
      ]"
      @click="emit('filter-status', card.status)"
    >
      <div>
        <div class="mb-2 flex items-center gap-2 text-xs font-semibold text-muted">
          <span :class="['h-2.5 w-2.5 rounded-full', card.dot]" />
          {{ card.label }}
        </div>
        <div class="text-[28px] font-semibold leading-none text-ink">{{ card.value }}</div>
      </div>
      <component :is="card.icon" :class="card.line" :size="34" :stroke-width="1.8" />
    </button>
  </section>
</template>
