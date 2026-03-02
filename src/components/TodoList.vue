<template>
  <div class="space-y-3">
    <div
      v-for="todo in todos"
      :key="todo.id"
      class="group rounded-2xl border border-slate-200 bg-white p-4 shadow-card transition hover:border-primary/50"
    >
      <div class="flex items-start justify-between gap-3">
        <div class="flex items-start gap-3">
          <input
            type="checkbox"
            class="mt-1 h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
            :checked="todo.completed"
            @change="emitToggle(todo.id, !todo.completed)"
          />
          <div>
            <div
              class="text-base font-semibold"
              :class="todo.completed ? 'text-slate-400 line-through' : 'text-slate-900'"
            >
              {{ todo.title }}
            </div>
            <div class="mt-1 text-sm text-slate-500" v-if="todo.description">
              {{ todo.description }}
            </div>
            <div class="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span :class="priorityClass(todo.priority)" class="rounded-full px-2 py-0.5 font-medium">
                优先级: {{ priorityLabel(todo.priority) }}
              </span>
              <span class="rounded-full bg-slate-100 px-2 py-0.5">分类: {{ todo.category }}</span>
              <span v-if="todo.dueDate" class="rounded-full bg-slate-100 px-2 py-0.5">
                截止: {{ todo.dueDate }}
              </span>
              <span class="text-slate-400">创建: {{ todo.createdAt }}</span>
            </div>
          </div>
        </div>
        <div class="flex gap-2 opacity-0 transition group-hover:opacity-100">
          <button
            class="rounded-lg border border-slate-200 px-3 py-1 text-xs text-slate-700 hover:bg-slate-50"
            @click="emitEdit(todo)"
          >
            编辑
          </button>
          <button
            class="rounded-lg border border-rose-200 px-3 py-1 text-xs text-rose-600 hover:bg-rose-50"
            @click="emitDelete(todo.id)"
          >
            删除
          </button>
        </div>
      </div>
    </div>
    <div v-if="todos.length === 0" class="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-slate-500">
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
</script>
