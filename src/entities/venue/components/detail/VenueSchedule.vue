<script setup lang="ts">
import { computed } from 'vue'
import type { OpeningHours, VenueDetail } from '../../model/venue'
import { deriveOperationalStatus } from '../../utils'
import DetailSection from './DetailSection.vue'
const props = defineProps<{ venue: VenueDetail; schedule?: OpeningHours }>()
const status = computed(() => deriveOperationalStatus(props.venue, props.schedule))
const dayLabels: Readonly<Record<string, string>> = { monday: 'Dushanba', tuesday: 'Seshanba', wednesday: 'Chorshanba', thursday: 'Payshanba', friday: 'Juma', saturday: 'Shanba', sunday: 'Yakshanba' }
</script>
<template><DetailSection v-if="schedule" title="Ish vaqti"><p class="schedule__status">{{ status.label }}</p><dl class="schedule__list"><template v-for="day in schedule.weekly" :key="day.day"><dt>{{ dayLabels[day.day] }}</dt><dd>{{ day.isOpen24Hours ? '24 soat' : day.isClosed || !day.periods?.length ? 'Yopiq' : day.periods.map((period) => `${period.opensAt}–${period.closesAt}`).join(', ') }}</dd></template></dl></DetailSection></template>
<style scoped>.schedule__status { margin: 0; color: var(--color-text-secondary); }.schedule__list { display: grid; grid-template-columns: 1fr auto; gap: var(--space-2) var(--space-4); margin: 0; padding: var(--space-3); border: 1px solid var(--color-border); border-radius: var(--radius-md); background: var(--color-surface); }.schedule__list dt { text-transform: capitalize; }.schedule__list dd { margin: 0; color: var(--color-text-secondary); }</style>
