<template>
  <div>
    <transition-group name="todo" tag="div" class="space-y-3">
      <div
        v-for="todo in todos"
        :key="todo.id"
        class="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition duration-200 hover:border-blue-300 hover:shadow-card"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0 flex-1">
            <div class="flex items-start gap-3">
              <input
                type="checkbox"
                class="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500/30"
                :checked="todo.completed"
                @change="emitToggle(todo.id, !todo.completed)"
              />
              <div class="min-w-0 flex-1">
                <div
                  class="text-base font-semibold leading-6 text-slate-900 transition-all duration-200"
                  :class="todo.completed ? 'text-slate-400 line-through' : ''"
                >
                  {{ todo.title }}
                </div>
                <div v-if="todo.description" class="mt-1.5 text-sm leading-6 text-slate-500">
                  {{ todo.description }}
                </div>
                <div class="mt-2.5 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <span :class="priorityClass(todo.priority)" class="rounded-full px-2.5 py-1 font-medium">
                    优先级: {{ priorityLabel(todo.priority) }}
                  </span>
                  <span class="rounded-full bg-slate-100 px-2.5 py-1">分类: {{ todo.category }}</span>
                  <span
                    v-if="todo.dueDate"
                    class="rounded-full px-2.5 py-1"
                    :class="dueClass(todo.dueDate)"
                  >
                    截止: {{ todo.dueDate }}（{{ dueHint(todo.dueDate) }}）
                  </span>
                  <span class="text-slate-400">创建: {{ todo.createdAt }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="flex shrink-0 gap-2 opacity-100 transition duration-200 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
            <button
              class="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition duration-200 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
              @click="emitEdit(todo)"
            >
              编辑
            </button>
            <button
              class="rounded-lg border border-rose-200 bg-white px-3 py-1.5 text-xs font-medium text-rose-600 transition duration-200 hover:bg-rose-50"
              @click="emitDelete(todo.id)"
            >
              删除
            </button>
          </div>
        </div>
      </div>
    </transition-group>

    <div
      v-if="todos.length === 0"
      class="rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 p-8 text-center text-sm text-slate-500"
    >
      暂无任务，去创建一个吧
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Todo } from '@/types/todo'

const props = defineProps<{
  todos: Todo[]
}>()

const emits = defineEmits<{
  (e: 'toggle', id: string, completed: boolean): void
  (e: 'edit', todo: Todo): void
  (e: 'delete', id: string): void
}>()

const emitToggle = (id: string, completed: boolean) => emits('toggle', id, completed)
const emitEdit = (todo: Todo) => emits('edit', todo)
const emitDelete = (id: string) => emits('delete', id)

const priorityLabel = (p: Todo['priority']) => ({ high: '高', medium: '中', low: '低' }[p])
const priorityClass = (p: Todo['priority']) => {
  switch (p) {
    case 'high':
      return 'bg-rose-50 text-rose-600 border border-rose-200'
    case 'medium':
      return 'bg-amber-50 text-amber-600 border border-amber-200'
    case 'low':
      return 'bg-emerald-50 text-emerald-600 border border-emerald-200'
  }
}

function diffFromToday(dueDate: string) {
  const today = new Date()
  const startOfToday = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())
  const target = new Date(`${dueDate}T00:00:00`)
  const targetDate = Date.UTC(target.getFullYear(), target.getMonth(), target.getDate())
  return Math.floor((targetDate - startOfToday) / 86_400_000)
}

const dueHint = (dueDate: string) => {
  const diff = diffFromToday(dueDate)
  if (diff < 0) return '已过期'
  if (diff === 0) return '今天'
  if (diff === 1) return '明天'
  return `${diff}天后`
}

const dueClass = (dueDate: string) => {
  const diff = diffFromToday(dueDate)
  if (diff < 0) return 'bg-rose-50 text-rose-600 border border-rose-200'
  return 'bg-slate-100'
}
</script>
