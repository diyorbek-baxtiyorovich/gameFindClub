<script setup lang="ts">
import type { RatingBreakdown } from '../model/review'
import AppLucideIcon from '@/components/ui/AppLucideIcon.vue'
defineProps<{ items: RatingBreakdown }>()
</script>
<template><div class="breakdown"><div v-for="item in items" :key="item.score"><span>{{ item.score }}<AppLucideIcon name="star" :size="13" filled /></span><progress :value="item.percentage ?? 0" max="100"/><small>{{ item.count }}</small></div></div></template>
<style scoped>.breakdown{display:grid;gap:var(--space-1)}.breakdown div{display:grid;grid-template-columns:2rem 1fr 2rem;align-items:center;gap:var(--space-2);font-size:var(--font-size-sm)}progress{width:100%;accent-color:var(--color-warning)}small{color:var(--color-text-secondary)}</style>
