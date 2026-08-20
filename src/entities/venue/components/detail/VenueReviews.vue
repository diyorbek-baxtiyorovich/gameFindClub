<script setup lang="ts">
import { computed } from 'vue'
import { getReviewCriteria } from '@/config'
import { RatingSummaryView, ReviewList } from '@/entities/review'
import type { Review } from '@/entities/review'
import type { VenueDetail } from '../../model/venue'
import { formatRating } from '../../utils'
import DetailSection from './DetailSection.vue'
const props = defineProps<{ venue: VenueDetail; reviews?: readonly Review[] }>()
const criteria = computed(() => getReviewCriteria(props.venue.category.slug))
const rating = computed(() => formatRating(props.venue.rating))
</script>
<template><DetailSection v-if="rating" title="Reviews"><div class="reviews"><RatingSummaryView v-if="venue.rating" :summary="venue.rating"/><div v-if="criteria.length"><span v-for="criterion in criteria" :key="criterion.key">{{ criterion.label.defaultValue }}</span></div></div><ReviewList v-if="reviews" :items="reviews"/></DetailSection></template>
<style scoped>.reviews { display: flex; align-items: center; justify-content: space-between; gap: var(--space-3); padding: var(--space-4); border: 1px solid var(--color-border); border-radius: var(--radius-md); background: var(--color-surface); }.reviews strong { color: var(--color-warning); }.reviews div { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: var(--space-2); }.reviews span { padding: var(--space-1) var(--space-2); border-radius: var(--radius-pill); background: var(--color-surface-muted); font-size: var(--font-size-xs); }</style>
