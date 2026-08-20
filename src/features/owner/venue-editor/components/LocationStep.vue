<script setup lang="ts">
import { computed } from 'vue'

import AppButton from '@/components/ui/AppButton.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppLucideIcon from '@/components/ui/AppLucideIcon.vue'
import type { GeoPoint } from '@/entities/venue'
import { useGeolocationStore } from '@/features/geolocation'
import UserLocationMarker from '@/features/map/components/UserLocationMarker.vue'
import VenueMap from '@/features/map/components/VenueMap.vue'
import { validateLocation, type VenueEditorDraft } from '@/features/owner/venue-editor'
import { t } from '@/i18n'
import { useOwnerVenueDraftStore } from '@/stores'

const props = defineProps<{ draft: VenueEditorDraft }>()
const draftStore = useOwnerVenueDraftStore()
const geolocation = useGeolocationStore()
const fallbackCenter: GeoPoint = { latitude: 41.3111, longitude: 69.2797 }
const selectedPoint = computed<GeoPoint | null>(() => {
  const { latitude, longitude } = props.draft.coordinates
  return latitude == null || longitude == null ? null : { latitude, longitude }
})
const mapCenter = computed(() => selectedPoint.value ?? geolocation.coordinates ?? fallbackCenter)
const validation = computed(() => validateLocation(props.draft))
const locationError = computed(() => {
  if (geolocation.status === 'denied') return t('owner.editor.location.permission_denied')
  if (geolocation.status === 'unavailable' || geolocation.status === 'error') return t('owner.editor.location.unavailable')
  return null
})

async function useCurrentLocation(): Promise<void> {
  await geolocation.requestLocation()
  if (geolocation.coordinates) draftStore.setCoordinates(geolocation.coordinates)
}

function selectPoint(point: GeoPoint): void {
  draftStore.setCoordinates(point)
}

function updateCoordinate(key: 'latitude' | 'longitude', value: string): void {
  const trimmed = value.trim()
  if (!trimmed) {
    draftStore.setCoordinates({ [key]: undefined })
    return
  }
  const parsed = Number(trimmed)
  const withinRange = key === 'latitude' ? parsed >= -90 && parsed <= 90 : parsed >= -180 && parsed <= 180
  if (Number.isFinite(parsed) && withinRange) draftStore.setCoordinates({ [key]: parsed })
}
</script>

<template>
  <div class="location-step">
    <AppButton variant="secondary" :loading="geolocation.status === 'requesting'" @click="useCurrentLocation">
      <template #leading><AppLucideIcon name="locate" /></template>
      {{ t('owner.editor.location.use_current') }}
    </AppButton>
    <p v-if="locationError" class="location-step__notice" role="status">{{ locationError }} {{ t('owner.editor.location.manual_available') }}</p>

    <div class="location-step__map">
      <VenueMap :center="mapCenter" :zoom="selectedPoint ? 15 : 12" selectable @point-select="selectPoint">
        <UserLocationMarker :point="selectedPoint" />
      </VenueMap>
      <small>{{ t('owner.editor.location.map_hint') }}</small>
    </div>

    <div class="location-step__address">
      <AppInput :model-value="draft.address.formatted" :label="t('owner.editor.location.address')" :placeholder="t('owner.editor.location.address_placeholder')" :error="validation.address ? t(validation.address) : undefined" required @update:model-value="draftStore.setAddress({ formatted: $event })" />
      <AppInput :model-value="draft.address.city" :label="t('owner.editor.location.city')" @update:model-value="draftStore.setAddress({ city: $event })" />
      <AppInput :model-value="draft.address.district" :label="t('owner.editor.location.district')" @update:model-value="draftStore.setAddress({ district: $event })" />
    </div>

    <div class="location-step__coordinates">
      <AppInput :model-value="draft.coordinates.latitude?.toString() ?? ''" type="number" :label="t('owner.editor.location.latitude')" :error="validation.latitude ? t(validation.latitude) : undefined" :min="-90" :max="90" :step="0.000001" required @update:model-value="updateCoordinate('latitude', $event)" />
      <AppInput :model-value="draft.coordinates.longitude?.toString() ?? ''" type="number" :label="t('owner.editor.location.longitude')" :error="validation.longitude ? t(validation.longitude) : undefined" :min="-180" :max="180" :step="0.000001" required @update:model-value="updateCoordinate('longitude', $event)" />
    </div>
  </div>
</template>

<style scoped>
.location-step { display: grid; gap: var(--space-5); }
.location-step > :deep(.app-button) { justify-self: start; }
.location-step__notice { margin: calc(var(--space-3) * -1) 0 0; color: var(--color-warning); }
.location-step__map { display: grid; gap: var(--space-2); overflow: hidden; border-radius: var(--radius-lg); }
.location-step__map :deep(.venue-map), .location-step__map :deep(.venue-map__canvas) { min-height: 300px; }
.location-step__map small { color: var(--color-text-secondary); }
.location-step__address { display: grid; gap: var(--space-4); }
.location-step__coordinates { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--space-3); }
@media (max-width: 350px) { .location-step__coordinates { grid-template-columns: 1fr; } }
</style>
