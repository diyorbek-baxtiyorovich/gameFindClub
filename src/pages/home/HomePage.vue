<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'

import AppButton from '@/components/ui/AppButton.vue'
import AppIconButton from '@/components/ui/AppIconButton.vue'
import AppLucideIcon from '@/components/ui/AppLucideIcon.vue'
import AppSearchInput from '@/components/ui/AppSearchInput.vue'
import VenueRail from '@/components/venue/VenueRail.vue'
import { CategorySelector } from '@/entities/category'
import type { VenueListItem } from '@/entities/venue'
import { LocationSelector } from '@/features/geolocation'
import { useSearchStore } from '@/features/search'
import { getTelegramService } from '@/services'
import { useFavoritesStore, useFiltersStore, useHistoryStore } from '@/stores'

import { homeFixtureData } from './home.data'

const router = useRouter()
const search = useSearchStore()
const filters = useFiltersStore()
const favorites = useFavoritesStore()
const history = useHistoryStore()
const telegram = getTelegramService()
const firstName = computed(() => telegram.user?.first_name || 'Gamer')
const initials = computed(() => firstName.value.slice(0, 2).toUpperCase())
const availableStations = computed(() => homeFixtureData.nearby.reduce((total, club) => total + (club.occupancy?.availableCount ?? 0), 0))
const cities = [{ value: 'Tashkent', label: 'Toshkent' }, { value: 'Samarkand', label: 'Samarqand' }, { value: 'Bukhara', label: 'Buxoro' }]

function openExplore(): void {
  search.commitSearch()
  void router.push({ name: 'explore' })
}
function selectCategory(categoryId: string | null): void {
  filters.setCategory(categoryId)
  void router.push({ name: 'explore' })
}
const withFavoriteState = (items: readonly VenueListItem[]) => items.map((club) => ({ ...club, isFavorite: favorites.isFavorite(club.id) }))
</script>

<template>
  <div class="home-page">
    <header class="home-header">
      <span class="home-header__avatar">{{ initials }}</span>
      <div><small>Xush kelibsiz</small><strong>{{ firstName }}</strong></div>
      <LocationSelector :cities="cities" />
      <AppIconButton label="Bildirishnomalar"><AppLucideIcon name="bell" /></AppIconButton>
    </header>

    <section class="gaming-hero">
      <img src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1400&q=88" alt="Zamonaviy esports gaming arena" />
      <div class="gaming-hero__overlay" />
      <div class="gaming-hero__content">
        <span class="gaming-hero__eyebrow"><i aria-hidden="true" /> LIVE AVAILABILITY</span>
        <h1>Keyingi gaming arenangizni toping</h1>
        <p>Eng kuchli PC, PlayStation, VR va private xonalarni bir joydan toping.</p>
        <div class="gaming-hero__search"><AppSearchInput :model-value="search.query" placeholder="Klub, o‘yin yoki qurilma qidiring" @update:model-value="search.setQuery" @search="openExplore" /></div>
        <div class="gaming-hero__actions">
          <AppButton @click="openExplore">Klublarni ko‘rish <template #trailing><AppLucideIcon name="chevron-right" :size="18" /></template></AppButton>
          <span><strong>{{ availableStations }}</strong> ta yaqin joy hozir bo‘sh</span>
        </div>
      </div>
    </section>

    <section class="home-categories"><h2>Gaming turi</h2><CategorySelector :selected-id="filters.categoryId" @select="selectCategory" /></section>
    <VenueRail title="Yaqiningizda bo‘sh joylar" :items="withFavoriteState(homeFixtureData.nearby)" action-label="Barchasi" @action="router.push({ name: 'explore' })" @favorite="favorites.toggle($event.id)" />
    <VenueRail title="Mashhur gaming klublar" layout="vertical" card-variant="horizontal" :items="withFavoriteState(homeFixtureData.popular)" @favorite="favorites.toggle($event.id)" />
    <VenueRail title="Eng kuchli PC qurilmalari" :items="withFavoriteState(homeFixtureData.bestHardware)" @favorite="favorites.toggle($event.id)" />
    <VenueRail title="Tun bo‘yi ochiq" layout="vertical" card-variant="horizontal" :items="withFavoriteState(homeFixtureData.openAllNight)" @favorite="favorites.toggle($event.id)" />
    <VenueRail title="Turnirga tayyor klublar" :items="withFavoriteState(homeFixtureData.tournamentReady)" @favorite="favorites.toggle($event.id)" />
    <VenueRail title="Yaqinda ko‘rilgan" layout="vertical" card-variant="horizontal" :items="withFavoriteState(history.items.length ? history.items : homeFixtureData.recentlyViewed)" @favorite="favorites.toggle($event.id)" />
  </div>
</template>

<style scoped>
.home-page { display:grid;gap:var(--space-8);padding-bottom:var(--space-4) }
.home-header { min-height:68px;display:grid;grid-template-columns:44px minmax(0,1fr) auto 44px;align-items:center;gap:var(--space-3) }
.home-header__avatar { width:44px;height:44px;display:grid;place-items:center;border:1px solid var(--color-border-strong);border-radius:50%;color:white;background:linear-gradient(145deg,var(--color-primary),var(--color-secondary));font-weight:var(--font-weight-bold) }
.home-header div { display:grid;min-width:0 }.home-header small { color:var(--color-text-secondary);font-size:var(--font-size-xs) }.home-header strong { overflow:hidden;text-overflow:ellipsis;white-space:nowrap }
.home-header :deep(.location-selector__trigger) { max-width:180px }
.gaming-hero { position:relative;min-height:470px;display:flex;align-items:flex-end;overflow:hidden;border:1px solid var(--color-border);border-radius:var(--radius-xl);background:#07080d;box-shadow:var(--elevation-2) }
.gaming-hero>img,.gaming-hero__overlay { position:absolute;inset:0;width:100%;height:100% }.gaming-hero>img { object-fit:cover }.gaming-hero__overlay { background:linear-gradient(180deg,rgb(7 8 13 / 20%),rgb(7 8 13 / 86%) 58%,#07080d) }
.gaming-hero__content { position:relative;z-index:2;width:min(680px,100%);display:grid;gap:var(--space-4);padding:clamp(24px,6vw,52px) }
.gaming-hero__eyebrow { display:flex;align-items:center;gap:8px;color:var(--color-secondary);font-size:11px;font-weight:var(--font-weight-bold);letter-spacing:.13em }.gaming-hero__eyebrow i { width:8px;height:8px;border-radius:50%;background:var(--color-success);box-shadow:0 0 12px var(--color-success) }
.gaming-hero h1 { max-width:620px;margin:0;font-size:clamp(2rem,8vw,4.3rem);line-height:.98;letter-spacing:-.045em }.gaming-hero p { max-width:560px;margin:0;color:#cbd5e1 }
.gaming-hero__search :deep(.app-search__control) { min-height:56px;border-color:rgb(255 255 255 / 14%);background:rgb(16 18 26 / 88%);backdrop-filter:blur(12px) }
.gaming-hero__actions { display:flex;align-items:center;gap:var(--space-4);flex-wrap:wrap }.gaming-hero__actions>span { color:#cbd5e1;font-size:var(--font-size-sm) }.gaming-hero__actions strong { color:var(--color-success) }
.home-categories { display:grid;gap:var(--space-3) }.home-categories h2 { margin:0;font-size:var(--font-size-xl) }
@media (max-width:620px) { .home-header { grid-template-columns:44px minmax(0,1fr) 44px }.home-header :deep(.location-selector) { grid-column:1/-1;grid-row:2 }.gaming-hero { min-height:520px;margin-inline:calc(var(--space-4) * -1);border-radius:0 }.gaming-hero__content { padding:var(--space-6) var(--space-4) }.gaming-hero__actions { align-items:stretch;flex-direction:column }.gaming-hero__actions :deep(.app-button) { width:100% } }
</style>
