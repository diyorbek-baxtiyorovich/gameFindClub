<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import AppButton from '@/components/ui/AppButton.vue'
import AppIconButton from '@/components/ui/AppIconButton.vue'
import AppSearchInput from '@/components/ui/AppSearchInput.vue'
import AppLucideIcon from '@/components/ui/AppLucideIcon.vue'
import { CategorySelector } from '@/entities/category'
import { venueListFixtures } from '@/entities/venue'
import type { VenueListItem } from '@/entities/venue'
import { FilterBottomSheet } from '@/features/filters'
import { useGeolocationStore } from '@/features/geolocation'
import {
  MapFloatingControls,
  UserLocationMarker,
  VenueCluster,
  VenueMap,
  VenueMapPreviewCard,
  VenueMarker,
  useMapStore,
} from '@/features/map'
import type { MapViewport } from '@/features/map'
import { useFavoritesStore, useFiltersStore } from '@/stores'
import { useSearchStore } from '@/features/search'
import { t } from '@/i18n'

const mapState = useMapStore()
const filters = useFiltersStore()
const location = useGeolocationStore()
const favorites = useFavoritesStore()
const search = useSearchStore()
const localFiltersOpen = ref(false)

const mapCenter = computed(() => location.coordinates ?? { latitude: 41.3111, longitude: 69.2797 })
const sourceItems = computed(() => mapState.hasSearched ? mapState.items : venueListFixtures)
const displayedVenues = computed(() => sourceItems.value.filter((venue) => {
  const categoryMatches = !filters.categoryId || venue.category.id === filters.categoryId
  const query = search.query.trim().toLowerCase()
  const searchMatches = !query || venue.name.toLowerCase().includes(query) || venue.address?.formatted.toLowerCase().includes(query)
  return categoryMatches && searchMatches
}))
const selectedVenue = computed(() => {
  const venue = displayedVenues.value.find((item) => item.id === mapState.selectedId)
  return venue ? { ...venue, isFavorite: favorites.isFavorite(venue.id) } : null
})

function updateViewport(viewport: MapViewport): void {
  mapState.updateViewport(viewport)
}

async function searchCurrentArea(): Promise<void> {
  await mapState.searchVisibleBounds({ categoryId: filters.categoryId || undefined, filters: filters.serializedParams })
}

async function selectCategory(categoryId: string | null): Promise<void> {
  filters.setCategory(categoryId)
  mapState.selectVenue(null)
  if (mapState.hasSearched) await searchCurrentArea()
}

async function useCurrentLocation(): Promise<void> {
  await location.requestLocation()
}

function selectVenue(venue: VenueListItem): void {
  mapState.selectVenue(venue.id)
}

watch(displayedVenues, (venues) => {
  if (mapState.selectedId && !venues.some((venue) => venue.id === mapState.selectedId)) mapState.selectVenue(null)
})
</script>

<template>
  <section class="map-page">
    <div class="map-page__top">
      <div class="map-page__search">
        <AppSearchInput :model-value="search.query" :placeholder="t('home.search')" @update:model-value="search.setQuery" />
        <AppIconButton :label="t('search.filters')" @click="localFiltersOpen = true"><AppLucideIcon name="sliders" /></AppIconButton>
      </div>
      <div class="map-page__categories"><CategorySelector :selected-id="filters.categoryId" include-all @select="selectCategory" /></div>
    </div>
    <VenueMap :center="mapCenter" @viewport-change="updateViewport">
      <VenueCluster>
        <VenueMarker
          v-for="(venue, index) in displayedVenues"
          :key="venue.id"
          :venue="venue"
          :selected="mapState.selectedId === venue.id"
          :featured="index === 0"
          :unavailable="venue.operatingStatus?.isOpen === false"
          @select="selectVenue"
        />
      </VenueCluster>
      <UserLocationMarker :point="location.coordinates" />

      <MapFloatingControls>
        <template #right>
          <AppIconButton :label="t('search.filters')" @click="localFiltersOpen = true"><AppLucideIcon name="filter" /></AppIconButton>
          <AppIconButton :label="t('map.current_location')" :loading="location.status === 'requesting'" @click="useCurrentLocation"><AppLucideIcon name="locate" /></AppIconButton>
        </template>
      </MapFloatingControls>
    </VenueMap>

    <AppButton v-if="mapState.viewportDirty" class="map-page__search-area" :loading="mapState.loading" @click="searchCurrentArea">{{ t('map.search_area') }}</AppButton>

    <p v-if="mapState.error" class="map-page__message" role="alert">{{ mapState.error }}</p>
    <p v-else-if="mapState.hasSearched && displayedVenues.length === 0" class="map-page__message" role="status">{{ t('map.empty') }}</p>

    <aside v-if="selectedVenue" class="map-page__preview" :aria-label="t('map.selected')">
      <span class="map-page__handle" aria-hidden="true" />
      <button type="button" class="map-page__preview-close" :aria-label="t('common.close')" @click="mapState.selectVenue(null)"><AppLucideIcon name="x" /></button>
      <VenueMapPreviewCard :venue="selectedVenue" @favorite="favorites.toggle($event.id)" />
    </aside>
    <FilterBottomSheet v-model="localFiltersOpen" :result-count="displayedVenues.length" @apply="searchCurrentArea" />
  </section>
</template>

<style scoped>
.map-page { position: relative; height: calc(100vh - 84px - var(--safe-area-top) - var(--safe-area-bottom)); height: calc(100dvh - 84px - var(--safe-area-top) - var(--safe-area-bottom)); min-height: min(420px, calc(100dvh - 84px)); margin: 0 calc((var(--space-4) + var(--safe-area-right)) * -1) calc((var(--space-5) + var(--safe-area-bottom)) * -1) calc((var(--space-4) + var(--safe-area-left)) * -1); overflow: hidden; }
.map-page__top { position:absolute;z-index:650;top:var(--space-3);right:var(--space-3);left:var(--space-3);display:grid;gap:var(--space-3);pointer-events:none }
.map-page__search { display:grid;grid-template-columns:minmax(0,1fr) 48px;gap:var(--space-2);padding:var(--space-2);border:1px solid var(--color-border);border-radius:var(--radius-xl);background:color-mix(in srgb,var(--color-surface) 96%,transparent);box-shadow:var(--elevation-2);backdrop-filter:blur(12px);pointer-events:auto }
.map-page__search > *{min-width:0}
.map-page__search :deep(.app-search){min-width:0}
.map-page__search :deep(.app-search__control){border:0;background:transparent}
.map-page__categories { max-width: 100%; padding: var(--space-1) 0;pointer-events:auto }
.map-page__search-area{position:absolute;z-index:620;top:150px;left:50%;transform:translateX(-50%);white-space:nowrap;box-shadow:var(--elevation-2)}
.map-page__message { position: absolute; z-index: 550; top: 72px; right: var(--space-4); left: var(--space-4); margin: 0; padding: var(--space-3); border: 1px solid var(--color-border); border-radius: var(--radius-md); color: var(--color-text-secondary); background: var(--color-surface); box-shadow: var(--elevation-1); text-align: center; font-size: var(--font-size-sm); }
.map-page__preview{position:absolute;z-index:650;right:var(--space-3);bottom:var(--space-3);left:var(--space-3);padding:var(--space-4) var(--space-3) var(--space-3);border:1px solid var(--color-border);border-radius:var(--radius-xl);background:var(--color-surface);box-shadow:var(--elevation-2)}
.map-page__preview :deep(.venue-card){border:0;box-shadow:none}
.map-page__handle{position:absolute;top:7px;left:50%;width:44px;height:4px;transform:translateX(-50%);border-radius:var(--radius-pill);background:var(--color-border-strong)}
.map-page__preview-close{position:absolute;z-index:5;top:var(--space-2);right:var(--space-2);width:var(--touch-target-min);height:var(--touch-target-min);border:0;border-radius:50%;color:var(--color-text-secondary);background:var(--color-surface-muted);cursor:pointer;font-size:1.3rem}
</style>
