<template>
  <div class="min-h-screen text-slate-900">
    <Toast :bus="toastBus" />
    <header class="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 pb-6 pt-8 sm:px-6 lg:px-8 lg:pb-8">
      <div class="surface-card flex flex-col gap-4 p-5 sm:p-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 class="text-2xl font-semibold tracking-tight text-blue-600 sm:text-3xl">TodoList</h1>
          <p class="mt-2 text-sm font-normal text-slate-600">高效管理每日任务，保持专注与节奏</p>
        </div>
        <HeaderStats :stats="stats" />
      </div>
    </header>

    <main class="mx-auto grid w-full max-w-5xl grid-cols-1 gap-5 px-4 pb-12 sm:px-6 lg:grid-cols-3 lg:gap-6 lg:px-8 lg:pb-16">
      <section class="space-y-5 lg:col-span-1">
        <TodoForm
          :categories="categories"
          :default-category="categories[0] ?? '工作'"
          :on-add-category="addCategory"
          :editing-todo="editingTodo"
          :is-editing="Boolean(editingTodo)"
          @submit="handleSubmit"
          @cancel-edit="cancelEdit"
        />
        <FiltersBar
          :categories="categories"
          :keyword="keyword"
          :status="status"
          :priority="priority"
          :category="category"
          :sort-by="sortBy"
          @update:keyword="(v) => (keyword = v.trim().toLowerCase())"
          @update:status="(v) => (status = v)"
          @update:priority="(v) => (priority = v)"
          @update:category="(v) => (category = v)"
          @update:sortBy="(v) => (sortBy = v)"
          @reset="reset"
        />
      </section>

      <section class="lg:col-span-2">
        <div class="surface-card p-5 sm:p-6">
          <div class="flex items-center justify-between border-b border-slate-200 pb-3">
            <h2 class="text-lg font-semibold text-slate-800">任务列表</h2>
            <span class="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 sm:text-sm">
              {{ filteredTodos.length }} 条
            </span>
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

const { categories, addCategory } = useCategories()
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
const editingTodo = ref<Todo | null>(null)

function handleSubmit(payload: {
  title: string
  description: string
  priority: Todo['priority']
  category: string
  dueDate: string | null
}) {
  if (editingTodo.value) {
    update(editingTodo.value.id, payload)
    toast('已保存修改')
    editingTodo.value = null
    return
  }

  create(payload)
  toast('创建成功')
}

function handleToggle(id: string, completed: boolean) {
  toggle(id, completed)
  toast(completed ? '已完成' : '标记进行中')
}

function handleEdit(todo: Todo) {
  editingTodo.value = { ...todo }
}

function cancelEdit() {
  editingTodo.value = null
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
