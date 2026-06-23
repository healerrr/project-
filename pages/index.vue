<script setup lang="ts">
import type { Project, ProjectFilters, ProjectFormInput } from '~/types/project'
import { calculateProjectStats, categoryOptions, filterProjects, sortProjectsByType, typeOptions } from '~/utils/projectMetrics'

const { projects, isLoading, errorMessage, ensureProjects, addProject, updateProject, deleteProject, refreshProjectStatuses } = useProjects()

await ensureProjects()

const search = ref('')
const category = ref<ProjectFilters['category']>('全部项目')
const environment = ref<ProjectFilters['environment']>('全部环境')
const status = ref<ProjectFilters['status']>('全部状态')
const type = ref<ProjectFilters['type']>('全部类型')
const selectedProjectId = ref('')
const editingProject = ref<Project | null>(null)
const dialogOpen = ref(false)
const drawerOpen = ref(false)
const refreshing = ref(false)

const filters = computed<ProjectFilters>(() => ({
  search: search.value,
  category: category.value,
  environment: environment.value,
  status: status.value,
  type: type.value
}))

const filteredProjects = computed(() => sortProjectsByType(filterProjects(projects.value, filters.value)))
const stats = computed(() => calculateProjectStats(projects.value))

const selectedProject = computed(() => projects.value.find((project) => project.id === selectedProjectId.value) ?? null)

function selectProject(project: Project) {
  selectedProjectId.value = project.id
  drawerOpen.value = true
}

function updateCategory(nextCategory: ProjectFilters['category']) {
  category.value = nextCategory
  type.value = nextCategory === '全部项目' ? '全部类型' : nextCategory
}

function updateType(nextType: ProjectFilters['type']) {
  type.value = nextType
  category.value = nextType === '全部类型' ? '全部项目' : nextType
}

function isCategoryFilter(value: string): value is ProjectFilters['category'] {
  return (categoryOptions as readonly string[]).includes(value)
}

function isTypeFilter(value: string): value is ProjectFilters['type'] {
  return (typeOptions as readonly string[]).includes(value)
}

watchEffect(() => {
  if (!isCategoryFilter(category.value)) {
    category.value = '全部项目'
  }

  if (!isTypeFilter(type.value)) {
    type.value = '全部类型'
  }
})

function openCreateDialog() {
  editingProject.value = null
  dialogOpen.value = true
}

function openEditDialog(project: Project) {
  editingProject.value = project
  dialogOpen.value = true
}

function closeDialog() {
  dialogOpen.value = false
  editingProject.value = null
}

async function submitProject(input: ProjectFormInput) {
  if (editingProject.value) {
    const project = await updateProject(editingProject.value.id, input)
    selectedProjectId.value = project.id
  } else {
    const project = await addProject(input)
    selectedProjectId.value = project.id
  }
  closeDialog()
}

async function refreshProjects() {
  refreshing.value = true
  try {
    await Promise.all([
      refreshProjectStatuses(),
      new Promise((resolve) => window.setTimeout(resolve, 700))
    ])
  } finally {
    refreshing.value = false
  }
}

async function removeProject(project: Project) {
  const confirmed = window.confirm(`确认删除“${project.name}”吗？此操作会同时删除运行环境。`)

  if (!confirmed) return

  await deleteProject(project.id)
  if (selectedProjectId.value === project.id) {
    selectedProjectId.value = ''
    drawerOpen.value = false
  }
}

watch(filteredProjects, (next) => {
  if (!next.some((project) => project.id === selectedProjectId.value)) {
    selectedProjectId.value = ''
    drawerOpen.value = false
  }
})
</script>

<template>
  <main class="app-shell px-3 py-3 sm:px-5 sm:py-5">
    <div class="relative z-10 mx-auto max-w-[1810px]">
      <ProjectHeader
        v-model:search="search"
        :status="status"
        :type="type"
        :refreshing="refreshing"
        @update:status="status = $event"
        @update:type="updateType"
        @refresh="refreshProjects"
        @create="openCreateDialog"
      />

      <section class="mt-3 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <ProjectCategoryBar :active="category" @update:active="updateCategory" />
        <ProjectStats :stats="stats" :active-status="status" @filter-status="status = $event" />
      </section>

      <section
        :class="[
          'mt-4 grid gap-5',
          selectedProject && drawerOpen ? 'xl:grid-cols-[minmax(0,1fr)_520px]' : 'xl:grid-cols-1'
        ]"
      >
        <ProjectGrid
          :projects="filteredProjects"
          :selected-id="selectedProject?.id ?? ''"
          :compact="false"
          :expanded="!(selectedProject && drawerOpen)"
          @select="selectProject"
        />

        <div v-if="isLoading" class="soft-card rounded-[18px] px-5 py-4 text-sm font-semibold text-blue-600 xl:col-span-full">
          正在加载项目数据...
        </div>
        <div v-else-if="errorMessage" class="soft-card rounded-[18px] px-5 py-4 text-sm font-semibold text-rose-600 xl:col-span-full">
          {{ errorMessage }}
        </div>

        <ProjectDetailPanel
          v-if="selectedProject"
          :project="selectedProject"
          :open="drawerOpen"
          @close="drawerOpen = false"
          @edit="openEditDialog"
          @delete="removeProject"
        />
      </section>
    </div>

    <div v-if="drawerOpen" class="fixed inset-0 z-10 bg-ink/20 xl:hidden" @click="drawerOpen = false" />

    <ProjectFormDialog
      :open="dialogOpen"
      :project="editingProject"
      @close="closeDialog"
      @submit="submitProject"
    />
  </main>
</template>
