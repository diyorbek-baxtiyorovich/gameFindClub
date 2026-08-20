<script setup lang="ts">
import { computed } from 'vue'

import AppLucideIcon from '@/components/ui/AppLucideIcon.vue'

const props = withDefaults(defineProps<{
  label: string
  value?: string | number | null
  icon?: string
  tone?: 'neutral' | 'primary' | 'success' | 'warning'
}>(), {
  value: null,
  icon: 'gauge',
  tone: 'neutral',
})

const displayValue = computed(() => props.value == null || props.value === '' ? '—' : String(props.value))
</script>

<template>
  <article class="owner-stat" :class="`owner-stat--${tone}`">
    <span class="owner-stat__icon" aria-hidden="true"><AppLucideIcon :name="icon" :size="20" /></span>
    <strong>{{ displayValue }}</strong>
    <span class="owner-stat__label">{{ label }}</span>
  </article>
</template>

<style scoped>
.owner-stat { min-width: 0; display: grid; grid-template-columns: auto minmax(0, 1fr); align-items: center; gap: var(--space-1) var(--space-2); padding: var(--space-4); border: 1px solid var(--color-border); border-radius: var(--radius-lg); background: var(--color-surface); box-shadow: var(--elevation-1); }
.owner-stat__icon { width: 34px; height: 34px; display: grid; place-items: center; grid-row: span 2; border-radius: var(--radius-md); color: var(--color-text-secondary); background: var(--color-surface-muted); }
.owner-stat strong { overflow: hidden; font-size: var(--font-size-xl); line-height: var(--line-height-tight); text-overflow: ellipsis; }
.owner-stat__label { overflow: hidden; color: var(--color-text-secondary); font-size: var(--font-size-xs); text-overflow: ellipsis; white-space: nowrap; }
.owner-stat--primary .owner-stat__icon { color: var(--color-primary); background: var(--color-primary-soft); }
.owner-stat--success .owner-stat__icon { color: var(--color-success); background: var(--color-success-soft); }
.owner-stat--warning .owner-stat__icon { color: var(--color-warning); background: var(--color-warning-soft); }
@media (max-width: 350px) { .owner-stat { padding: var(--space-3); } .owner-stat__icon { width: 30px; height: 30px; } }
</style>
