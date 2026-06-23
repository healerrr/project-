<script setup lang="ts">
import {
  BarChart3,
  Beaker,
  Globe2,
  Grid2X2,
  MessageCircle,
  MonitorUp,
  RadioTower,
  ShoppingBag,
  Wrench
} from 'lucide-vue-next'
import type { Project } from '~/types/project'

const props = defineProps<{
  icon: Project['icon']
  accent: Project['accent']
  size?: 'sm' | 'md' | 'lg'
}>()

const iconMap = {
  globe: Globe2,
  monitor: MonitorUp,
  api: RadioTower,
  mini: Grid2X2,
  wechat: MessageCircle,
  chart: BarChart3,
  tool: Wrench,
  shop: ShoppingBag,
  lab: Beaker
}

const accentClass = computed(() => {
  const classes: Record<Project['accent'], string> = {
    blue: 'from-sky-400 to-blue-600 shadow-blue-200',
    violet: 'from-violet-400 to-indigo-600 shadow-violet-200',
    green: 'from-emerald-300 to-green-600 shadow-emerald-200',
    mint: 'from-teal-300 to-emerald-500 shadow-emerald-200',
    sky: 'from-cyan-300 to-sky-600 shadow-sky-200',
    orange: 'from-amber-300 to-orange-500 shadow-orange-200',
    rose: 'from-rose-300 to-pink-600 shadow-rose-200',
    slate: 'from-slate-400 to-slate-600 shadow-slate-200'
  }
  return classes[props.accent]
})

const sizeClass = computed(() => {
  if (props.size === 'lg') return 'h-16 w-16 rounded-[18px]'
  if (props.size === 'sm') return 'h-10 w-10 rounded-xl'
  return 'h-14 w-14 rounded-2xl'
})

const iconSize = computed(() => (props.size === 'lg' ? 34 : props.size === 'sm' ? 22 : 30))
const IconComponent = computed(() => iconMap[props.icon])
</script>

<template>
  <div :class="['grid shrink-0 place-items-center bg-gradient-to-br text-white shadow-lg', accentClass, sizeClass]">
    <component :is="IconComponent" :size="iconSize" :stroke-width="2.2" />
  </div>
</template>
