const TODOS_KEY = 'todolist_todos'
const CATEGORIES_KEY = 'todolist_categories'

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback
  try {
    return JSON.parse(raw) as T
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('storage parse error', e)
    return fallback
  }
}

export function loadTodos<T>(fallback: T): T {
  const raw = localStorage.getItem(TODOS_KEY)
  return safeParse(raw, fallback)
}

export function saveTodos<T>(todos: T) {
  try {
    localStorage.setItem(TODOS_KEY, JSON.stringify(todos))
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('storage write todos failed', e)
    throw e
  }
}

export function loadCategories<T>(fallback: T): T {
  const raw = localStorage.getItem(CATEGORIES_KEY)
  return safeParse(raw, fallback)
}

export function saveCategories<T>(categories: T) {
  try {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories))
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('storage write categories failed', e)
    throw e
  }
}
