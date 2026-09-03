import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { CATEGORY_CONFIGS } from '@/config'
import type { VenueListItem } from '@/entities/venue/model/venue'

import { browserRecentSearchStorage } from './recent-search.storage'

export interface SearchSuggestion {
  id: string
  label: string
  value: string
}

export interface SearchSuggestionGroup {
  id: 'recent' | 'popular' | 'categories' | 'nearby'
  label: string
  items: readonly SearchSuggestion[]
}

export const SEARCH_CAPABILITIES = {
  local: ['club-name', 'location', 'installed-game', 'hardware', 'console-type'],
  remote: [] as readonly string[],
  unsupportedUntilBackendContract: [] as readonly string[],
} as const

export const useSearchStore = defineStore('search', () => {
  const query = ref('')
  const debouncedQuery = ref('')
  const recent = ref<readonly string[]>(browserRecentSearchStorage.read())
  const nearbySuggestions = ref<readonly VenueListItem[]>([])
  let debounceTimer: ReturnType<typeof setTimeout> | undefined

  const suggestionGroups = computed<readonly SearchSuggestionGroup[]>(() => [
    {
      id: 'recent',
      label: 'Recent searches',
      items: recent.value.map((value) => ({ id: `recent-${value}`, label: value, value })),
    },
    {
      id: 'popular',
      label: 'Popular searches',
      items: ['Open now', 'Nearby', 'Top rated'].map((value) => ({
        id: `popular-${value}`,
        label: value,
        value,
      })),
    },
    {
      id: 'categories',
      label: 'Categories',
      items: CATEGORY_CONFIGS.map((category) => ({
        id: category.id,
        label: category.label.defaultValue,
        value: category.code,
      })),
    },
    {
      id: 'nearby',
      label: 'Nearby venues',
      items: nearbySuggestions.value.map((venue) => ({
        id: venue.id,
        label: venue.name,
        value: venue.name,
      })),
    },
  ])

  function setQuery(value: string): void {
    query.value = value
    if (debounceTimer) clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => {
      debouncedQuery.value = value.trim()
    }, 300)
  }

  function commitSearch(value = query.value): void {
    const normalized = value.trim()
    if (!normalized) return
    recent.value = [
      normalized,
      ...recent.value.filter((item) => item.toLowerCase() !== normalized.toLowerCase()),
    ].slice(0, 8)
    browserRecentSearchStorage.write(recent.value)
  }

  function clearRecent(): void {
    recent.value = []
    browserRecentSearchStorage.write([])
  }

  return {
    query,
    debouncedQuery,
    recent,
    nearbySuggestions,
    suggestionGroups,
    setQuery,
    commitSearch,
    clearRecent,
  }
})
