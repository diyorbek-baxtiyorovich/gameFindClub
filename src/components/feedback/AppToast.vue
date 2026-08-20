<script setup lang="ts">
import { onBeforeUnmount, watch } from 'vue'
import AppLucideIcon from '@/components/ui/AppLucideIcon.vue'

const props = withDefaults(defineProps<{ modelValue: boolean; message: string; tone?: 'neutral' | 'success' | 'warning' | 'danger'; duration?: number; dismissLabel?: string }>(), { tone: 'neutral', duration: 4000, dismissLabel: 'Dismiss' })
const emit = defineEmits<{ 'update:modelValue': [value: boolean]; dismiss: [] }>()
let timeoutId: ReturnType<typeof setTimeout> | undefined

function dismiss(): void {
  emit('update:modelValue', false)
  emit('dismiss')
}

watch(
  () => props.modelValue,
  (open) => {
    if (timeoutId) clearTimeout(timeoutId)
    if (open && props.duration > 0) timeoutId = setTimeout(dismiss, props.duration)
  },
  { immediate: true },
)

onBeforeUnmount(() => timeoutId && clearTimeout(timeoutId))
</script>

<template>
  <Teleport to="body">
    <Transition name="app-toast">
      <div v-if="modelValue" class="app-toast" :class="`app-toast--${tone}`" :role="tone === 'danger' ? 'alert' : 'status'">
        <span>{{ message }}</span>
        <button type="button" :aria-label="dismissLabel" @click="dismiss"><AppLucideIcon name="x" /></button>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.app-toast { position: fixed; z-index: 1100; right: calc(var(--space-4) + var(--safe-area-right)); bottom: calc(var(--space-4) + var(--safe-area-bottom)); left: calc(var(--space-4) + var(--safe-area-left)); min-height: var(--touch-target-min); display: flex; align-items: center; justify-content: space-between; gap: var(--space-3); max-width: 440px; margin-inline: auto; padding: var(--space-2) var(--space-2) var(--space-2) var(--space-4); border: 1px solid var(--color-border); border-radius: var(--radius-lg); color: var(--color-text-primary); background: var(--color-surface-raised); box-shadow: var(--elevation-2); }
.app-toast--success { border-color: var(--color-success); }
.app-toast--warning { border-color: var(--color-warning); }
.app-toast--danger { border-color: var(--color-danger); }
button { width: var(--touch-target-min); height: var(--touch-target-min); border: 0; border-radius: var(--radius-md); color: inherit; background: transparent; cursor: pointer; font-size: 1.25rem; }
.app-toast-enter-active, .app-toast-leave-active { transition: opacity var(--motion-normal), transform var(--motion-normal); }
.app-toast-enter-from, .app-toast-leave-to { opacity: 0; transform: translateY(var(--space-3)); }
</style>
