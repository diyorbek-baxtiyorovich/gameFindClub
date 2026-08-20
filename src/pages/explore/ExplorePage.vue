<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import AppEmptyState from '@/components/feedback/AppEmptyState.vue'
import AppErrorState from '@/components/feedback/AppErrorState.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppSearchInput from '@/components/ui/AppSearchInput.vue'
import AppLucideIcon from '@/components/ui/AppLucideIcon.vue'
import VenueList from '@/components/venue/VenueList.vue'
import { CategorySelector } from '@/entities/category'
import { ActiveFilterList, FilterBottomSheet, ResultCount } from '@/features/filters'
import { useGeolocationStore } from '@/features/geolocation'
import { SortSheet, useSearchStore, useSortStore } from '@/features/search'
import { useFavoritesStore, useFiltersStore, useVenuesStore } from '@/stores'

const router = useRouter()
const filters = useFiltersStore()
const venues = useVenuesStore()
const search = useSearchStore()
const sort = useSortStore()
const geolocation = useGeolocationStore()
const favorites = useFavoritesStore()
const filtersOpen = ref(false)
const sortOpen = ref(false)
let refreshTimer: ReturnType<typeof setTimeout> | undefined

const requestFingerprint = computed(() => JSON.stringify({
  search: search.debouncedQuery,
  categoryId: filters.categoryId,
  filters: filters.serializedParams,
  sort: sort.selected,
}))
const visibleItems = computed(() => venues.items.map((venue) => ({ ...venue, isFavorite: favorites.isFavorite(venue.id) })))

async function refresh(): Promise<void> {
  await venues.loadItems({
    search: search.debouncedQuery || undefined,
    categoryId: filters.categoryId || undefined,
    filters: filters.serializedParams,
    sort: sort.selected,
  })
}

function scheduleRefresh(): void {
  if (refreshTimer) clearTimeout(refreshTimer)
  refreshTimer = setTimeout(refresh, 120)
}

async function requestNearby(): Promise<void> {
  await geolocation.requestLocation()
  if (!geolocation.nearbyQuery) return
  await venues.loadNearby({ ...geolocation.nearbyQuery, radius: filters.radius })
  search.nearbySuggestions = venues.nearby
}

function resetNoResults(): void {
  filters.resetAll()
  search.setQuery('')
  scheduleRefresh()
}

watch(requestFingerprint, scheduleRefresh, { immediate: true })
onBeforeUnmount(() => refreshTimer && clearTimeout(refreshTimer))
</script>

<template>
  <section class="explore-page">
    <AppSearchInput :model-value="search.query" placeholder="Search venues" @update:model-value="search.setQuery" @search="search.commitSearch" />
    <CategorySelector :selected-id="filters.categoryId" include-all @select="filters.setCategory" />

    <div class="explore-page__toolbar">
      <AppButton variant="secondary" @click="filtersOpen = true"><template #leading><AppLucideIcon name="filter" :size="18" /></template>Filtrlar{{ filters.activeFilterCount ? ` (${filters.activeFilterCount})` : '' }}</AppButton>
      <AppButton variant="secondary" @click="sortOpen = true"><template #leading><AppLucideIcon name="sliders" :size="18" /></template>Saralash</AppButton>
      <div class="explore-page__view" aria-label="Result view">
        <AppButton size="sm"><template #leading><AppLucideIcon name="list" :size="18" /></template>List</AppButton>
        <AppButton size="sm" variant="ghost" @click="router.push({ name: 'map' })"><template #leading><AppLucideIcon name="map" :size="18" /></template>Xarita</AppButton>
      </div>
      <AppButton variant="ghost" :loading="geolocation.status === 'requesting'" @click="requestNearby"><template #leading><AppLucideIcon name="locate" :size="18" /></template>Yaqin</AppButton>
    </div>

    <p v-if="geolocation.error" class="explore-page__notice" role="status">Location is unavailable. You can continue without it.</p>
    <ActiveFilterList :filters="filters.activeFilters" @remove="filters.removeFilter" />
    <ResultCount :count="venues.items.length" :loading="venues.loading" />

    <VenueList v-if="venues.loading" :loading="true" card-variant="default" />
    <AppErrorState v-else-if="venues.error" title="Could not load venues" :description="venues.error" @retry="refresh" />
    <AppEmptyState v-else-if="venues.items.length === 0" title="No venues match your search" description="Reset filters and try a broader search." action-label="Reset filters" @action="resetNoResults" />
    <VenueList v-else :items="visibleItems" card-variant="default" @favorite="favorites.toggle($event.id)" />

    <FilterBottomSheet v-model="filtersOpen" :result-count="venues.items.length" />
    <SortSheet v-model="sortOpen" />
  </section>
</template>

<style scoped>
.explore-page { display: grid; gap: var(--space-4); padding-block: var(--space-3); }
.explore-page :deep(.app-search__control) { min-height: 54px; border-radius: var(--radius-lg); }
.explore-page__toolbar { display: flex; flex-wrap: wrap; align-items: center; gap: var(--space-2); }
.explore-page__view { display: flex; margin-left: auto; padding: 3px; border: 1px solid var(--color-border); border-radius: var(--radius-lg); background: var(--color-surface-muted); }
.explore-page__notice { margin: 0; padding: var(--space-3); border-radius: var(--radius-md); color: var(--color-text-secondary); background: var(--color-surface-muted); font-size: var(--font-size-sm); }
@media (max-width: 370px) { .explore-page__view { width: 100%; margin-left: 0; }.explore-page__view > * { flex: 1; } }
</style>
