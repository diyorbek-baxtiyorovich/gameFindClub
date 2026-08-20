<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import AppEmptyState from '@/components/feedback/AppEmptyState.vue'
import AppErrorState from '@/components/feedback/AppErrorState.vue'
import SectionHeader from '@/components/layout/SectionHeader.vue'
import OwnerReviewCompactCard from '@/components/owner/OwnerReviewCompactCard.vue'
import OwnerStatCard from '@/components/owner/OwnerStatCard.vue'
import OwnerVenueCard from '@/components/owner/OwnerVenueCard.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppLucideIcon from '@/components/ui/AppLucideIcon.vue'
import AppSkeleton from '@/components/ui/AppSkeleton.vue'
import { t } from '@/i18n'
import {
  useOwnerAnalyticsStore,
  useOwnerReviewsStore,
  useOwnerSessionStore,
  useOwnerVenuesStore,
} from '@/stores'

const router = useRouter()
const session = useOwnerSessionStore()
const venues = useOwnerVenuesStore()
const reviews = useOwnerReviewsStore()
const analytics = useOwnerAnalyticsStore()

const loading = computed(() => venues.loading || reviews.loading || analytics.loading)
const error = computed(() => venues.error || reviews.error || analytics.error)
const recentVenues = computed(() =>
  [...venues.items]
    .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))
    .slice(0, 3),
)
const recentReviews = computed(() => reviews.items.slice(0, 2))
const approvedCount = computed(
  () => venues.items.filter((venue) => venue.status === 'approved').length,
)
const pendingCount = computed(
  () => venues.items.filter((venue) => venue.status === 'pending_review').length,
)
const averageRating = computed(() =>
  analytics.summary?.averageRating == null ? null : analytics.summary.averageRating.toFixed(1),
)
const quickActions = [
  { routeName: 'owner-venue-new', label: () => t('owner.action.add_venue'), icon: 'plus', primary: true },
  { routeName: 'owner-venues', label: () => t('owner.action.manage_venues'), icon: 'list', primary: false },
  { routeName: 'owner-reviews', label: () => t('owner.action.view_reviews'), icon: 'message', primary: false },
] as const

async function loadDashboard(): Promise<void> {
  await Promise.all([venues.load(), reviews.load(), analytics.load(session.profile.id)])
}

onMounted(loadDashboard)
</script>

<template>
  <div class="owner-dashboard">
    <section class="owner-dashboard__greeting">
      <span class="owner-dashboard__greeting-icon"><AppLucideIcon name="building" :size="22" /></span>
      <div><h2>{{ t('owner.dashboard.greeting_named', { name: session.profile.displayName }) }}</h2>
      <p>{{ t('owner.dashboard.subtitle') }}</p>
      </div>
    </section>

    <div
      v-if="loading && !venues.items.length"
      class="owner-dashboard__loading"
      :aria-label="t('common.loading')"
    >
      <AppSkeleton v-for="index in 4" :key="index" height="92px" radius="var(--radius-lg)" />
    </div>

    <AppErrorState
      v-else-if="error"
      :title="t('owner.dashboard.load_error')"
      :description="error"
      @retry="loadDashboard"
    />

    <template v-else>
      <section class="owner-dashboard__section">
        <SectionHeader :title="t('owner.dashboard.statistics')" />
        <div class="owner-dashboard__stats">
          <OwnerStatCard
            :label="t('owner.metric.venues')"
            :value="venues.items.length"
            icon="list"
            tone="primary"
          />
          <OwnerStatCard
            :label="t('owner.metric.approved')"
            :value="approvedCount"
            icon="check"
            tone="success"
          />
          <OwnerStatCard
            :label="t('owner.metric.pending')"
            :value="pendingCount"
            icon="clock"
            tone="warning"
          />
          <OwnerStatCard :label="t('owner.metric.rating')" :value="averageRating" icon="star" />
        </div>
      </section>

      <section class="owner-dashboard__section">
        <SectionHeader :title="t('owner.dashboard.quick_actions')" />
        <div class="owner-dashboard__actions">
          <AppButton
            v-for="action in quickActions"
            :key="action.routeName"
            :variant="action.primary ? 'primary' : 'secondary'"
            :class="{ 'owner-dashboard__action--primary': action.primary }"
            @click="router.push({ name: action.routeName })"
          >
            <template #leading><AppLucideIcon :name="action.icon" /></template>
            {{ action.label() }}
          </AppButton>
        </div>
      </section>

      <section class="owner-dashboard__section">
        <SectionHeader
          :title="t('owner.dashboard.recent_venues')"
          :action-label="t('owner.action.view_all')"
          @action="router.push({ name: 'owner-venues' })"
        />
        <div v-if="recentVenues.length" class="owner-dashboard__venues">
          <OwnerVenueCard
            v-for="venue in recentVenues"
            :key="venue.id"
            :venue="venue"
            variant="compact"
            @edit="router.push({ name: 'owner-venue-edit', params: { id: venue.id } })"
          />
        </div>
        <AppEmptyState v-else :title="t('owner.dashboard.no_venues')" />
      </section>

      <section class="owner-dashboard__section">
        <SectionHeader
          :title="t('owner.dashboard.recent_reviews')"
          :action-label="t('owner.action.view_all')"
          @action="router.push({ name: 'owner-reviews' })"
        />
        <div v-if="recentReviews.length" class="owner-dashboard__reviews">
          <OwnerReviewCompactCard
            v-for="review in recentReviews"
            :key="review.id"
            :review="review"
          />
        </div>
        <AppEmptyState v-else :title="t('owner.dashboard.no_reviews')" />
      </section>
    </template>
  </div>
</template>

<style scoped>
.owner-dashboard {
  display: grid;
  gap: var(--space-6);
}
.owner-dashboard__greeting { display:grid;grid-template-columns:44px minmax(0,1fr);align-items:center;gap:var(--space-3);padding:var(--space-4);border:1px solid var(--color-border);border-radius:var(--radius-xl);background:var(--color-surface);box-shadow:var(--elevation-1) }
.owner-dashboard__greeting-icon{width:44px;height:44px;display:grid;place-items:center;border-radius:var(--radius-lg);color:var(--color-primary);background:var(--color-primary-soft)}
.owner-dashboard__greeting h2 {
  margin: 0;
  overflow: hidden;
  font-size: var(--font-size-xl);
  text-overflow: ellipsis;
  white-space: nowrap;
}
.owner-dashboard__greeting p {
  margin: var(--space-1) 0 0;
  color:var(--color-text-secondary);
  font-size: var(--font-size-sm);
  opacity: 0.9;
}
.owner-dashboard__section {
  display: grid;
  gap: var(--space-3);
}
.owner-dashboard__stats,
.owner-dashboard__loading {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-3);
}
.owner-dashboard__actions {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-2);
}
.owner-dashboard__actions :deep(.app-button) {
  min-width: 0;
  min-height: 68px;
  flex-direction: column;
  padding-inline: var(--space-2);
  color: var(--color-primary);
  font-size: var(--font-size-xs);
}
.owner-dashboard__actions :deep(.owner-dashboard__action--primary){grid-column:1/-1;min-height:54px;flex-direction:row;color:var(--color-text-inverse)}
.owner-dashboard__actions :deep(.app-button span:last-child) {
  overflow: hidden;
  text-overflow: ellipsis;
}
.owner-dashboard__venues,
.owner-dashboard__reviews {
  display: grid;
  gap: var(--space-3);
}
@media (max-width: 350px) {
  .owner-dashboard__stats {
    grid-template-columns: 1fr;
  }
}
</style>
