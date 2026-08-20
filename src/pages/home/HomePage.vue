<script setup lang="ts">
import { useRouter } from 'vue-router'

import AppSearchInput from '@/components/ui/AppSearchInput.vue'
import AppIconButton from '@/components/ui/AppIconButton.vue'
import AppLucideIcon from '@/components/ui/AppLucideIcon.vue'
import VenueRail from '@/components/venue/VenueRail.vue'
import { CategorySelector } from '@/entities/category'
import { LocationSelector } from '@/features/geolocation'
import { useSearchStore } from '@/features/search'
import { useFiltersStore } from '@/stores'
import { useFavoritesStore, useHistoryStore } from '@/stores'
import type { VenueListItem } from '@/entities/venue'

import { homeFixtureData } from './home.data'

const router = useRouter()
const search = useSearchStore()
const filters = useFiltersStore()
const favorites = useFavoritesStore()
const history = useHistoryStore()
const cities = [
  { value: 'Tashkent', label: 'Tashkent' },
  { value: 'Samarkand', label: 'Samarkand' },
  { value: 'Bukhara', label: 'Bukhara' },
]

function openExplore(): void {
  search.commitSearch()
  void router.push({ name: 'explore' })
}

function selectCategory(categoryId: string | null): void {
  filters.setCategory(categoryId)
  void router.push({ name: 'explore' })
}

const withFavoriteState = (items: readonly VenueListItem[]): readonly VenueListItem[] => items.map((venue) => ({ ...venue, isFavorite: favorites.isFavorite(venue.id) }))
</script>

<template>
  <div class="home-page">
    <LocationSelector :cities="cities" />
    <div class="home-page__search">
      <AppSearchInput :model-value="search.query" placeholder="Joy yoki faoliyatni qidiring" @update:model-value="search.setQuery" @search="openExplore" />
      <AppIconButton class="home-page__filter" label="Filtrlarni ochish" @click="router.push({ name: 'explore' })"><AppLucideIcon name="sliders" /></AppIconButton>
    </div>

    <CategorySelector :selected-id="filters.categoryId" @select="selectCategory" />

    <VenueRail title="Yaqiningizda" :items="withFavoriteState(homeFixtureData.nearby)" action-label="Barchasi" @action="router.push({ name: 'explore' })" @favorite="favorites.toggle($event.id)" />
    <VenueRail title="Siz uchun" layout="vertical" card-variant="horizontal" :items="withFavoriteState(homeFixtureData.recommended)" @favorite="favorites.toggle($event.id)" />
    <VenueRail title="Maxsus to‘plamlar" layout="vertical" card-variant="horizontal" :items="withFavoriteState(homeFixtureData.specialCollections)" @favorite="favorites.toggle($event.id)" />
    <VenueRail title="Yaqinda ko‘rilgan" layout="vertical" card-variant="horizontal" :items="withFavoriteState(history.items.length ? history.items : homeFixtureData.recentlyViewed)" @favorite="favorites.toggle($event.id)" />
  </div>
</template>

<style scoped>
.home-page { display: grid; gap: var(--space-6); padding-bottom: var(--space-4); }
.home-page__search { position: relative; margin-top: var(--space-3); }
.home-page__search :deep(.app-search__control) { min-height: 52px; padding-right: 58px; border-radius: var(--radius-lg); background: var(--color-surface-muted); }
.home-page__filter { position: absolute; z-index: 2; top: 4px; right: 4px; color: var(--color-text-inverse); background: var(--color-primary); }
</style>
