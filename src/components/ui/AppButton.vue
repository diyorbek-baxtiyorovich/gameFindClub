<script setup lang="ts">
withDefaults(
  defineProps<{
    type?: 'button' | 'submit' | 'reset'
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
    size?: 'sm' | 'md' | 'lg'
    disabled?: boolean
    loading?: boolean
    fullWidth?: boolean
  }>(),
  {
    type: 'button',
    variant: 'primary',
    size: 'md',
    disabled: false,
    loading: false,
    fullWidth: false,
  },
)

defineEmits<{ click: [event: MouseEvent] }>()
</script>

<template>
  <button
    :type="type"
    class="app-button"
    :class="[`app-button--${variant}`, `app-button--${size}`, { 'app-button--full': fullWidth }]"
    :disabled="disabled || loading"
    :aria-busy="loading"
    @click="$emit('click', $event)"
  >
    <span v-if="loading" class="app-button__spinner" aria-hidden="true" />
    <slot name="leading" />
    <span><slot /></span>
    <slot name="trailing" />
  </button>
</template>

<style scoped>
.app-button {
  min-height: var(--touch-target-min);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  border: 1px solid transparent;
  border-radius: var(--radius-lg);
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  transition:
    background-color var(--motion-fast),
    border-color var(--motion-fast),
    opacity var(--motion-fast);
}
.app-button--sm {
  min-height: var(--touch-target-min);
  padding: var(--space-2) var(--space-3);
  font-size: var(--font-size-sm);
}
.app-button--md {
  padding: var(--space-2) var(--space-4);
}
.app-button--lg {
  padding: var(--space-3) var(--space-5);
  font-size: var(--font-size-lg);
}
.app-button--full {
  width: 100%;
}
.app-button--primary {
  color: var(--color-text-inverse);
  background: var(--color-primary);
}
.app-button--primary:hover:not(:disabled) {
  background: var(--color-primary-hover);
}
.app-button--secondary {
  color: var(--color-text-primary);
  background: var(--color-surface);
  border-color: var(--color-border);
}
.app-button--ghost {
  color: var(--color-primary);
  background: transparent;
}
.app-button--danger {
  color: var(--color-text-inverse);
  background: var(--color-danger);
}
.app-button:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}
.app-button__spinner {
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
