<script setup lang="ts">
withDefaults(defineProps<{ label?: string; size?: 'sm' | 'md' | 'lg' }>(), {
  label: 'Loading',
  size: 'md',
})
</script>

<template>
  <span class="app-loader" :class="`app-loader--${size}`" role="status"
    ><span class="app-loader__spinner" aria-hidden="true" /><span class="app-loader__label">{{
      label
    }}</span></span
  >
</template>

<style scoped>
.app-loader {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--color-text-secondary);
}
.app-loader__spinner {
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
.app-loader--sm .app-loader__spinner {
  width: 1rem;
  height: 1rem;
}
.app-loader--lg .app-loader__spinner {
  width: 2rem;
  height: 2rem;
  border-width: 3px;
}
.app-loader__label {
  font-size: var(--font-size-sm);
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
