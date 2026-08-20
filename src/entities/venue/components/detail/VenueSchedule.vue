<script setup lang="ts">
import { computed } from 'vue'
import type { OpeningHours, VenueDetail } from '../../model/venue'
import { deriveOperationalStatus } from '../../utils'
import DetailSection from './DetailSection.vue'
import { t, type MessageKey } from '@/i18n'
const props = defineProps<{ venue: VenueDetail; schedule?: OpeningHours }>()
const status = computed(() => deriveOperationalStatus(props.venue, props.schedule))
const dayLabel = (day: string): string => t(`weekday.${day}` as MessageKey)
</script>
<template><DetailSection v-if="schedule" :title="t('venue.schedule')"><p class="schedule__status">{{ status.label }}</p><dl class="schedule__list"><template v-for="day in schedule.weekly" :key="day.day"><dt>{{ dayLabel(day.day) }}</dt><dd>{{ day.isOpen24Hours ? t('venue.open_24_hours') : day.isClosed || !day.periods?.length ? t('venue.closed') : day.periods.map((period) => `${period.opensAt}–${period.closesAt}`).join(', ') }}</dd></template></dl></DetailSection></template>
<style scoped>.schedule__status { margin: 0; color: var(--color-text-secondary); }.schedule__list { display: grid; grid-template-columns: 1fr auto; gap: var(--space-2) var(--space-4); margin: 0; padding: var(--space-3); border: 1px solid var(--color-border); border-radius: var(--radius-md); background: var(--color-surface); }.schedule__list dt { text-transform: capitalize; }.schedule__list dd { margin: 0; color: var(--color-text-secondary); }</style>
