import { defineStore } from 'pinia'
import { ref } from 'vue'

import type { CreateVenueInput, OwnerVenue, UpdateVenueInput } from '@/entities/owner'
import {
  localOwnerVenueRepository,
  type OwnerVenueRepository,
} from '@/repositories/owner'

const toErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : 'Unable to complete the Owner venue request.'

export const useOwnerVenuesStore = defineStore('owner-venues', () => {
  const items = ref<readonly OwnerVenue[]>([])
  const selected = ref<OwnerVenue | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function execute<T>(request: () => Promise<T>): Promise<T | undefined> {
    loading.value = true
    error.value = null
    try {
      return await request()
    } catch (caught) {
      error.value = toErrorMessage(caught)
      return undefined
    } finally {
      loading.value = false
    }
  }

  async function load(repository: OwnerVenueRepository = localOwnerVenueRepository): Promise<void> {
    const result = await execute(() => repository.getAll())
    if (result) items.value = result
  }

  async function selectById(
    id: string,
    repository: OwnerVenueRepository = localOwnerVenueRepository,
  ): Promise<void> {
    selected.value = null
    const result = await execute(() => repository.getById(id))
    if (result !== undefined) selected.value = result
  }

  async function create(
    input: CreateVenueInput,
    repository: OwnerVenueRepository = localOwnerVenueRepository,
  ): Promise<OwnerVenue | undefined> {
    const created = await execute(() => repository.create(input))
    if (created) {
      items.value = [created, ...items.value]
      selected.value = created
    }
    return created
  }

  async function update(
    id: string,
    input: UpdateVenueInput,
    repository: OwnerVenueRepository = localOwnerVenueRepository,
  ): Promise<OwnerVenue | undefined> {
    const updated = await execute(() => repository.update(id, input))
    if (updated) {
      items.value = items.value.map((venue) => venue.id === id ? updated : venue)
      if (selected.value?.id === id) selected.value = updated
    }
    return updated
  }

  async function remove(
    id: string,
    repository: OwnerVenueRepository = localOwnerVenueRepository,
  ): Promise<boolean> {
    const removed = await execute(async () => {
      await repository.remove(id)
      return true
    })
    if (removed) {
      items.value = items.value.filter((venue) => venue.id !== id)
      if (selected.value?.id === id) selected.value = null
    }
    return removed ?? false
  }

  async function submitForReview(
    id: string,
    repository: OwnerVenueRepository = localOwnerVenueRepository,
  ): Promise<OwnerVenue | undefined> {
    const submitted = await execute(() => repository.submitForReview(id))
    if (submitted) {
      items.value = items.value.map((venue) => venue.id === id ? submitted : venue)
      if (selected.value?.id === id) selected.value = submitted
    }
    return submitted
  }

  async function archive(
    id: string,
    repository: OwnerVenueRepository = localOwnerVenueRepository,
  ): Promise<OwnerVenue | undefined> {
    const archived = await execute(() => repository.archive(id))
    if (archived) {
      items.value = items.value.map((venue) => venue.id === id ? archived : venue)
      if (selected.value?.id === id) selected.value = archived
    }
    return archived
  }

  function clearError(): void {
    error.value = null
  }

  return {
    items,
    selected,
    loading,
    error,
    load,
    selectById,
    create,
    update,
    remove,
    archive,
    submitForReview,
    clearError,
  }
})
