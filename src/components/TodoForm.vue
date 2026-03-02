<template>
  <div class="rounded-2xl bg-white p-6 shadow-card">
    <h2 class="text-lg font-semibold text-slate-800">添加任务</h2>
    <p class="mt-1 text-sm text-slate-500">标题必填，高级项可选</p>

    <form class="mt-4 space-y-4" @submit.prevent="handleSubmit">
      <div class="space-y-2">
        <label class="block text-sm font-medium text-slate-700">标题 *</label>
        <input
          v-model.trim="title"
          type="text"
          class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          placeholder="输入任务标题"
          maxlength="100"
          required
        />
      </div>

      <details class="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
        <summary class="cursor-pointer select-none font-medium">高级选项</summary>
        <div class="mt-3 space-y-3 text-sm">
          <div>
            <label class="block text-sm font-medium text-slate-700">描述</label>
            <textarea
              v-model.trim="description"
              rows="3"
              maxlength="500"
              class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="可选描述"
            ></textarea>
          </div>

          <div class="grid gap-3 sm:grid-cols-2">
            <div class="space-y-2">
              <label class="block text-sm font-medium text-slate-700">优先级</label>
              <select
                v-model="priority"
                class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
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
                  class="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
                </select>
              </div>
            </div>
          </div>

          <div class="space-y-2">
            <label class="block text-sm font-medium text-slate-700">截止日期</label>
            <input
              v-model="dueDate"
              type="date"
              class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
      </details>

      <div class="flex justify-end gap-2 pt-2">
        <button
          type="button"
          class="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
          @click="resetForm"
        >
          重置
        </button>
        <button
          type="submit"
          class="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
        >
          创建
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Priority } from '@/types/todo'

const props = defineProps<{
  categories: string[]
  defaultCategory?: string
}>

const emits = defineEmits<{
  (e: 'submit', payload: {
    title: string
    description: string
    priority: Priority
    category: string
    dueDate: string | null
  }): void
  (e: 'reset'): void
}>()

const title = ref('')
const description = ref('')
const priority = ref<Priority>('medium')
const category = ref(props.defaultCategory ?? props.categories[0] ?? '工作')
const dueDate = ref<string | null>(null)

const trimmedTitle = computed(() => title.value.trim())

function handleSubmit() {
  if (!trimmedTitle.value) return
  emits('submit', {
    title: trimmedTitle.value,
    description: description.value.trim(),
    priority: priority.value,
    category: category.value,
    dueDate: dueDate.value,
  })
  resetForm()
}

function resetForm() {
  title.value = ''
  description.value = ''
  priority.value = 'medium'
  category.value = props.defaultCategory ?? props.categories[0] ?? '工作'
  dueDate.value = null
  emits('reset')
}
</script>
