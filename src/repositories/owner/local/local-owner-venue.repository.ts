import type { CreateVenueInput, OwnerVenue, UpdateVenueInput } from '@/entities/owner'
import { ownerVenueFixtures } from '@/fixtures/owner'

import type { OwnerVenueRepository } from '../owner-venue.repository'
import { createOwnerLocalStorage, OWNER_STORAGE_KEYS } from './owner-local.storage'

const venueStatuses = new Set(['draft', 'pending_review', 'changes_requested', 'approved', 'rejected', 'archived'])
const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null
const isOwnerVenueArray = (value: unknown): value is OwnerVenue[] => Array.isArray(value)
  && value.every((venue) => isRecord(venue) && typeof venue.id === 'string'
    && typeof venue.ownerId === 'string' && typeof venue.status === 'string'
    && venueStatuses.has(venue.status) && typeof venue.createdAt === 'string'
    && typeof venue.updatedAt === 'string')

const storage = createOwnerLocalStorage<OwnerVenue[]>(
  OWNER_STORAGE_KEYS.venues,
  [...ownerVenueFixtures],
  isOwnerVenueArray,
)

const assertNotAborted = (signal?: AbortSignal): void => {
  if (signal?.aborted) throw new DOMException('The request was cancelled.', 'AbortError')
}

const createId = (): string =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? `owner-venue-${crypto.randomUUID()}`
    : `owner-venue-${Date.now()}`

const containsBase64Media = (input: CreateVenueInput | UpdateVenueInput): boolean =>
  [input.coverMedia, ...(input.media ?? [])].some((media) => media?.url.startsWith('data:'))

const assertPersistableMedia = (input: CreateVenueInput | UpdateVenueInput): void => {
  if (containsBase64Media(input)) {
    throw new Error('Base64 media cannot be stored in the local Owner repository.')
  }
}

const requireVenue = (venues: readonly OwnerVenue[], id: string): OwnerVenue => {
  const venue = venues.find((item) => item.id === id)
  if (!venue) throw new Error(`Owner venue "${id}" was not found.`)
  return venue
}

export class LocalOwnerVenueRepository implements OwnerVenueRepository {
  async getAll(signal?: AbortSignal): Promise<readonly OwnerVenue[]> {
    assertNotAborted(signal)
    return storage.read()
  }

  async getById(id: string, signal?: AbortSignal): Promise<OwnerVenue | null> {
    assertNotAborted(signal)
    return storage.read().find((venue) => venue.id === id) ?? null
  }

  async create(input: CreateVenueInput, signal?: AbortSignal): Promise<OwnerVenue> {
    assertNotAborted(signal)
    assertPersistableMedia(input)
    const now = new Date().toISOString()
    const venue: OwnerVenue = {
      ...input,
      id: createId(),
      status: 'draft',
      createdAt: now,
      updatedAt: now,
    }
    storage.write([venue, ...storage.read()])
    return venue
  }

  async update(id: string, input: UpdateVenueInput, signal?: AbortSignal): Promise<OwnerVenue> {
    assertNotAborted(signal)
    assertPersistableMedia(input)
    const venues = storage.read()
    const current = requireVenue(venues, id)
    const updated: OwnerVenue = { ...current, ...input, id, updatedAt: new Date().toISOString() }
    storage.write(venues.map((venue) => (venue.id === id ? updated : venue)))
    return updated
  }

  async remove(id: string, signal?: AbortSignal): Promise<void> {
    assertNotAborted(signal)
    const venues = storage.read()
    const current = requireVenue(venues, id)
    if (current.status !== 'draft') {
      throw new Error('Only draft venues can be deleted in the local Owner workflow.')
    }
    storage.write(venues.filter((venue) => venue.id !== id))
  }

  async archive(id: string, signal?: AbortSignal): Promise<OwnerVenue> {
    assertNotAborted(signal)
    const venues = storage.read()
    const current = requireVenue(venues, id)
    if (current.status === 'draft') {
      throw new Error('Draft venues should be deleted instead of archived.')
    }
    const archived: OwnerVenue = {
      ...current,
      status: 'archived',
      updatedAt: new Date().toISOString(),
    }
    storage.write(venues.map((venue) => (venue.id === id ? archived : venue)))
    return archived
  }

  async submitForReview(id: string, signal?: AbortSignal): Promise<OwnerVenue> {
    assertNotAborted(signal)
    const venues = storage.read()
    const current = requireVenue(venues, id)
    if (current.status !== 'draft') {
      throw new Error('Only draft venues can be submitted for review in the local workflow.')
    }
    const now = new Date().toISOString()
    const submitted: OwnerVenue = {
      ...current,
      status: 'pending_review',
      submittedAt: now,
      updatedAt: now,
    }
    storage.write(venues.map((venue) => (venue.id === id ? submitted : venue)))
    return submitted
  }
}

export const localOwnerVenueRepository = new LocalOwnerVenueRepository()
