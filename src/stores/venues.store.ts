import { defineStore } from 'pinia'
import { ref } from 'vue'

import { localVenueRepository } from '@/entities/venue/api'
import type { VenueQueryParams, VenueRepository } from '@/entities/venue/api'
import type { VenueDetail, VenueListItem } from '@/entities/venue/model/venue'

const errorMessage = (_error: unknown): string => 'Unable to load venues. Please try again.'

export const useVenuesStore = defineStore('venues', () => {
  const items = ref<readonly VenueListItem[]>([])
  const nearby = ref<readonly VenueListItem[]>([])
  const selected = ref<VenueDetail | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  let activeRequest = 0
  let controller: AbortController | undefined

  async function runLatest<T>(request: (signal: AbortSignal) => Promise<T>): Promise<T | undefined> {
    const requestId = ++activeRequest
    controller?.abort()
    controller = new AbortController()
    loading.value = true
    error.value = null
    try {
      const result = await request(controller.signal)
      return requestId === activeRequest ? result : undefined
    } catch (caught) {
      if (requestId === activeRequest && !(caught instanceof DOMException && caught.name === 'AbortError')) {
        error.value = errorMessage(caught)
      }
      return undefined
    } finally {
      if (requestId === activeRequest) loading.value = false
    }
  }

  async function loadItems(
    params?: VenueQueryParams,
    repository: VenueRepository = localVenueRepository,
  ): Promise<void> {
    const result = await runLatest((signal) => repository.list(params, signal))
    if (result) items.value = result
  }

  async function loadNearby(
    params: VenueQueryParams,
    repository: VenueRepository = localVenueRepository,
  ): Promise<void> {
    const result = await runLatest((signal) => repository.list(params, signal))
    if (result) nearby.value = result
  }

  async function selectBySlug(
    slug: string,
    repository: VenueRepository = localVenueRepository,
  ): Promise<void> {
    selected.value = null
    const result = await runLatest((signal) => repository.getBySlug(slug, signal))
    if (result !== undefined) selected.value = result
  }

  function clearSelected(): void {
    selected.value = null
  }

  function cancelPending(): void {
    activeRequest += 1
    controller?.abort()
    loading.value = false
  }

  return { items, nearby, selected, loading, error, loadItems, loadNearby, selectBySlug, clearSelected, cancelPending }
})
