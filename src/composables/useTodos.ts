import { computed, reactive } from 'vue'
import type { Priority, Todo } from '@/types/todo'
import { loadTodos, saveTodos } from '@/utils/storage'

const DEFAULT_PRIORITY: Priority = 'medium'
const DEFAULT_CATEGORY = '工作'
const TITLE_MAX = 100
const DESC_MAX = 500

const nowISO = () => new Date().toISOString()
const genId = () => `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`

export function useTodos() {
  const state = reactive<{ todos: Todo[] }>({
    todos: loadTodos<Todo[]>([]),
  })

  const persist = () => saveTodos(state.todos)

  function create(payload: {
    title: string
    description?: string
    priority?: Priority
    category?: string
    dueDate?: string | null
  }) {
    const title = payload.title.trim().slice(0, TITLE_MAX)
    if (!title) return

    const todo: Todo = {
      id: genId(),
      title,
      description: (payload.description ?? '').slice(0, DESC_MAX),
      completed: false,
      priority: payload.priority ?? DEFAULT_PRIORITY,
      category: payload.category ?? DEFAULT_CATEGORY,
      dueDate: payload.dueDate ?? null,
      createdAt: nowISO(),
      updatedAt: nowISO(),
    }
    state.todos.unshift(todo)
    persist()
  }

  function toggle(id: string, completed: boolean) {
    const target = state.todos.find((t) => t.id === id)
    if (!target) return
    target.completed = completed
    target.updatedAt = nowISO()
    persist()
  }

  function update(id: string, patch: Partial<Omit<Todo, 'id' | 'createdAt'>>) {
    const target = state.todos.find((t) => t.id === id)
    if (!target) return
    Object.assign(target, patch)
    target.updatedAt = nowISO()
    persist()
  }

  function remove(id: string) {
    const next = state.todos.filter((t) => t.id !== id)
    if (next.length === state.todos.length) return
    state.todos.splice(0, state.todos.length, ...next)
    persist()
  }

  const stats = computed(() => {
    const total = state.todos.length
    const completed = state.todos.filter((t) => t.completed).length
    const active = total - completed
    const completionRate = total === 0 ? 0 : Math.round((completed / total) * 100)
    return { total, completed, active, completionRate }
  })

  return {
    todos: state.todos,
    create,
    toggle,
    update,
    remove,
    stats,
  }
}
