<script setup lang="ts">
import { computed, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'

import AppErrorState from '@/components/feedback/AppErrorState.vue'
import AppLoader from '@/components/ui/AppLoader.vue'
import AppLucideIcon from '@/components/ui/AppLucideIcon.vue'
import { venueListFixtures } from '@/entities/venue'
import { reviewFixtures } from '@/entities/review/model/fixtures'
import CategoryDetailSections from '@/entities/venue/components/detail/CategoryDetailSections.vue'
import StickyVenueCta from '@/entities/venue/components/detail/StickyVenueCta.vue'
import VenueActions from '@/entities/venue/components/detail/VenueActions.vue'
import VenueActivities from '@/entities/venue/components/detail/VenueActivities.vue'
import VenueAmenities from '@/entities/venue/components/detail/VenueAmenities.vue'
import VenueFacilities from '@/entities/venue/components/detail/VenueFacilities.vue'
import VenueGallery from '@/entities/venue/components/detail/VenueGallery.vue'
import VenueHeader from '@/entities/venue/components/detail/VenueHeader.vue'
import VenueLocation from '@/entities/venue/components/detail/VenueLocation.vue'
import VenuePricing from '@/entities/venue/components/detail/VenuePricing.vue'
import VenueQuickFacts from '@/entities/venue/components/detail/VenueQuickFacts.vue'
import VenueReviews from '@/entities/venue/components/detail/VenueReviews.vue'
import VenueSchedule from '@/entities/venue/components/detail/VenueSchedule.vue'
import VenueSimilarList from '@/entities/venue/components/detail/VenueSimilarList.vue'
import type { VenuePrimaryAction } from '@/entities/venue'
import { selectPrimaryVenueAction } from '@/entities/venue'
import { getTelegramService } from '@/services'
import { useFavoritesStore, useHistoryStore, useVenuesStore } from '@/stores'

const props = defineProps<{ slug: string }>()
const router = useRouter()
const venues = useVenuesStore()
const favorites = useFavoritesStore()
const history = useHistoryStore()
const telegram = getTelegramService()

const primaryAction = computed(() => venues.selected ? selectPrimaryVenueAction(venues.selected) : null)
const similar = computed(() => venues.selected ? venueListFixtures.filter((venue) => venue.category.id === venues.selected?.category.id && venue.id !== venues.selected?.id) : [])
const venueReviews = computed(() => venues.selected ? reviewFixtures.filter((review) => review.venueId === venues.selected?.id) : [])

function activate(action: VenuePrimaryAction): void {
  if (!action.url || action.isAvailable === false) return
  if (action.url.startsWith('tel:') && typeof window !== 'undefined') window.location.href = action.url
  else telegram.openLink(action.url)
}

watch(() => props.slug, (slug) => venues.selectBySlug(slug), { immediate: true })
watch(() => venues.selected, (venue) => { if (venue) history.record(venue) })
onUnmounted(() => { venues.cancelPending(); venues.clearSelected() })
</script>

<template>
  <section class="venue-detail-page">
    <AppLoader v-if="venues.loading" label="Loading venue" />
    <AppErrorState v-else-if="venues.error" title="Could not load venue" :description="venues.error" retry-label="Try again" @retry="venues.selectBySlug(slug)" />
    <template v-else-if="venues.selected">
      <div class="venue-detail-page__hero">
        <VenueGallery :venue="venues.selected" />
        <button class="venue-detail-page__hero-action venue-detail-page__back" type="button" aria-label="Orqaga" @click="router.back()"><AppLucideIcon name="arrow-left" :size="27" /></button>
        <button class="venue-detail-page__hero-action venue-detail-page__heart" type="button" :aria-label="favorites.isFavorite(venues.selected.id) ? 'Saqlanganlardan olib tashlash' : 'Saqlash'" :aria-pressed="favorites.isFavorite(venues.selected.id)" @click="favorites.toggle(venues.selected.id)"><AppLucideIcon name="heart" :size="27" :filled="favorites.isFavorite(venues.selected.id)" /></button>
      </div>
      <div class="venue-detail-page__sheet">
        <span class="venue-detail-page__handle" aria-hidden="true" />
        <VenueHeader :venue="venues.selected" />
        <VenueActions :venue="venues.selected" @action="activate" />
        <VenueQuickFacts :venue="venues.selected" />
        <section v-if="venues.selected.description" class="venue-detail-page__summary"><h2>Qisqacha</h2><p>{{ venues.selected.description }}</p></section>
        <VenuePricing :options="venues.selected.pricing" />
        <VenueActivities :items="venues.selected.activities" />
        <CategoryDetailSections :venue="venues.selected" />
        <VenueFacilities :items="venues.selected.facilities" />
        <VenueAmenities :items="venues.selected.amenities" />
        <VenueSchedule :venue="venues.selected" :schedule="venues.selected.openingHours" />
        <VenueLocation :venue="venues.selected" />
        <VenueReviews :venue="venues.selected" :reviews="venueReviews" />
        <VenueSimilarList :items="similar" />
      </div>
      <StickyVenueCta :action="primaryAction" @activate="activate" />
    </template>
    <AppErrorState v-else title="Venue not found" description="This venue may no longer be available." retry-label="" />
  </section>
</template>

<style scoped>
.venue-detail-page { position: relative; margin-inline: calc((var(--space-4) + var(--safe-area-left)) * -1) calc((var(--space-4) + var(--safe-area-right)) * -1); padding-bottom: calc(88px + var(--safe-area-bottom)); }
.venue-detail-page__hero { position: relative; }
.venue-detail-page__hero :deep(.gallery) { border-radius: 0; }
.venue-detail-page__hero :deep(.gallery button) { height: clamp(330px, 92vw, 460px); }
.venue-detail-page__hero-action { position: absolute; z-index: 5; top: calc(var(--space-4) + var(--safe-area-top)); width: 52px; height: 52px; border: 0; border-radius: 50%; color: white; background: rgb(17 24 39 / 35%); backdrop-filter: blur(10px); cursor: pointer; font-size: 2rem; }
.venue-detail-page__back { left: var(--space-4); }
.venue-detail-page__heart { right: var(--space-4); }
.venue-detail-page__sheet { position: relative; z-index: 4; display: grid; gap: var(--space-6); margin-top: -28px; padding: var(--space-5) var(--space-4) var(--space-10); border-radius: 26px 26px 0 0; background: var(--color-bg); }
.venue-detail-page__handle { width: 52px; height: 5px; justify-self: center; margin-top: calc(var(--space-2) * -1); border-radius: var(--radius-pill); background: var(--color-border-strong); }
.venue-detail-page__summary { padding-block: var(--space-5); border-block: 1px solid var(--color-border); }
.venue-detail-page__summary h2 { margin: 0 0 var(--space-3); font-size: var(--font-size-xl); }
.venue-detail-page__summary p { margin: 0; color: var(--color-text-secondary); line-height: 1.7; }
</style>
