<template>
  <div class="fixed inset-x-0 top-4 z-50 flex flex-col items-center gap-2 px-4">
    <transition-group name="toast-fade" tag="div" class="w-full max-w-md space-y-2">
      <div
        v-for="item in toasts"
        :key="item.id"
        class="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-card"
      >
        <div class="text-sm text-slate-900">{{ item.message }}</div>
      </div>
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

interface ToastItem {
  id: number
  message: string
}

const props = defineProps<{ bus: EventTarget }>()

const toasts = ref<ToastItem[]>([])
let counter = 0

function addToast(message: string, duration = 1800) {
  const id = ++counter
  toasts.value.push({ id, message })
  setTimeout(() => {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }, duration)
}

function onToast(event: Event) {
  const detail = (event as CustomEvent<{ message: string; duration?: number }>).detail
  if (!detail?.message) return
  addToast(detail.message, detail.duration ?? 1800)
}

onMounted(() => props.bus.addEventListener('toast', onToast))
onUnmounted(() => props.bus.removeEventListener('toast', onToast))
</script>

<style scoped>
.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: all 0.2s ease;
}
.toast-fade-enter-from {
  opacity: 0;
  transform: translateY(-6px);
}
.toast-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
