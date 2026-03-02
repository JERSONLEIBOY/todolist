import { computed, ref } from 'vue'
import { loadCategories, saveCategories } from '@/utils/storage'

const DEFAULT_CATEGORIES = ['工作', '学习', '生活']

export function useCategories() {
  const categories = ref<string[]>(loadCategories(DEFAULT_CATEGORIES))

  function addCategory(name: string) {
    const trimmed = name.trim()
    if (!trimmed) return
    if (!categories.value.includes(trimmed)) {
      categories.value.push(trimmed)
      saveCategories(categories.value)
    }
  }

  const options = computed(() => categories.value)

  return {
    categories,
    options,
    addCategory,
  }
}
