import type { VenueEditorDraft } from '@/features/owner/venue-editor'

import type { OwnerVenueDraftRepository } from '../owner-venue-draft.repository'
import { createOwnerLocalStorage, OWNER_STORAGE_KEYS } from './owner-local.storage'

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null
const isVenueEditorDraft = (value: unknown): value is VenueEditorDraft =>
  isRecord(value) &&
  typeof value.key === 'string' &&
  (value.mode === 'create' || value.mode === 'edit') &&
  typeof value.ownerId === 'string' &&
  typeof value.name === 'string' &&
  typeof value.shortDescription === 'string' &&
  typeof value.description === 'string' &&
  isRecord(value.categoryAttributes) &&
  isRecord(value.address) &&
  isRecord(value.coordinates) &&
  Array.isArray(value.media) &&
  Array.isArray(value.activities) &&
  Array.isArray(value.facilities) &&
  Array.isArray(value.amenities) &&
  Array.isArray(value.resources) &&
  Array.isArray(value.pricing)
const isVenueEditorDraftArray = (value: unknown): value is VenueEditorDraft[] =>
  Array.isArray(value) && value.every(isVenueEditorDraft)

const storage = createOwnerLocalStorage<VenueEditorDraft[]>(
  OWNER_STORAGE_KEYS.venueDrafts,
  [],
  isVenueEditorDraftArray,
)

const assertNotAborted = (signal?: AbortSignal): void => {
  if (signal?.aborted) throw new DOMException('The request was cancelled.', 'AbortError')
}

const isPersistableUrl = (url: string): boolean =>
  !url.startsWith('blob:') && !url.startsWith('data:')

const sanitizeForPersistence = (draft: VenueEditorDraft): VenueEditorDraft => {
  const media = draft.media.filter((item) => isPersistableUrl(item.url))
  const coverMedia =
    draft.coverMedia && isPersistableUrl(draft.coverMedia.url) ? draft.coverMedia : media[0]
  return { ...draft, media, coverMedia }
}

export class LocalOwnerVenueDraftRepository implements OwnerVenueDraftRepository {
  async getByKey(key: string, signal?: AbortSignal): Promise<VenueEditorDraft | null> {
    assertNotAborted(signal)
    return storage.read().find((draft) => draft.key === key) ?? null
  }

  async save(draft: VenueEditorDraft, signal?: AbortSignal): Promise<VenueEditorDraft> {
    assertNotAborted(signal)
    const saved = structuredClone(sanitizeForPersistence(draft))
    const drafts = storage.read()
    storage.write([saved, ...drafts.filter((item) => item.key !== saved.key)])
    return saved
  }

  async remove(key: string, signal?: AbortSignal): Promise<void> {
    assertNotAborted(signal)
    storage.write(storage.read().filter((draft) => draft.key !== key))
  }
}

export const localOwnerVenueDraftRepository = new LocalOwnerVenueDraftRepository()
