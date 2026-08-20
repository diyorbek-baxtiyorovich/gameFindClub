<script setup lang="ts">
withDefaults(
  defineProps<{
    tone?: 'neutral' | 'primary' | 'success' | 'warning' | 'danger'
  }>(),
  { tone: 'neutral' },
)
</script>

<template><span class="app-badge" :class="`app-badge--${tone}`"><slot /></span></template>

<style scoped>
.app-badge { display: inline-flex; align-items: center; min-height: 24px; padding: 0 var(--space-2); border-radius: var(--radius-pill); font-size: var(--font-size-xs); font-weight: var(--font-weight-semibold); color: var(--color-text-primary); background: var(--color-surface-muted); }
.app-badge--primary { color: var(--color-primary); background: var(--color-primary-soft); }
.app-badge--success { color: var(--color-success); background: var(--color-success-soft); }
.app-badge--warning { color: var(--color-warning); background: var(--color-warning-soft); }
.app-badge--danger { color: var(--color-danger); background: var(--color-danger-soft); }
</style>
