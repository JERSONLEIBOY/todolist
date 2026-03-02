<template>
  <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
    <div class="rounded-xl bg-white p-4 shadow-card">
      <div class="text-sm text-slate-500">总任务</div>
      <div class="mt-1 text-2xl font-semibold text-slate-900">{{ stats.total }}</div>
    </div>
    <div class="rounded-xl bg-white p-4 shadow-card">
      <div class="text-sm text-slate-500">进行中</div>
      <div class="mt-1 text-2xl font-semibold text-amber-500">{{ stats.active }}</div>
    </div>
    <div class="rounded-xl bg-white p-4 shadow-card">
      <div class="text-sm text-slate-500">已完成</div>
      <div class="mt-1 text-2xl font-semibold text-emerald-500">{{ stats.completed }}</div>
    </div>
    <div class="rounded-xl bg-white p-4 shadow-card">
      <div class="text-sm text-slate-500">完成率</div>
      <div class="mt-1 text-2xl font-semibold text-primary">{{ stats.completionRate }}%</div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Stats {
  total: number
  completed: number
  active: number
  completionRate: number
}

const props = defineProps<{ stats: Stats }>()
</script>
