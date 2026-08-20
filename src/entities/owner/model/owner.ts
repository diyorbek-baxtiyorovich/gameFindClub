import type { CategorySummary } from '@/entities/category'
import type { OwnerReply, Review } from '@/entities/review'
import type { RatingSummary } from '@/entities/review'
import type {
  Activity,
  Address,
  Amenity,
  ContactInfo,
  Facility,
  GeoPoint,
  OpeningHours,
  PricingOption,
  VenueMedia,
  VenueResource,
} from '@/entities/venue'

export type UserRole = 'user' | 'owner'

export interface OwnerProfile {
  id: string
  role: 'owner'
  displayName: string
  telegramUserId?: number
  username?: string
  phone?: string
  email?: string
  avatarUrl?: string
  createdAt?: string
  updatedAt?: string
}

export type VenueStatus =
  | 'draft'
  | 'pending_review'
  | 'changes_requested'
  | 'approved'
  | 'rejected'
  | 'archived'

export type VenueContacts = ContactInfo
export type VenuePricing = readonly PricingOption[]
export type VenueSchedule = OpeningHours
export type VenueCategoryAttributeValue = string | number | boolean | readonly string[] | readonly number[]
export type VenueCategoryAttributes = Readonly<Record<string, VenueCategoryAttributeValue>>

/** Editable fields shared by create, edit, local persistence, and a future API adapter. */
export interface EditableVenueFields {
  slug?: string
  name?: string
  category?: CategorySummary
  categoryAttributes?: VenueCategoryAttributes
  shortDescription?: string
  description?: string
  address?: Address
  location?: GeoPoint
  coverMedia?: VenueMedia
  media?: readonly VenueMedia[]
  contacts?: VenueContacts
  schedule?: VenueSchedule
  activities?: readonly Activity[]
  facilities?: readonly Facility[]
  amenities?: readonly Amenity[]
  resources?: readonly VenueResource[]
  pricing?: VenuePricing
}

export interface OwnerVenue extends EditableVenueFields {
  id: string
  ownerId: string
  status: VenueStatus
  createdAt: string
  updatedAt: string
  submittedAt?: string
  moderationNote?: string
  rating?: RatingSummary
}

export interface CreateVenueInput extends EditableVenueFields {
  ownerId: string
}

export type UpdateVenueInput = Partial<EditableVenueFields>

export interface OwnerAnalyticsSeriesPoint {
  date: string
  value: number
}

export interface OwnerAnalyticsActionMetric {
  key: 'favorites' | 'calls' | 'directions'
  value: number
}

export interface OwnerAnalyticsSummary {
  ownerId: string
  dataSource: 'mock-local' | 'api'
  venueCount: number
  publishedVenueCount: number
  totalViews: number
  totalFavorites: number
  totalCalls: number
  totalDirections: number
  averageRating?: number
  reviewCount: number
  viewsOverTime: readonly OwnerAnalyticsSeriesPoint[]
  actionBreakdown: readonly OwnerAnalyticsActionMetric[]
  periodStart?: string
  periodEnd?: string
}

export interface OwnerReview extends Review {
  venueName?: string
}

export interface CreateOwnerReplyInput {
  body: string
  ownerName?: string
}

export type OwnerReviewReply = OwnerReply
