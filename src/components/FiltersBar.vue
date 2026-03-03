<template>
  <div class="surface-card p-4 sm:p-5">
    <div class="flex flex-col gap-3">
      <input
        v-model.trim="keywordProxy"
        type="text"
        class="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 transition duration-200 placeholder:text-slate-400 hover:border-blue-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        placeholder="搜索标题或描述"
      />

      <div class="-mx-1 overflow-x-auto px-1 pb-1">
        <div class="grid min-w-[34rem] grid-cols-2 gap-2.5 sm:min-w-0 sm:grid-cols-4">
          <select
            v-model="statusProxy"
            class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 transition duration-200 hover:border-blue-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="all">全部状态</option>
            <option value="active">进行中</option>
            <option value="completed">已完成</option>
          </select>
          <select
            v-model="priorityProxy"
            class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 transition duration-200 hover:border-blue-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="all">优先级</option>
            <option value="high">高</option>
            <option value="medium">中</option>
            <option value="low">低</option>
          </select>
          <select
            v-model="categoryProxy"
            class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 transition duration-200 hover:border-blue-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="all">全部分类</option>
            <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
          </select>
          <select
            v-model="sortByProxy"
            class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 transition duration-200 hover:border-blue-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="createdAt">创建时间</option>
            <option value="dueDate">截止日期</option>
            <option value="priority">优先级</option>
          </select>
        </div>
      </div>
    </div>

    <div class="mt-4 flex items-center justify-between gap-3 border-t border-slate-200 pt-3">
      <span class="text-xs font-medium text-slate-400">筛选条件可组合使用</span>
      <button
        type="button"
        class="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 transition duration-200 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
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
  get: (): FiltersState['status'] =>
    props.status === 'active' || props.status === 'completed' ? props.status : 'all',
  set: (v: FiltersState['status']) => emit('update:status', v),
})
const priorityProxy = computed({
  get: (): FiltersState['priority'] =>
    props.priority === 'high' || props.priority === 'medium' || props.priority === 'low'
      ? props.priority
      : 'all',
  set: (v: FiltersState['priority']) => emit('update:priority', v),
})
const categoryProxy = computed({
  get: (): FiltersState['category'] =>
    props.category === 'all' || props.categories.includes(props.category) ? props.category : 'all',
  set: (v: FiltersState['category']) => emit('update:category', v),
})
const sortByProxy = computed({
  get: (): FiltersState['sortBy'] =>
    props.sortBy === 'dueDate' || props.sortBy === 'priority' ? props.sortBy : 'createdAt',
  set: (v: FiltersState['sortBy']) => emit('update:sortBy', v),
})
</script>
