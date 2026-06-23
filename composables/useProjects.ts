import type { Project, ProjectFormInput } from '~/types/project'

export function useProjects() {
  const projects = useState<Project[]>('project-hub:projects', () => [])
  const isLoaded = useState('project-hub:is-loaded', () => false)
  const isLoading = useState('project-hub:is-loading', () => false)
  const errorMessage = useState('project-hub:error-message', () => '')

  const loadProjects = async () => {
    isLoading.value = true
    errorMessage.value = ''

    try {
      projects.value = await $fetch<Project[]>('/api/projects')
      isLoaded.value = true
    } catch (error) {
      errorMessage.value = error instanceof Error ? error.message : '项目数据加载失败'
    } finally {
      isLoading.value = false
    }
  }

  const ensureProjects = async () => {
    if (isLoaded.value) return
    await loadProjects()
  }

  const addProject = async (input: ProjectFormInput) => {
    errorMessage.value = ''
    const project = await $fetch<Project>('/api/projects', {
      method: 'POST',
      body: input
    })

    projects.value = [project, ...projects.value]
    return project
  }

  const updateProject = async (id: string, input: ProjectFormInput) => {
    errorMessage.value = ''
    const existing = projects.value.find((project) => project.id === id)
    const project = await $fetch<Project>(`/api/projects/${id}`, {
      method: 'PUT',
      body: {
        ...input,
        runtimeId: existing?.runtimeId
      }
    })

    projects.value = projects.value.map((item) => (item.id === id ? project : item))
    return project
  }

  const deleteProject = async (id: string) => {
    errorMessage.value = ''
    await $fetch(`/api/projects/${id}`, {
      method: 'DELETE'
    })
    projects.value = projects.value.filter((project) => project.id !== id)
  }

  const refreshProjectStatuses = async () => {
    errorMessage.value = ''
    await $fetch('/api/projects/refresh-status', {
      method: 'POST'
    })
    await loadProjects()
  }

  return {
    projects,
    isLoaded,
    isLoading,
    errorMessage,
    loadProjects,
    ensureProjects,
    addProject,
    updateProject,
    deleteProject,
    refreshProjectStatuses
  }
}
