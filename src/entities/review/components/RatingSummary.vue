<script setup lang="ts">
import type { RatingSummary } from '../model/review'
import AppLucideIcon from '@/components/ui/AppLucideIcon.vue'
defineProps<{ summary: RatingSummary }>()
</script>
<template><div class="rating-summary" :aria-label="`${summary.average} out of ${summary.scale ?? 5}, ${summary.count} reviews`"><strong><AppLucideIcon name="star" :size="19" filled />{{ summary.average.toFixed(1) }}</strong><span>{{ summary.count }} reviews</span></div></template>
<style scoped>.rating-summary{display:flex;align-items:baseline;gap:var(--space-2)}strong{color:var(--color-warning);font-size:var(--font-size-xl)}span{color:var(--color-text-secondary);font-size:var(--font-size-sm)}</style>
