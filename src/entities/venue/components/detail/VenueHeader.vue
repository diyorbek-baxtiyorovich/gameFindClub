<script setup lang="ts">
import { computed } from 'vue'
import AppBadge from '@/components/ui/AppBadge.vue'
import AppLucideIcon from '@/components/ui/AppLucideIcon.vue'
import type { VenueDetail } from '../../model/venue'
import { formatDistance, formatRating } from '../../utils'
const props = defineProps<{ venue: VenueDetail }>()
const rating = computed(() => formatRating(props.venue.rating))
const distance = computed(() => formatDistance('distanceMeters' in props.venue ? props.venue.distanceMeters as number | undefined : undefined))
</script>
<template><header class="venue-header"><div class="venue-header__title"><h1>{{ venue.name }}</h1><AppBadge tone="primary">{{ venue.category.name }}</AppBadge></div><div class="venue-header__meta"><span v-if="rating"><AppLucideIcon name="star" :size="16" filled />{{ rating }}</span><span v-if="distance"><AppLucideIcon name="map-pin" :size="16" />{{ distance }}</span><span v-if="venue.isVerified"><AppLucideIcon name="check" :size="16" />Tasdiqlangan</span></div></header></template>
<style scoped>.venue-header { display: grid; gap: var(--space-3); }.venue-header__title{display:flex;align-items:flex-start;justify-content:space-between;gap:var(--space-3)}.venue-header h1 { margin: 0; overflow-wrap: anywhere; font-size: clamp(1.45rem,6vw,1.8rem); line-height: var(--line-height-tight); }.venue-header__title :deep(.app-badge){flex:0 0 auto;padding-inline:var(--space-3);color:var(--color-text-inverse);background:var(--color-primary)}.venue-header__meta { display: flex; flex-wrap: wrap; gap: var(--space-3); color: var(--color-text-secondary); font-size: var(--font-size-sm); }.venue-header__meta span{display:inline-flex;align-items:center;gap:var(--space-1)}.venue-header__meta span:first-child { color: var(--color-warning); }</style>
