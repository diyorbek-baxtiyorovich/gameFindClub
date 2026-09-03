<script setup lang="ts">
import AppEmptyState from '@/components/feedback/AppEmptyState.vue'
import AppSkeleton from '@/components/ui/AppSkeleton.vue'
import VenueCard from '@/entities/venue/components/VenueCard.vue'
import type { VenueCardVariant } from '@/entities/venue/components/VenueCard.vue'
import type { VenueListItem } from '@/entities/venue/model/venue'

withDefaults(
  defineProps<{
    items?: readonly VenueListItem[]
    layout?: 'vertical' | 'horizontal'
    cardVariant?: VenueCardVariant
    loading?: boolean
    skeletonCount?: number
    emptyTitle?: string
    emptyDescription?: string
  }>(),
  {
    items: () => [],
    layout: 'vertical',
    cardVariant: 'default',
    loading: false,
    skeletonCount: 3,
    emptyTitle: 'Gaming klublar topilmadi',
    emptyDescription: 'Qidiruv yoki filtrlarni o‘zgartirib ko‘ring.',
  },
)

defineEmits<{ favorite: [venue: VenueListItem]; navigate: [venue: VenueListItem] }>()
</script>

<template>
  <div
    v-if="loading"
    class="venue-list"
    :class="`venue-list--${layout}`"
    aria-label="Gaming klublar yuklanmoqda"
  >
    <div v-for="index in skeletonCount" :key="index" class="venue-list__skeleton">
      <AppSkeleton height="150px" radius="var(--radius-lg)" />
      <AppSkeleton width="70%" height="20px" />
      <AppSkeleton width="45%" height="16px" />
    </div>
  </div>
  <AppEmptyState v-else-if="items.length === 0" :title="emptyTitle" :description="emptyDescription"
    ><slot name="empty"
  /></AppEmptyState>
  <div v-else class="venue-list" :class="`venue-list--${layout}`">
    <VenueCard
      v-for="venue in items"
      :key="venue.id"
      :venue="venue"
      :variant="cardVariant"
      @favorite="$emit('favorite', $event)"
      @navigate="$emit('navigate', $event)"
    />
  </div>
</template>

<style scoped>
.venue-list {
  min-width: 0;
  display: grid;
  gap: var(--space-4);
}
.venue-list--horizontal {
  grid-auto-flow: column;
  grid-auto-columns: min(64vw, 236px);
  overflow-x: auto;
  margin-inline: calc(var(--space-4) * -1);
  padding-inline: var(--space-4);
  padding-bottom: var(--space-2);
  scroll-snap-type: x proximity;
  scrollbar-width: none;
}
.venue-list--horizontal > * {
  scroll-snap-align: start;
}
.venue-list--horizontal::-webkit-scrollbar {
  display: none;
}
.venue-list__skeleton {
  display: grid;
  gap: var(--space-3);
  padding: var(--space-3);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-surface);
}
@media (min-width: 760px) {
  .venue-list:not(.venue-list--horizontal) { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
</style>
