<script setup lang="ts">
import { X } from 'lucide-vue-next'
import type { Project, ProjectFormInput } from '~/types/project'
import { environmentOptions, statusOptions, statusText, typeOptions } from '~/utils/projectMetrics'

const props = defineProps<{
  open: boolean
  project: Project | null
}>()

const emit = defineEmits<{
  close: []
  submit: [payload: ProjectFormInput]
}>()

const defaultForm = (): ProjectFormInput => ({
  name: '',
  alias: '',
  gitlabUrl: '',
  testEnvironment: '',
  testAccount: '',
  testPassword: '',
  productionEnvironment: '',
  testServer: '',
  developer: '',
  type: '官网',
  environment: '生产环境',
  status: 'online',
  responseTime: 120,
  repositoryUrl: '',
  serverHost: '',
  serverOs: 'Ubuntu 22.04',
  startMethod: 'Nginx + PM2',
  remark: '',
  websiteUrl: '',
  icon: 'globe',
  accent: 'blue'
})

const form = reactive<ProjectFormInput>(defaultForm())
const errors = ref<Record<string, string>>({})

const isEditing = computed(() => Boolean(props.project))

const iconOptions: ProjectFormInput['icon'][] = ['globe', 'monitor', 'api', 'mini', 'wechat', 'chart', 'tool', 'shop', 'lab']
const accentOptions: ProjectFormInput['accent'][] = ['blue', 'violet', 'green', 'mint', 'sky', 'orange', 'rose', 'slate']
const formTypeOptions = typeOptions.filter((option) => option !== '全部类型') as ProjectFormInput['type'][]
const formStatusOptions = statusOptions.filter((option) => option !== '全部状态') as ProjectFormInput['status'][]

function assignForm(project: Project | null) {
  const next = project
    ? {
        name: project.name,
        alias: project.alias,
        gitlabUrl: project.gitlabUrl,
        testEnvironment: project.testEnvironment,
        testAccount: project.testAccount,
        testPassword: project.testPassword,
        productionEnvironment: project.productionEnvironment,
        testServer: project.testServer,
        developer: project.developer,
        type: project.type,
        environment: project.environment,
        status: project.status,
        responseTime: project.responseTime,
        repositoryUrl: project.repositoryUrl,
        serverHost: project.serverHost,
        serverOs: project.serverOs,
        startMethod: project.startMethod,
        remark: project.remark,
        websiteUrl: project.websiteUrl,
        icon: project.icon,
        accent: project.accent
      }
    : defaultForm()

  Object.assign(form, next)
  errors.value = {}
}

function validate() {
  const nextErrors: Record<string, string> = {}

  if (!form.name.trim()) nextErrors.name = '请输入项目名称'
  if (!form.gitlabUrl.trim() && !form.repositoryUrl.trim()) nextErrors.repositoryUrl = '请输入GitLab地址'
  if (!form.startMethod.trim()) nextErrors.startMethod = '请输入启动方式'
  if (!form.remark.trim() && !form.alias.trim()) nextErrors.remark = '请输入别名或备注'
  if (form.responseTime !== null && form.responseTime < 0) nextErrors.responseTime = '响应时间不能为负数'

  errors.value = nextErrors
  return Object.keys(nextErrors).length === 0
}

function submitForm() {
  if (!validate()) return
  emit('submit', {
    ...form,
    repositoryUrl: form.repositoryUrl || form.gitlabUrl,
    websiteUrl: form.productionEnvironment,
    serverHost: form.serverHost || form.testServer,
    remark: form.remark || form.alias
  })
}

watch(
  () => [props.open, props.project?.id],
  () => {
    if (props.open) assignForm(props.project)
  },
  { immediate: true }
)
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="open" class="fixed inset-0 z-50 grid place-items-center bg-ink/25 p-5">
        <form class="no-scrollbar max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-[22px] border border-line bg-white p-6 shadow-panel" @submit.prevent="submitForm">
          <div class="mb-6 flex items-center justify-between">
            <div>
              <h2 class="text-xl font-bold text-ink">{{ isEditing ? '编辑项目' : '新建项目' }}</h2>
              <p class="mt-1 text-sm font-medium text-muted">维护项目基础信息和默认运行环境，保存后会写入 SQLite 数据库。</p>
            </div>
            <button type="button" class="grid h-10 w-10 place-items-center rounded-full hover:bg-blue-50" title="关闭" @click="emit('close')">
              <X :size="22" />
            </button>
          </div>

          <div class="grid gap-4 md:grid-cols-2">
            <label class="block">
              <span class="mb-2 block text-sm font-semibold text-ink">项目名称</span>
              <input v-model="form.name" class="h-11 w-full rounded-xl border border-line px-4 text-sm font-medium text-ink" placeholder="例如：星云官网">
              <span v-if="errors.name" class="mt-1 block text-xs font-semibold text-rose-500">{{ errors.name }}</span>
            </label>

            <label class="block">
              <span class="mb-2 block text-sm font-semibold text-ink">别名</span>
              <input v-model="form.alias" class="h-11 w-full rounded-xl border border-line px-4 text-sm font-medium text-ink" placeholder="例如：美国erp">
            </label>

            <label class="block">
              <span class="mb-2 block text-sm font-semibold text-ink">GitLab地址</span>
              <input v-model="form.gitlabUrl" class="h-11 w-full rounded-xl border border-line px-4 text-sm font-medium text-ink" placeholder="http://git.example.com/group/project.git">
              <span v-if="errors.repositoryUrl" class="mt-1 block text-xs font-semibold text-rose-500">{{ errors.repositoryUrl }}</span>
            </label>

            <label class="block">
              <span class="mb-2 block text-sm font-semibold text-ink">开发</span>
              <input v-model="form.developer" class="h-11 w-full rounded-xl border border-line px-4 text-sm font-medium text-ink" placeholder="负责人或团队">
            </label>

            <label class="block">
              <span class="mb-2 block text-sm font-semibold text-ink">项目类型</span>
              <select v-model="form.type" class="h-11 w-full rounded-xl border border-line px-4 text-sm font-medium text-ink">
                <option v-for="item in formTypeOptions" :key="item" :value="item">{{ item }}</option>
              </select>
            </label>

            <label class="block">
              <span class="mb-2 block text-sm font-semibold text-ink">所属环境</span>
              <select v-model="form.environment" class="h-11 w-full rounded-xl border border-line px-4 text-sm font-medium text-ink">
                <option v-for="item in environmentOptions.filter((option) => option !== '全部环境')" :key="item" :value="item">{{ item }}</option>
              </select>
            </label>

            <label class="block">
              <span class="mb-2 block text-sm font-semibold text-ink">状态</span>
              <select v-model="form.status" class="h-11 w-full rounded-xl border border-line px-4 text-sm font-medium text-ink">
                <option v-for="item in formStatusOptions" :key="item" :value="item">
                  {{ statusText[item] }}
                </option>
              </select>
            </label>

            <label class="block">
              <span class="mb-2 block text-sm font-semibold text-ink">响应时间</span>
              <input
                :value="form.responseTime ?? ''"
                class="h-11 w-full rounded-xl border border-line px-4 text-sm font-medium text-ink"
                min="0"
                placeholder="128"
                type="number"
                @input="form.responseTime = ($event.target as HTMLInputElement).value === '' ? null : Number(($event.target as HTMLInputElement).value)"
              >
              <span v-if="errors.responseTime" class="mt-1 block text-xs font-semibold text-rose-500">{{ errors.responseTime }}</span>
            </label>

            <label class="block">
              <span class="mb-2 block text-sm font-semibold text-ink">测试服务器</span>
              <input v-model="form.testServer" class="h-11 w-full rounded-xl border border-line px-4 text-sm font-medium text-ink" placeholder="192.168.10.109(N2）">
            </label>

            <label class="block">
              <span class="mb-2 block text-sm font-semibold text-ink">测试环境</span>
              <input v-model="form.testEnvironment" class="h-11 w-full rounded-xl border border-line px-4 text-sm font-medium text-ink" placeholder="http://spider.example.com:3000">
            </label>

            <label class="block">
              <span class="mb-2 block text-sm font-semibold text-ink">测试账号</span>
              <input v-model="form.testAccount" class="h-11 w-full rounded-xl border border-line px-4 text-sm font-medium text-ink" placeholder="测试账号">
            </label>

            <label class="block">
              <span class="mb-2 block text-sm font-semibold text-ink">测试密码</span>
              <input v-model="form.testPassword" class="h-11 w-full rounded-xl border border-line px-4 text-sm font-medium text-ink" placeholder="测试密码">
            </label>

            <label class="block">
              <span class="mb-2 block text-sm font-semibold text-ink">生产环境</span>
              <input v-model="form.productionEnvironment" class="h-11 w-full rounded-xl border border-line px-4 text-sm font-medium text-ink" placeholder="https://www.example.com">
            </label>

            <label class="block">
              <span class="mb-2 block text-sm font-semibold text-ink">图标</span>
              <select v-model="form.icon" class="h-11 w-full rounded-xl border border-line px-4 text-sm font-medium text-ink">
                <option v-for="item in iconOptions" :key="item" :value="item">{{ item }}</option>
              </select>
            </label>

            <label class="block">
              <span class="mb-2 block text-sm font-semibold text-ink">强调色</span>
              <select v-model="form.accent" class="h-11 w-full rounded-xl border border-line px-4 text-sm font-medium text-ink">
                <option v-for="item in accentOptions" :key="item" :value="item">{{ item }}</option>
              </select>
            </label>
          </div>

          <label class="mt-4 block">
            <span class="mb-2 block text-sm font-semibold text-ink">备注</span>
            <textarea v-model="form.remark" class="min-h-24 w-full rounded-xl border border-line px-4 py-3 text-sm font-medium text-ink" placeholder="项目用途、维护说明或风险备注" />
            <span v-if="errors.remark" class="mt-1 block text-xs font-semibold text-rose-500">{{ errors.remark }}</span>
          </label>

          <div class="mt-6 flex justify-end gap-3">
            <button type="button" class="h-11 rounded-xl border border-line px-5 text-sm font-semibold text-ink hover:bg-blue-50" @click="emit('close')">
              取消
            </button>
            <button type="submit" class="h-11 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-6 text-sm font-semibold text-white shadow-lg shadow-blue-200">
              {{ isEditing ? '保存修改' : '创建项目' }}
            </button>
          </div>
        </form>
      </div>
    </Transition>
  </Teleport>
</template>
