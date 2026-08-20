import type {
  Activity,
  Amenity,
  ContactInfo,
  Facility,
  OpeningHours,
  PricingOption,
  VenueMedia,
  VenueResource,
} from '@/entities/venue'
import type { VenueCategoryAttributes, VenueCategoryAttributeValue } from '@/entities/owner'

import type { VenueEditorMode } from './editor.types'

export type { VenueCategoryAttributes, VenueCategoryAttributeValue } from '@/entities/owner'

export interface VenueEditorDraftAddress {
  formatted: string
  city: string
  district: string
}

export interface VenueEditorDraftCoordinates {
  latitude?: number
  longitude?: number
}

/** In-progress editor state. It is intentionally distinct from persisted OwnerVenue. */
export interface VenueEditorDraft {
  key: string
  mode: VenueEditorMode
  ownerId: string
  sourceVenueId?: string
  name: string
  shortDescription: string
  description: string
  categoryId?: string
  categoryAttributes: VenueCategoryAttributes
  address: VenueEditorDraftAddress
  coordinates: VenueEditorDraftCoordinates
  coverMedia?: VenueMedia
  media: readonly VenueMedia[]
  contacts?: ContactInfo
  schedule?: OpeningHours
  activities: readonly Activity[]
  facilities: readonly Facility[]
  amenities: readonly Amenity[]
  resources: readonly VenueResource[]
  pricing: readonly PricingOption[]
  createdAt: string
  updatedAt: string
}

export type VenueBasicInformationErrors = Partial<Record<'name' | 'shortDescription' | 'description', string>>

export function createEmptyVenueEditorDraft(ownerId: string): VenueEditorDraft {
  const now = new Date().toISOString()
  return {
    key: `create:${ownerId}`,
    mode: 'create',
    ownerId,
    name: '',
    shortDescription: '',
    description: '',
    categoryAttributes: {},
    address: { formatted: '', city: '', district: '' },
    coordinates: {},
    media: [],
    activities: [],
    facilities: [],
    amenities: [],
    resources: [],
    pricing: [],
    createdAt: now,
    updatedAt: now,
  }
}
