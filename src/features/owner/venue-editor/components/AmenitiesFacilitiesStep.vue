<script setup lang="ts">
import AppChip from '@/components/ui/AppChip.vue'
import { UNIVERSAL_AMENITY_OPTIONS, UNIVERSAL_FACILITY_OPTIONS } from '@/config'
import type { VenueEditorDraft } from '@/features/owner/venue-editor'
import { t, type MessageKey } from '@/i18n'
import { useOwnerVenueDraftStore } from '@/stores'

const props = defineProps<{ draft: VenueEditorDraft }>()
const draftStore = useOwnerVenueDraftStore()

const label = (labelKey: string, fallback: string): string => {
  const translated = t(labelKey as MessageKey)
  return translated === labelKey ? fallback : translated
}

function toggleAmenity(id: string, name: string): void {
  const selected = props.draft.amenities.some((item) => item.id === id)
  draftStore.setAmenities(selected
    ? props.draft.amenities.filter((item) => item.id !== id)
    : [...props.draft.amenities, { id, name }])
}

function toggleFacility(id: string, name: string): void {
  const selected = props.draft.facilities.some((item) => item.id === id)
  draftStore.setFacilities(selected
    ? props.draft.facilities.filter((item) => item.id !== id)
    : [...props.draft.facilities, { id, name }])
}
</script>

<template>
  <div class="amenities-step">
    <section>
      <h3>{{ t('owner.editor.amenities.title') }}</h3>
      <p>{{ t('owner.editor.amenities.description') }}</p>
      <div class="amenities-step__chips">
        <AppChip v-for="option in UNIVERSAL_AMENITY_OPTIONS" :key="option.id" :selected="draft.amenities.some((item) => item.id === option.id)" @click="toggleAmenity(option.id, label(option.labelKey, option.defaultLabel))">{{ label(option.labelKey, option.defaultLabel) }}</AppChip>
      </div>
    </section>
    <section>
      <h3>{{ t('owner.editor.facilities.title') }}</h3>
      <p>{{ t('owner.editor.facilities.description') }}</p>
      <div class="amenities-step__chips">
        <AppChip v-for="option in UNIVERSAL_FACILITY_OPTIONS" :key="option.id" :selected="draft.facilities.some((item) => item.id === option.id)" @click="toggleFacility(option.id, label(option.labelKey, option.defaultLabel))">{{ label(option.labelKey, option.defaultLabel) }}</AppChip>
      </div>
    </section>
  </div>
</template>

<style scoped>
.amenities-step { display: grid; gap: var(--space-8); }
.amenities-step section { display: grid; gap: var(--space-3); }
.amenities-step h3, .amenities-step p { margin: 0; }
.amenities-step p { color: var(--color-text-secondary); }
.amenities-step__chips { display: flex; flex-wrap: wrap; gap: var(--space-2); }
</style>
