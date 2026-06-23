<script setup lang="ts">
import { ChevronDown, Plus, RefreshCw, Search } from 'lucide-vue-next'
import { statusOptions, statusText, typeOptions } from '~/utils/projectMetrics'
import type { ProjectStatus, ProjectType } from '~/types/project'

type StatusFilter = '全部状态' | ProjectStatus
type TypeFilter = '全部类型' | ProjectType
type OpenFilter = 'status' | 'type' | null

defineProps<{
  search: string
  status: StatusFilter
  type: TypeFilter
  refreshing: boolean
}>()

const emit = defineEmits<{
  'update:search': [value: string]
  'update:status': [value: StatusFilter]
  'update:type': [value: TypeFilter]
  refresh: []
  create: []
}>()

const openFilter = ref<OpenFilter>(null)

function toggleFilter(filter: Exclude<OpenFilter, null>) {
  openFilter.value = openFilter.value === filter ? null : filter
}

function closeFilter() {
  openFilter.value = null
}

function selectStatus(value: StatusFilter) {
  emit('update:status', value)
  openFilter.value = null
}

function selectType(value: TypeFilter) {
  emit('update:type', value)
  openFilter.value = null
}

function statusLabel(value: StatusFilter) {
  return value === '全部状态' ? value : statusText[value]
}

onMounted(() => {
  document.addEventListener('click', closeFilter)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', closeFilter)
})
</script>

<template>
  <header class="surface relative z-10 flex min-h-[76px] flex-wrap items-center gap-3 rounded-[22px] px-4 py-3 sm:gap-4 sm:px-6 lg:flex-nowrap lg:gap-5 lg:py-2">
    <div class="flex min-w-0 flex-1 items-center gap-2 sm:min-w-[250px] sm:gap-4 lg:flex-none">
      <img
        src="/it-project-logo.png"
        alt="IT项目管理"
        class="h-11 w-11 shrink-0 rounded-[16px] object-cover shadow-lg shadow-blue-200 sm:h-[52px] sm:w-[52px] sm:rounded-[18px]"
      >
      <div>
        <div class="whitespace-nowrap text-[18px] font-bold leading-none tracking-normal text-ink sm:text-[24px]">IT项目管理</div>
      </div>
    </div>

    <div class="hidden h-10 w-px bg-line lg:block" />

    <label class="relative order-3 w-full lg:order-none lg:min-w-[300px] lg:flex-1">
      <Search class="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" :size="21" />
      <input
        :value="search"
        class="h-11 w-full rounded-[14px] border border-line bg-white/92 px-5 pr-12 text-sm font-medium text-ink shadow-inner shadow-blue-50 placeholder:text-slate-400"
        placeholder="搜索项目、别名、GitLab、测试服务器..."
        type="search"
        @input="emit('update:search', ($event.target as HTMLInputElement).value)"
      >
    </label>

    <div class="order-4 grid w-full grid-cols-1 gap-2 sm:grid-cols-2 lg:order-none lg:flex lg:w-auto lg:items-center lg:gap-3">
      <div class="relative">
        <button
          type="button"
          class="flex h-11 w-full cursor-pointer items-center justify-between gap-3 rounded-[14px] border border-line bg-white/88 px-4 text-sm font-semibold text-ink shadow-sm transition hover:border-blue-200 hover:text-blue-600 lg:w-[122px]"
          :aria-expanded="openFilter === 'type'"
          @click.stop="toggleFilter('type')"
        >
          <span class="truncate">{{ type }}</span>
          <ChevronDown :class="['shrink-0 text-slate-500 transition', openFilter === 'type' ? 'rotate-180' : '']" :size="16" />
        </button>
        <div v-if="openFilter === 'type'" class="absolute left-0 top-[calc(100%+8px)] z-50 w-full min-w-[160px] rounded-[14px] border border-line bg-white p-1.5 shadow-panel">
          <button
            v-for="item in typeOptions"
            :key="item"
            type="button"
            :class="['block h-9 w-full rounded-[10px] px-3 text-left text-sm font-semibold transition', type === item ? 'bg-blue-50 text-blue-600' : 'text-ink hover:bg-blue-50 hover:text-blue-600']"
            @click.stop="selectType(item)"
          >
            {{ item }}
          </button>
        </div>
      </div>

      <div class="relative">
        <button
          type="button"
          class="flex h-11 w-full cursor-pointer items-center justify-between gap-3 rounded-[14px] border border-line bg-white/88 px-4 text-sm font-semibold text-ink shadow-sm transition hover:border-blue-200 hover:text-blue-600 lg:w-[122px]"
          :aria-expanded="openFilter === 'status'"
          @click.stop="toggleFilter('status')"
        >
          <span class="truncate">{{ statusLabel(status) }}</span>
          <ChevronDown :class="['shrink-0 text-slate-500 transition', openFilter === 'status' ? 'rotate-180' : '']" :size="16" />
        </button>
        <div v-if="openFilter === 'status'" class="absolute left-0 top-[calc(100%+8px)] z-50 w-full min-w-[150px] rounded-[14px] border border-line bg-white p-1.5 shadow-panel">
          <button
            v-for="item in statusOptions"
            :key="item"
            type="button"
            :class="['block h-9 w-full rounded-[10px] px-3 text-left text-sm font-semibold transition', status === item ? 'bg-blue-50 text-blue-600' : 'text-ink hover:bg-blue-50 hover:text-blue-600']"
            @click.stop="selectStatus(item)"
          >
            {{ statusLabel(item) }}
          </button>
        </div>
      </div>
    </div>

    <div class="ml-auto flex items-center gap-2 sm:gap-3">
      <button
        type="button"
        class="grid h-11 w-11 place-items-center rounded-[14px] border border-line bg-white/90 text-sm font-semibold text-ink shadow-sm transition hover:border-blue-200 hover:text-blue-600 sm:flex sm:w-auto sm:gap-2 sm:px-4"
        title="刷新项目状态"
        @click="emit('refresh')"
      >
        <RefreshCw :class="{ 'animate-spin': refreshing }" :size="19" />
        <span class="hidden sm:inline">刷新</span>
      </button>
      <button
        type="button"
        class="flex h-11 items-center gap-2 rounded-[14px] bg-gradient-to-r from-sky-500 to-blue-600 px-4 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:translate-y-[-1px] sm:px-5"
        @click="emit('create')"
      >
        <Plus :size="20" />
        <span class="hidden sm:inline">新建项目</span>
      </button>
    </div>
  </header>
</template>
