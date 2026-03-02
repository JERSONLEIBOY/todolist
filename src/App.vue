<template>
  <div class="min-h-screen bg-slate-50 text-slate-900">
    <Toast :bus="toastBus" />
    <header class="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-10 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 class="text-3xl font-semibold text-primary">TodoList</h1>
        <p class="mt-2 text-sm text-slate-600">基于 PRD/TECH_DESIGN 的实现骨架</p>
      </div>
      <HeaderStats :stats="stats" />
    </header>

    <main class="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 pb-16 lg:grid-cols-3">
      <section class="space-y-4 lg:col-span-1">
        <TodoForm
          :categories="categories"
          :default-category="categories[0] ?? '工作'"
          @submit="handleCreate"
        />
            <FiltersBar
              :categories="categories"
              :keyword="keyword"
              :status="status"
              :priority="priority"
              :category="category"
              :sort-by="sortBy"
              @update:keyword="(v) => (keyword.value = v.trim().toLowerCase())"
              @update:status="(v) => (status.value = v)"
              @update:priority="(v) => (priority.value = v)"
              @update:category="(v) => (category.value = v)"
              @update:sortBy="(v) => (sortBy.value = v)"
              @reset="handleReset"
            />
      </section>

      <section class="space-y-4 lg:col-span-2">
        <div class="rounded-2xl bg-white p-6 shadow-card">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold text-slate-800">任务列表</h2>
            <span class="text-sm text-slate-500">{{ filteredTodos.length }} 条</span>
          </div>
          <div class="mt-4">
            <TodoList
              :todos="filteredTodos"
              @toggle="handleToggle"
              @edit="handleEdit"
              @delete="confirmDelete"
            />
          </div>
        </div>
      </section>
    </main>

    <ConfirmDialog v-if="confirmingId" @confirm="handleConfirmDelete" @cancel="cancelDelete" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import HeaderStats from '@/components/HeaderStats.vue'
import TodoForm from '@/components/TodoForm.vue'
import FiltersBar from '@/components/FiltersBar.vue'
import TodoList from '@/components/TodoList.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import Toast from '@/components/Toast.vue'
import { useCategories } from '@/composables/useCategories'
import { useTodos } from '@/composables/useTodos'
import { useFilters } from '@/composables/useFilters'
import type { Todo } from '@/types/todo'

const toastBus = new EventTarget()
const toast = (message: string, duration?: number) =>
  toastBus.dispatchEvent(new CustomEvent('toast', { detail: { message, duration } }))

const { categories, options: categoryOptions } = useCategories()
const { todos, create, toggle, update, remove, stats } = useTodos()
const { keyword, status, priority, category, sortBy, reset } = useFilters()

const filteredTodos = computed(() => {
  const kw = keyword.value
  let list = [...todos]
  if (kw) {
    list = list.filter(
      (t) => t.title.toLowerCase().includes(kw) || t.description.toLowerCase().includes(kw)
    )
  }
  if (status.value === 'active') list = list.filter((t) => !t.completed)
  if (status.value === 'completed') list = list.filter((t) => t.completed)
  if (priority.value !== 'all') list = list.filter((t) => t.priority === priority.value)
  if (category.value !== 'all') list = list.filter((t) => t.category === category.value)

  list.sort((a, b) => {
    if (sortBy.value === 'priority') {
  const order: Record<Todo['priority'], number> = { high: 0, medium: 1, low: 2 }
      return order[a.priority]! - order[b.priority]!
    }
    if (sortBy.value === 'dueDate') {
      const ad = a.dueDate ?? '9999-12-31'
      const bd = b.dueDate ?? '9999-12-31'
      return ad.localeCompare(bd)
    }
    // createdAt desc
    return b.createdAt.localeCompare(a.createdAt)
  })

  return list
})

const confirmingId = ref<string | null>(null)

function handleCreate(payload: {
  title: string
  description: string
  priority: Todo['priority']
  category: string
  dueDate: string | null
}) {
  create(payload)
  toast('创建成功')
}

function handleToggle(id: string, completed: boolean) {
  toggle(id, completed)
  toast(completed ? '已完成' : '标记进行中')
}

function handleEdit(todo: Todo) {
  update(todo.id, todo)
  toast('已保存修改')
}

function confirmDelete(id: string) {
  confirmingId.value = id
}

function handleConfirmDelete() {
  if (!confirmingId.value) return
  remove(confirmingId.value)
  toast('已删除')
  confirmingId.value = null
}

function cancelDelete() {
  confirmingId.value = null
}
</script>
