import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { venueListFixtures } from '@/entities/venue'
import type { Venue, VenueListItem } from '@/entities/venue'
import { historyStorage } from '@/services/venue-preferences.storage'

const fixtureItems: readonly VenueListItem[] = venueListFixtures

export const useHistoryStore = defineStore('history', () => {
  const ids = ref<string[]>([...historyStorage.read()])
  const items = computed<readonly VenueListItem[]>(() => ids.value.map((id) => fixtureItems.find((venue) => venue.id === id)).filter((venue): venue is VenueListItem => Boolean(venue)))
  function record(venue: Venue): void {
    if (ids.value[0] === venue.id) return
    ids.value = [venue.id, ...ids.value.filter((id) => id !== venue.id)].slice(0, 20)
    historyStorage.write(ids.value)
  }
  function clear(): void { ids.value = []; historyStorage.write([]) }
  return { ids, items, record, clear }
})
