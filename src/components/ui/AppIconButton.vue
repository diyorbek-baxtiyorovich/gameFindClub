<script setup lang="ts">
withDefaults(
  defineProps<{
    label: string
    type?: 'button' | 'submit' | 'reset'
    variant?: 'default' | 'ghost' | 'primary'
    disabled?: boolean
    loading?: boolean
  }>(),
  { type: 'button', variant: 'default', disabled: false, loading: false },
)

defineEmits<{ click: [event: MouseEvent] }>()
</script>

<template>
  <button
    :type="type"
    class="app-icon-button"
    :class="`app-icon-button--${variant}`"
    :aria-label="label"
    :title="label"
    :disabled="disabled || loading"
    :aria-busy="loading"
    @click="$emit('click', $event)"
  >
    <span v-if="loading" class="app-icon-button__spinner" aria-hidden="true" />
    <slot v-else />
  </button>
</template>

<style scoped>
.app-icon-button {
  width: var(--touch-target-min);
  height: var(--touch-target-min);
  display: inline-grid;
  place-items: center;
  flex: 0 0 auto;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text-primary);
  background: var(--color-surface);
  cursor: pointer;
}
.app-icon-button--ghost {
  border-color: transparent;
  background: transparent;
}
.app-icon-button--primary {
  color: var(--color-text-inverse);
  border-color: var(--color-primary);
  background: var(--color-primary);
}
.app-icon-button:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}
.app-icon-button__spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
