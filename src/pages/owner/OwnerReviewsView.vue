<script setup lang="ts">
import { computed, onMounted, reactive } from 'vue'

import AppEmptyState from '@/components/feedback/AppEmptyState.vue'
import AppErrorState from '@/components/feedback/AppErrorState.vue'
import AppBadge from '@/components/ui/AppBadge.vue'
import AppChip from '@/components/ui/AppChip.vue'
import AppSkeleton from '@/components/ui/AppSkeleton.vue'
import {
  DEFAULT_OWNER_REVIEW_FILTERS,
  filterOwnerReviews,
  type OwnerReviewFilters,
  type OwnerReviewRatingFilter,
  type OwnerReviewReplyFilter,
} from '@/features/owner/reviews'
import OwnerReviewManagementCard from '@/features/owner/reviews/components/OwnerReviewManagementCard.vue'
import { t } from '@/i18n'
import { useOwnerReviewsStore, useOwnerVenuesStore } from '@/stores'

const reviews = useOwnerReviewsStore()
const venues = useOwnerVenuesStore()
const filters = reactive<OwnerReviewFilters>({ ...DEFAULT_OWNER_REVIEW_FILTERS })
const venueIds = computed(() => new Set(venues.items.map((venue) => venue.id)))
const ownerReviews = computed(() => reviews.items.filter((review) => venueIds.value.has(review.venueId)))
const visibleReviews = computed(() => filterOwnerReviews(ownerReviews.value, filters))
const filtersActive = computed(() => filters.reply !== 'all' || filters.rating !== 'all')
const error = computed(() => reviews.error || venues.error)
const replyFilters: readonly Exclude<OwnerReviewReplyFilter, 'all'>[] = ['unanswered', 'replied']
const ratingFilters: readonly Exclude<OwnerReviewRatingFilter, 'all'>[] = ['low', 'high']

function resetFilters(): void { Object.assign(filters, DEFAULT_OWNER_REVIEW_FILTERS) }
async function load(): Promise<void> { await Promise.all([venues.load(), reviews.load()]) }
onMounted(load)
</script>

<template>
  <div class="owner-reviews-page">
    <header><h2>{{ t('owner.reviews.title') }}</h2><p>{{ t('owner.reviews.description') }}</p></header>
    <section class="owner-reviews-page__filters" :aria-label="t('owner.reviews.filters')">
      <AppChip :selected="!filtersActive" @click="resetFilters">{{ t('common.all') }}</AppChip>
      <AppChip v-for="filter in replyFilters" :key="filter" :selected="filters.reply === filter" @click="filters.reply = filters.reply === filter ? 'all' : filter">
        {{ t(`owner.reviews.filter.${filter}`) }}
      </AppChip>
      <AppChip v-for="filter in ratingFilters" :key="filter" :selected="filters.rating === filter" @click="filters.rating = filters.rating === filter ? 'all' : filter">
        {{ t(`owner.reviews.filter.${filter}`) }}
      </AppChip>
    </section>
    <div v-if="(reviews.loading || venues.loading) && !ownerReviews.length" class="owner-reviews-page__list" :aria-label="t('common.loading')">
      <AppSkeleton v-for="index in 3" :key="index" height="180px" radius="var(--radius-lg)" />
    </div>
    <AppErrorState v-else-if="error" :title="t('owner.reviews.load_error')" :description="error" @retry="load" />
    <div v-else-if="visibleReviews.length" class="owner-reviews-page__list">
      <section v-for="review in visibleReviews" :key="review.id" class="owner-review">
        <div class="owner-review__context"><strong>{{ review.venueName || t('owner.review.unknown_venue') }}</strong><AppBadge :tone="review.ownerReply ? 'success' : 'warning'">{{ t(review.ownerReply ? 'owner.review.replied' : 'owner.review.awaiting_reply') }}</AppBadge></div>
        <OwnerReviewManagementCard :review="review" />
      </section>
    </div>
    <AppEmptyState v-else-if="filtersActive" :title="t('owner.reviews.no_matches')" :description="t('owner.reviews.no_matches_description')" :action-label="t('filters.reset')" @action="resetFilters" />
    <AppEmptyState v-else :title="t('owner.reviews.empty')" :description="t('owner.reviews.empty_description')" />
  </div>
</template>

<style scoped>
.owner-reviews-page,.owner-reviews-page__list{display:grid;gap:var(--space-4)}header h2,header p{margin:0}header p{margin-top:var(--space-1);color:var(--color-text-secondary);font-size:var(--font-size-sm)}.owner-reviews-page__filters{display:flex;gap:var(--space-2);overflow-x:auto;padding-bottom:var(--space-1);scrollbar-width:none}.owner-reviews-page__filters::-webkit-scrollbar{display:none}.owner-reviews-page__filters>:deep(.app-chip){flex:0 0 auto}.owner-review{display:grid;gap:var(--space-2)}.owner-review__context{display:flex;align-items:center;justify-content:space-between;gap:var(--space-3);padding-inline:var(--space-1)}.owner-review__context strong{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
</style>
