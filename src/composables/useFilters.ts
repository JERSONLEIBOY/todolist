import { computed, ref } from 'vue'

export type StatusFilter = 'all' | 'active' | 'completed'
export type SortField = 'createdAt' | 'dueDate' | 'priority'

export interface FiltersState {
  keyword: string
  status: StatusFilter
  priority: 'all' | 'high' | 'medium' | 'low'
  category: string | 'all'
  sortBy: SortField
}

export function useFilters() {
  const keyword = ref('')
  const status = ref<StatusFilter>('all')
  const priority = ref<'all' | 'high' | 'medium' | 'low'>('all')
  const category = ref<string | 'all'>('all')
  const sortBy = ref<SortField>('createdAt')

  const filters = computed<FiltersState>(() => ({
    keyword: keyword.value.trim().toLowerCase(),
    status: status.value,
    priority: priority.value,
    category: category.value,
    sortBy: sortBy.value,
  }))

  function reset() {
    keyword.value = ''
    status.value = 'all'
    priority.value = 'all'
    category.value = 'all'
    sortBy.value = 'createdAt'
  }

  return {
    keyword,
    status,
    priority,
    category,
    sortBy,
    filters,
    reset,
  }
}
