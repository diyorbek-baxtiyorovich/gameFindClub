import type { VenueEditorDraft } from '@/features/owner/venue-editor'

export interface OwnerVenueDraftRepository {
  getByKey(key: string, signal?: AbortSignal): Promise<VenueEditorDraft | null>
  save(draft: VenueEditorDraft, signal?: AbortSignal): Promise<VenueEditorDraft>
  remove(key: string, signal?: AbortSignal): Promise<void>
}
