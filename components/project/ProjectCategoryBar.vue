<script setup lang="ts">
import { Grid2X2 } from 'lucide-vue-next'
import { categoryOptions } from '~/utils/projectMetrics'
import type { ProjectType } from '~/types/project'

defineProps<{
  active: '全部项目' | ProjectType
}>()

const emit = defineEmits<{
  'update:active': [value: '全部项目' | ProjectType]
}>()
</script>

<template>
  <nav class="no-scrollbar relative z-20 flex w-full gap-2 overflow-x-auto py-1" aria-label="项目分类">
    <button
      v-for="item in categoryOptions"
      :key="item"
      type="button"
      :aria-pressed="active === item"
      :class="[
        'group flex h-12 shrink-0 cursor-pointer items-center gap-2 rounded-[14px] border px-5 text-sm font-semibold transition active:scale-[0.98]',
        active === item
          ? 'border-blue-400 bg-white text-blue-600 shadow-[0_10px_24px_rgba(59,130,246,0.13)]'
          : 'border-line bg-white/75 text-ink hover:border-blue-200 hover:text-blue-600'
      ]"
      @click.stop="emit('update:active', item)"
    >
      <Grid2X2 v-if="item === '全部项目'" :size="17" />
      <span>{{ item }}</span>
    </button>
  </nav>
</template>
