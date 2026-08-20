import { getCategoryById } from '@/config'
import type { CreateVenueInput, UpdateVenueInput } from '@/entities/owner'
import type { CategorySummary } from '@/entities/category'
import type { VenueDetail, VenueMedia } from '@/entities/venue'
import type { VenueEditorDraft } from './venue-editor-draft'

const persistentMedia = (media: readonly VenueMedia[]): readonly VenueMedia[] => media.filter((item) => !/^(?:blob:|data:)/.test(item.url))

export function categorySummaryForDraft(draft: VenueEditorDraft): CategorySummary {
  const category = getCategoryById(draft.categoryId)
  return { id: category.id, slug: category.code, name: category.label.defaultValue, icon: category.icon }
}

function editableFields(draft: VenueEditorDraft): UpdateVenueInput {
  const media = persistentMedia(draft.media)
  const coverMedia = draft.coverMedia && !/^(?:blob:|data:)/.test(draft.coverMedia.url) ? draft.coverMedia : media[0]
  const hasCoordinates = draft.coordinates.latitude !== undefined && draft.coordinates.longitude !== undefined
  const formatted = draft.address.formatted.trim() || [draft.address.district, draft.address.city].filter(Boolean).join(', ')
  return {
    name: draft.name.trim(), shortDescription: draft.shortDescription.trim(), description: draft.description.trim(),
    category: categorySummaryForDraft(draft), categoryAttributes: draft.categoryAttributes,
    address: formatted ? { formatted, city: draft.address.city.trim() || undefined, district: draft.address.district.trim() || undefined } : undefined,
    location: hasCoordinates ? { latitude: draft.coordinates.latitude!, longitude: draft.coordinates.longitude! } : undefined,
    media, coverMedia, contacts: draft.contacts, schedule: draft.schedule, activities: draft.activities,
    facilities: draft.facilities, amenities: draft.amenities, resources: draft.resources, pricing: draft.pricing,
  }
}

export function draftToCreateInput(draft: VenueEditorDraft): CreateVenueInput {
  return { ...editableFields(draft), ownerId: draft.ownerId }
}

export function draftToUpdateInput(draft: VenueEditorDraft): UpdateVenueInput { return editableFields(draft) }

export function draftToPreviewVenue(draft: VenueEditorDraft, fallbackName: string): VenueDetail {
  const fields = editableFields(draft)
  return {
    id: draft.sourceVenueId ?? 'owner-draft-preview', slug: fields.slug ?? 'owner-draft-preview',
    name: fields.name || fallbackName, category: fields.category ?? categorySummaryForDraft(draft),
    shortDescription: fields.shortDescription, description: fields.description, address: fields.address,
    location: fields.location, coverMedia: draft.coverMedia, media: draft.media, openingHours: fields.schedule,
    contact: fields.contacts, activities: fields.activities, facilities: fields.facilities, amenities: fields.amenities,
    resources: fields.resources, pricing: fields.pricing,
  }
}
