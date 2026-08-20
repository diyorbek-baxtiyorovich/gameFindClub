<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import AppBadge from '@/components/ui/AppBadge.vue'
import AppIconButton from '@/components/ui/AppIconButton.vue'
import AppLucideIcon from '@/components/ui/AppLucideIcon.vue'
import type { VenueListItem } from '@/entities/venue/model/venue'
import {
  formatDistance,
  formatOperatingStatus,
  formatPrice,
  formatRating,
  getVenueCategory,
  getVenueHighlights,
  getVenueImage,
} from '@/entities/venue/utils'

export type VenueCardVariant = 'default' | 'compact' | 'horizontal' | 'map-preview' | 'featured'

const props = withDefaults(
  defineProps<{
    venue: VenueListItem
    variant?: VenueCardVariant
    showFavorite?: boolean
  }>(),
  { variant: 'default', showFavorite: true },
)

defineEmits<{
  favorite: [venue: VenueListItem]
  navigate: [venue: VenueListItem]
}>()

const imageFailed = ref(false)
const category = computed(() => getVenueCategory(props.venue))
const imageUrl = computed(() =>
  imageFailed.value
    ? getVenueImage({ ...props.venue, coverMedia: undefined })
    : getVenueImage(props.venue),
)
const rating = computed(() => formatRating(props.venue.rating))
const distance = computed(() => formatDistance(props.venue.distanceMeters))
const price = computed(() => formatPrice(props.venue.priceFrom))
const status = computed(() => formatOperatingStatus(props.venue.operatingStatus))
const area = computed(() => props.venue.address?.district || props.venue.address?.city)
const highlights = computed(() => getVenueHighlights(props.venue))
const detailRoute = computed(() => ({ name: 'venue-detail', params: { slug: props.venue.slug } }))

watch(
  () => props.venue.coverMedia?.url,
  () => {
    imageFailed.value = false
  },
)
</script>

<template>
  <article class="venue-card" :class="`venue-card--${variant}`" :data-accent="category.accent">
    <RouterLink
      class="venue-card__media"
      :to="detailRoute"
      :aria-label="`View ${venue.name}`"
      @click="$emit('navigate', venue)"
    >
      <img
        v-if="imageUrl"
        :src="imageUrl"
        :alt="venue.coverMedia?.alt || ''"
        :width="venue.coverMedia?.width"
        :height="venue.coverMedia?.height"
        loading="lazy"
        decoding="async"
        @error="imageFailed = true"
      />
      <span v-else class="venue-card__placeholder" aria-hidden="true">{{
        category.icon.slice(0, 1).toUpperCase()
      }}</span>
      <AppBadge
        v-if="variant === 'compact' || variant === 'default'"
        class="venue-card__category-badge"
        tone="primary"
        >{{ category.label.defaultValue }}</AppBadge
      >
      <AppBadge v-if="variant === 'featured'" class="venue-card__featured" tone="primary"
        >Featured</AppBadge
      >
    </RouterLink>

    <div class="venue-card__body">
      <div class="venue-card__heading">
        <div class="venue-card__title-wrap">
          <span class="venue-card__category">{{ category.label.defaultValue }}</span>
          <RouterLink
            class="venue-card__title"
            :to="detailRoute"
            @click="$emit('navigate', venue)"
            >{{ venue.name }}</RouterLink
          >
        </div>
        <AppIconButton
          v-if="showFavorite"
          class="venue-card__favorite"
          variant="ghost"
          :label="venue.isFavorite ? `Remove ${venue.name} from saved` : `Save ${venue.name}`"
          @click="$emit('favorite', venue)"
        >
          <AppLucideIcon name="heart" :size="21" :filled="venue.isFavorite" />
        </AppIconButton>
      </div>

      <div v-if="rating || area || distance" class="venue-card__meta">
        <span v-if="rating" aria-label="Rating"
          ><AppLucideIcon name="star" :size="15" filled /> {{ rating }}</span
        >
        <span v-if="area"><AppLucideIcon name="map-pin" :size="15" /> {{ area }}</span>
        <span v-if="distance">{{ distance }}</span>
      </div>

      <ul v-if="highlights.length" class="venue-card__highlights" aria-label="Venue highlights">
        <li v-for="highlight in highlights" :key="highlight">{{ highlight }}</li>
      </ul>

      <div v-if="price || status" class="venue-card__footer">
        <p v-if="price" class="venue-card__price"><span>From</span> {{ price }}</p>
        <span
          v-if="status"
          class="venue-card__status"
          :class="{ 'venue-card__closed': venue.operatingStatus && !venue.operatingStatus.isOpen }"
          >{{ status }}</span
        >
      </div>
    </div>
  </article>
</template>

<style scoped>
.venue-card {
  --venue-accent: var(--color-accent-neutral);
  position: relative;
  min-width: 0;
  overflow: hidden;
  border: 1px solid var(--color-border);
  border-radius: 14px;
  color: var(--color-text-primary);
  background: var(--color-surface);
  box-shadow: var(--elevation-1);
}
.venue-card[data-accent='gaming'] {
  --venue-accent: var(--color-accent-gaming);
}
.venue-card[data-accent='tennis'] {
  --venue-accent: var(--color-accent-tennis);
}
.venue-card[data-accent='football'] {
  --venue-accent: var(--color-accent-football);
}
.venue-card[data-accent='gym'] {
  --venue-accent: var(--color-accent-gym);
}
.venue-card__media {
  position: relative;
  display: block;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  color: var(--color-text-inverse);
  background: var(--color-surface-muted);
  text-decoration: none;
}
.venue-card__media img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}
.venue-card__placeholder {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  color: var(--venue-accent);
  background: color-mix(in srgb, var(--venue-accent) 14%, var(--color-surface-muted));
  font-size: 2rem;
  font-weight: var(--font-weight-bold);
}
.venue-card__featured,
.venue-card__category-badge {
  position: absolute;
  top: var(--space-3);
  right: var(--space-3);
  z-index: 2;
  border-color: rgb(255 255 255 / 24%);
  color: #fff;
  background: rgb(15 23 42 / 72%);
  box-shadow: 0 4px 12px rgb(0 0 0 / 18%);
  backdrop-filter: blur(8px);
  text-transform: uppercase;
}
.venue-card__body {
  display: grid;
  gap: var(--space-2);
  padding: var(--space-4);
}
.venue-card__heading {
  display: flex;
  align-items: flex-start;
  gap: var(--space-2);
}
.venue-card__title-wrap {
  min-width: 0;
  flex: 1;
}
.venue-card__category {
  display: block;
  margin-bottom: var(--space-1);
  color: var(--venue-accent);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.venue-card__title {
  display: -webkit-box;
  overflow: hidden;
  color: inherit;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
  text-decoration: none;
  overflow-wrap: anywhere;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
.venue-card__favorite {
  margin: calc(var(--space-2) * -1);
}
.venue-card__meta {
  min-width: 0;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  gap: var(--space-2);
  overflow: hidden;
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
}
.venue-card__meta span {
  min-width: 0;
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  white-space: nowrap;
}
.venue-card__meta span:not(:first-child) {
  overflow: hidden;
  text-overflow: ellipsis;
}
.venue-card__meta span:first-child {
  color: #a85c00;
  font-weight: var(--font-weight-semibold);
}
.venue-card__meta .venue-card__closed {
  color: var(--color-danger);
}
.venue-card__highlights {
  display: flex;
  flex-wrap: nowrap;
  gap: var(--space-2);
  margin: 0;
  padding: 0;
  overflow: hidden;
  list-style: none;
}
.venue-card__highlights li {
  flex: 0 1 auto;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.venue-card__highlights li {
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-pill);
  color: var(--color-text-secondary);
  background: var(--color-surface-muted);
  font-size: var(--font-size-xs);
}
.venue-card__price {
  margin: 0;
  font-weight: var(--font-weight-semibold);
}
.venue-card__price span {
  color: var(--color-text-secondary);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
}
.venue-card__footer {
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
  padding-top: var(--space-2);
  border-top: 1px solid var(--color-border);
}
.venue-card__footer > * {
  min-width: 0;
}
.venue-card__status {
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-sm);
  color: var(--color-text-secondary);
  background: var(--color-surface-muted);
  font-size: var(--font-size-xs);
}
.venue-card--compact .venue-card__body {
  gap: var(--space-2);
  padding: var(--space-3);
}
.venue-card--compact .venue-card__title {
  font-size: var(--font-size-md);
}
.venue-card--compact .venue-card__category {
  display: none;
}
.venue-card--compact .venue-card__favorite {
  position: absolute;
  z-index: 3;
  top: var(--space-2);
  left: var(--space-2);
  margin: 0;
  color: white;
  background: rgb(17 24 39 / 34%);
  backdrop-filter: blur(4px);
}
.venue-card--compact .venue-card__meta {
  padding-bottom: var(--space-2);
  border-bottom: 1px solid var(--color-border);
}
.venue-card--compact .venue-card__highlights li:nth-child(n + 3) {
  display: none;
}
.venue-card--horizontal,
.venue-card--map-preview {
  display: grid;
  grid-template-columns: minmax(112px, 36%) minmax(0, 1fr);
}
.venue-card--horizontal .venue-card__media,
.venue-card--map-preview .venue-card__media {
  height: 100%;
  min-height: 118px;
  aspect-ratio: auto;
}
.venue-card--horizontal .venue-card__body,
.venue-card--map-preview .venue-card__body {
  gap: var(--space-2);
  padding: var(--space-3);
}
.venue-card--horizontal .venue-card__title,
.venue-card--map-preview .venue-card__title {
  font-size: var(--font-size-md);
}
.venue-card--horizontal .venue-card__category {
  display: inline-flex;
  width: fit-content;
  padding: 2px 7px;
  border-radius: var(--radius-pill);
  color: var(--color-primary);
  background: var(--color-primary-soft);
  font-size: 10px;
}
.venue-card--horizontal .venue-card__highlights {
  display: none;
}
.venue-card--horizontal .venue-card__price {
  justify-self: end;
  color: var(--color-primary);
  font-size: var(--font-size-md);
}
.venue-card--horizontal .venue-card__favorite {
  position: absolute;
  z-index: 3;
  top: var(--space-2);
  left: var(--space-2);
  margin: 0;
  color: white;
  background: rgb(17 24 39 / 30%);
  backdrop-filter: blur(4px);
}
.venue-card--horizontal .venue-card__meta span:first-child {
  position: absolute;
  top: var(--space-3);
  right: var(--space-3);
}
.venue-card--default .venue-card__favorite {
  position: absolute;
  z-index: 3;
  top: var(--space-3);
  left: var(--space-3);
  margin: 0;
  border: 1px solid rgb(255 255 255 / 24%);
  color: #fff;
  background: rgb(15 23 42 / 72%);
  box-shadow: 0 4px 12px rgb(0 0 0 / 18%);
  backdrop-filter: blur(8px);
}
.venue-card--default .venue-card__meta span[aria-label='Rating'] {
  margin-left: auto;
  padding: 2px 7px;
  order: 3;
  border-radius: var(--radius-sm);
  background: #ffe0c7;
  color: #8a4b00;
}
.venue-card--default .venue-card__price {
  max-width: 100%;
  overflow: hidden;
  color: var(--color-primary);
  font-size: clamp(0.9rem, 3.8vw, var(--font-size-lg));
  text-overflow: ellipsis;
  white-space: nowrap;
}
.venue-card--default .venue-card__title {
  -webkit-line-clamp: 2;
}
.venue-card--default .venue-card__status {
  flex: 0 0 auto;
  white-space: nowrap;
}
@media (max-width: 390px) {
  .venue-card--default .venue-card__meta {
    flex-wrap: wrap;
    row-gap: var(--space-1);
  }
  .venue-card--default .venue-card__meta span[aria-label='Rating'] {
    margin-left: 0;
    order: 0;
  }
  .venue-card--default .venue-card__footer {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    align-items: start;
    gap: var(--space-2);
  }
  .venue-card--default .venue-card__price {
    width: 100%;
    font-size: var(--font-size-md);
  }
  .venue-card--default .venue-card__status {
    justify-self: start;
  }
}
.venue-card--map-preview .venue-card__highlights,
.venue-card--map-preview .venue-card__price {
  display: none;
}
.venue-card--featured {
  border-color: color-mix(in srgb, var(--venue-accent) 40%, var(--color-border));
}
@media (max-width: 350px) {
  .venue-card--horizontal,
  .venue-card--map-preview {
    grid-template-columns: 104px minmax(0, 1fr);
  }
  .venue-card__body {
    padding: var(--space-3);
  }
}
</style>
