<template>
  <div class="surface-card p-5 sm:p-6">
    <h2 class="text-lg font-semibold text-slate-800">{{ isEditing ? '编辑任务' : '添加任务' }}</h2>
    <p class="mt-1 text-sm font-normal text-slate-500">标题必填，高级项可选</p>

    <form class="mt-5 space-y-4" @submit.prevent="handleSubmit">
      <div class="space-y-2">
        <label class="block text-sm font-medium text-slate-700">标题 *</label>
        <input
          v-model.trim="title"
          type="text"
          class="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 transition duration-200 placeholder:text-slate-400 hover:border-blue-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          placeholder="输入任务标题"
          maxlength="100"
          required
        />
      </div>

      <details class="rounded-xl border border-slate-200 bg-slate-50/90 px-3.5 py-3 text-sm text-slate-700 transition duration-200 open:border-blue-200 open:bg-blue-50/40">
        <summary class="cursor-pointer select-none font-medium text-slate-700">高级选项</summary>
        <div class="mt-4 space-y-4 text-sm">
          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700">描述</label>
            <textarea
              v-model.trim="description"
              rows="3"
              maxlength="500"
              class="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 transition duration-200 placeholder:text-slate-400 hover:border-blue-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              placeholder="可选描述"
            ></textarea>
          </div>

          <div class="grid gap-3 sm:grid-cols-2">
            <div class="space-y-2">
              <label class="block text-sm font-medium text-slate-700">优先级</label>
              <select
                v-model="priority"
                class="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 transition duration-200 hover:border-blue-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="high">高</option>
                <option value="medium">中</option>
                <option value="low">低</option>
              </select>
            </div>
            <div class="space-y-2">
              <label class="block text-sm font-medium text-slate-700">分类</label>
              <div class="flex items-center gap-2">
                <select
                  v-model="category"
                  class="flex-1 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 transition duration-200 hover:border-blue-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option v-for="c in props.categories" :key="c" :value="c">{{ c }}</option>
                </select>
              </div>
            </div>
          </div>

          <div class="space-y-2">
            <label class="block text-sm font-medium text-slate-700">新增分类</label>
            <div class="flex flex-col gap-2">
              <input
                v-model.trim="newCategory"
                type="text"
                maxlength="20"
                class="flex-1 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 transition duration-200 placeholder:text-slate-400 hover:border-blue-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="输入新分类"
              />
              <button
                type="button"
                class="self-start whitespace-nowrap rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-700 transition duration-200 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-slate-200 disabled:hover:bg-white disabled:hover:text-slate-700"
                :disabled="!newCategory.trim()"
                @click="handleAddCategory"
              >
                新增分类
              </button>
            </div>
          </div>

          <div class="space-y-2">
            <label class="block text-sm font-medium text-slate-700">截止日期</label>
            <input
              v-model="dueDate"
              type="date"
              class="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 transition duration-200 hover:border-blue-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>
      </details>

      <div class="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          class="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition duration-200 hover:border-slate-300 hover:bg-slate-50"
          @click="isEditing ? emits('cancel-edit') : resetForm()"
        >
          {{ isEditing ? '取消编辑' : '重置' }}
        </button>
        <button
          type="submit"
          class="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition duration-200 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          :disabled="!trimmedTitle"
        >
          {{ isEditing ? '保存' : '创建' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { Priority, Todo } from '@/types/todo'

const props = withDefaults(defineProps<{
  categories: string[]
  defaultCategory?: string
  onAddCategory: (name: string) => void
  editingTodo?: Todo | null
  isEditing?: boolean
}>(), {
  editingTodo: null,
  isEditing: false,
})

const emits = defineEmits<{
  (e: 'submit', payload: {
    title: string
    description: string
    priority: Priority
    category: string
    dueDate: string | null
  }): void
  (e: 'reset'): void
  (e: 'cancel-edit'): void
}>()

const title = ref('')
const description = ref('')
const priority = ref<Priority>('medium')
const category = ref(props.defaultCategory ?? props.categories[0] ?? '工作')
const newCategory = ref('')
const dueDate = ref<string | null>(null)

const trimmedTitle = computed(() => title.value.trim())
const isEditing = computed(() => props.isEditing)

watch(
  () => props.editingTodo,
  (todo) => {
    if (!todo) {
      title.value = ''
      description.value = ''
      priority.value = 'medium'
      category.value = props.defaultCategory ?? props.categories[0] ?? '工作'
      dueDate.value = null
      return
    }

    title.value = todo.title
    description.value = todo.description
    priority.value = todo.priority
    category.value = todo.category
    dueDate.value = todo.dueDate
  },
  { immediate: true }
)

function handleAddCategory() {
  const name = newCategory.value.trim()
  if (!name) return
  props.onAddCategory(name)
  category.value = name
  newCategory.value = ''
}

function handleSubmit() {
  if (!trimmedTitle.value) return
  emits('submit', {
    title: trimmedTitle.value,
    description: description.value.trim(),
    priority: priority.value,
    category: category.value,
    dueDate: dueDate.value,
  })

  if (isEditing.value) {
    emits('cancel-edit')
    return
  }

  resetForm()
}

function resetForm() {
  title.value = ''
  description.value = ''
  priority.value = 'medium'
  category.value = props.defaultCategory ?? props.categories[0] ?? '工作'
  newCategory.value = ''
  dueDate.value = null
  emits('reset')
}
</script>
