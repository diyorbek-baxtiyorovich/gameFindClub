import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { venueListFixtures } from '@/entities/venue'
import type { VenueListItem } from '@/entities/venue'
import { favoritesStorage } from '@/services/venue-preferences.storage'

const fixtureItems: readonly VenueListItem[] = venueListFixtures

export const useFavoritesStore = defineStore('favorites', () => {
  const ids = ref<string[]>([...favoritesStorage.read()])
  const items = computed<readonly VenueListItem[]>(() =>
    ids.value
      .map((id) => fixtureItems.find((venue) => venue.id === id))
      .filter((venue): venue is VenueListItem => Boolean(venue))
      .map((venue) => ({ ...venue, isFavorite: true })),
  )
  const isFavorite = (id: string): boolean => ids.value.includes(id)
  function toggle(id: string): void {
    ids.value = isFavorite(id) ? ids.value.filter((item) => item !== id) : [id, ...ids.value]
    favoritesStorage.write(ids.value)
  }
  return { ids, items, isFavorite, toggle }
})
