<script setup lang="ts">
import SectionHeader from '@/components/layout/SectionHeader.vue'
import type { VenueListItem } from '@/entities/venue/model/venue'

import VenueList from './VenueList.vue'

withDefaults(
  defineProps<{
    title: string
    description?: string
    items?: readonly VenueListItem[]
    loading?: boolean
    actionLabel?: string
    layout?: 'vertical' | 'horizontal'
    cardVariant?: 'default' | 'compact' | 'horizontal' | 'map-preview' | 'featured'
  }>(),
  { items: () => [], loading: false, layout: 'horizontal', cardVariant: 'compact' },
)
defineEmits<{ action: []; favorite: [venue: VenueListItem]; navigate: [venue: VenueListItem] }>()
</script>

<template>
  <section class="venue-rail">
    <SectionHeader
      :title="title"
      :description="description"
      :action-label="actionLabel"
      @action="$emit('action')"
    />
    <VenueList
      :items="items"
      :layout="layout"
      :card-variant="cardVariant"
      :loading="loading"
      @favorite="$emit('favorite', $event)"
      @navigate="$emit('navigate', $event)"
    />
  </section>
</template>

<style scoped>
.venue-rail {
  display: grid;
  gap: var(--space-3);
}
</style>
