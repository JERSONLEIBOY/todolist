<template>
  <div class="fixed inset-0 flex items-center justify-center bg-black/40 px-4" role="dialog" aria-modal="true">
    <div class="w-full max-w-sm rounded-2xl bg-white p-6 shadow-card">
      <h3 class="text-lg font-semibold text-slate-900">确认删除</h3>
      <p class="mt-2 text-sm text-slate-600">此操作不可撤销，确定删除该任务吗？</p>
      <div class="mt-6 flex justify-end gap-2">
        <button
          type="button"
          class="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
          @click="$emit('cancel')"
        >
          取消
        </button>
        <button
          type="button"
          class="rounded-lg bg-rose-500 px-4 py-2 text-sm font-medium text-white hover:bg-rose-600"
          @click="$emit('confirm')"
        >
          删除
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineEmits<{
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()
</script>
