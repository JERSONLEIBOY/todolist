<template>
  <div class="rounded-2xl bg-white p-6 shadow-card space-y-4">
    <div class="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
      <input
        v-model.trim="keywordProxy"
        type="text"
        class="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        placeholder="搜索标题或描述"
      />
      <div class="grid grid-cols-2 gap-3 md:grid-cols-4">
        <select
          v-model="statusProxy"
          class="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option value="all">全部</option>
          <option value="active">进行中</option>
          <option value="completed">已完成</option>
        </select>
        <select
          v-model="priorityProxy"
          class="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option value="all">优先级</option>
          <option value="high">高</option>
          <option value="medium">中</option>
          <option value="low">低</option>
        </select>
        <select
          v-model="categoryProxy"
          class="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option value="all">全部分类</option>
          <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
        </select>
        <select
          v-model="sortByProxy"
          class="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option value="createdAt">创建时间</option>
          <option value="dueDate">截止日期</option>
          <option value="priority">优先级</option>
        </select>
      </div>
    </div>
    <div class="flex justify-end">
      <button
        type="button"
        class="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
        @click="$emit('reset')"
      >
        重置筛选
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { FiltersState } from '@/composables/useFilters'

const props = defineProps<{
  categories: string[]
  keyword: string
  status: FiltersState['status']
  priority: FiltersState['priority']
  category: FiltersState['category']
  sortBy: FiltersState['sortBy']
}>()

const emit = defineEmits<{
  (e: 'update:keyword', v: string): void
  (e: 'update:status', v: FiltersState['status']): void
  (e: 'update:priority', v: FiltersState['priority']): void
  (e: 'update:category', v: FiltersState['category']): void
  (e: 'update:sortBy', v: FiltersState['sortBy']): void
  (e: 'reset'): void
}>()

const keywordProxy = computed({
  get: () => props.keyword,
  set: (v: string) => emit('update:keyword', v),
})
const statusProxy = computed({
  get: () => props.status,
  set: (v: FiltersState['status']) => emit('update:status', v),
})
const priorityProxy = computed({
  get: () => props.priority,
  set: (v: FiltersState['priority']) => emit('update:priority', v),
})
const categoryProxy = computed({
  get: () => props.category,
  set: (v: FiltersState['category']) => emit('update:category', v),
})
const sortByProxy = computed({
  get: () => props.sortBy,
  set: (v: FiltersState['sortBy']) => emit('update:sortBy', v),
})
</script>
