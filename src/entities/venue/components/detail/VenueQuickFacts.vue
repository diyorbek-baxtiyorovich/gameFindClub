<script setup lang="ts">
import { computed } from 'vue'
import AppBadge from '@/components/ui/AppBadge.vue'
import AppLucideIcon from '@/components/ui/AppLucideIcon.vue'
import type { VenueDetail } from '../../model/venue'
import { deriveOperationalStatus, formatAvailabilityStatus } from '../../utils'
const props = defineProps<{ venue: VenueDetail }>()
const operational = computed(() => deriveOperationalStatus(props.venue, props.venue.openingHours))
const availability = computed(() => formatAvailabilityStatus(props.venue.occupancy))
</script>
<template><section class="quick-facts" aria-label="Quick facts"><div><AppLucideIcon name="clock" :size="18" /><AppBadge :tone="operational.tone">{{ operational.label }}</AppBadge></div><div v-if="availability"><AppLucideIcon name="gauge" :size="18" /><AppBadge :tone="availability.tone">{{ availability.label }}</AppBadge></div></section></template>
<style scoped>.quick-facts { display: flex; flex-wrap:wrap;gap: var(--space-3); }.quick-facts > div { min-width: 0; display: flex;align-items:center;gap: var(--space-2);color:var(--color-primary) }.quick-facts :deep(.app-badge){font-size:var(--font-size-sm)}</style>
