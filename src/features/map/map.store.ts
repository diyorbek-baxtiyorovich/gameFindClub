import { defineStore } from 'pinia'
import { ref } from 'vue'
import { localVenueRepository } from '@/entities/venue/api'
import type { VenueQueryParams, VenueRepository } from '@/entities/venue/api'
import type { VenueListItem } from '@/entities/venue/model/venue'
import type { MapViewport } from './map.types'

export const useMapStore = defineStore('map-discovery', () => {
  const viewport = ref<MapViewport | null>(null)
  const items = ref<readonly VenueListItem[]>([])
  const selectedId = ref<string | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const viewportDirty = ref(false)
  const hasSearched = ref(false)
  let requestId = 0
  let controller: AbortController | undefined

  function updateViewport(value: MapViewport): void {
    viewport.value = value
    viewportDirty.value = true
  }

  function selectVenue(id: string | null): void {
    selectedId.value = id
  }

  async function searchVisibleBounds(
    params: Omit<VenueQueryParams, 'bounds'> = {},
    repository: VenueRepository = localVenueRepository,
  ): Promise<void> {
    if (!viewport.value) return
    const currentId = ++requestId
    controller?.abort()
    controller = new AbortController()
    loading.value = true
    error.value = null
    try {
      const result = await repository.list({ ...params, bounds: viewport.value.bounds }, controller.signal)
      if (currentId === requestId) {
        items.value = result
        viewportDirty.value = false
        hasSearched.value = true
      }
    } catch (caught) {
      if (currentId === requestId && !(caught instanceof DOMException && caught.name === 'AbortError')) {
          error.value = 'Unable to search this area. Please try again.'
      }
    } finally {
      if (currentId === requestId) loading.value = false
    }
  }

  return { viewport, items, selectedId, loading, error, viewportDirty, hasSearched, updateViewport, selectVenue, searchVisibleBounds }
})
