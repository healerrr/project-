<script setup lang="ts">
import { SearchX } from 'lucide-vue-next'
import type { Project } from '~/types/project'

defineProps<{
  projects: Project[]
  selectedId: string
  compact: boolean
  expanded: boolean
}>()

const emit = defineEmits<{
  select: [project: Project]
}>()
</script>

<template>
  <section>
    <div
      v-if="projects.length > 0"
      :class="[
        'grid grid-cols-1 gap-4 md:grid-cols-2',
        expanded ? '2xl:grid-cols-4' : '2xl:grid-cols-3'
      ]"
    >
      <ProjectCard
        v-for="project in projects"
        :key="project.id"
        :project="project"
        :selected="project.id === selectedId"
        :compact="compact"
        @select="emit('select', $event)"
      />
    </div>

    <div v-else class="soft-card grid min-h-[360px] place-items-center rounded-[22px] p-10 text-center">
      <div>
        <SearchX class="mx-auto mb-4 text-blue-400" :size="48" />
        <h3 class="mb-2 text-lg font-bold text-ink">没有找到匹配项目</h3>
        <p class="text-sm font-medium text-muted">调整搜索关键词或筛选条件后再试。</p>
      </div>
    </div>
  </section>
</template>
