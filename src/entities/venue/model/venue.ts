import type { CategorySummary } from '@/entities/category'
import type { RatingSummary } from '@/entities/review'

export interface GeoPoint {
  latitude: number
  longitude: number
}

export interface Address {
  formatted: string
  countryCode?: string
  region?: string
  city?: string
  district?: string
  street?: string
  building?: string
  postalCode?: string
}

export type VenueMediaType = 'image' | 'video'

export interface VenueMedia {
  id: string
  type: VenueMediaType
  url: string
  thumbnailUrl?: string
  alt?: string
  width?: number
  height?: number
  sortOrder?: number
}

export type Weekday =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday'

export interface OpeningPeriod {
  opensAt: string
  closesAt: string
}

export interface DailyOpeningHours {
  day: Weekday
  isClosed?: boolean
  isOpen24Hours?: boolean
  periods?: readonly OpeningPeriod[]
}

export interface OpeningHoursException {
  date: string
  label?: string
  isClosed?: boolean
  periods?: readonly OpeningPeriod[]
}

export interface OpeningHours {
  timezone?: string
  weekly: readonly DailyOpeningHours[]
  exceptions?: readonly OpeningHoursException[]
  statusText?: string
  nextChangeAt?: string
  byReservationOnly?: boolean
}

export interface ContactInfo {
  phone?: string
  email?: string
  websiteUrl?: string
  bookingUrl?: string
  telegramUsername?: string
  socialLinks?: Readonly<Record<string, string>>
}

export interface Activity {
  id: string
  name: string
  description?: string
  icon?: string
}

export interface Facility {
  id: string
  name: string
  description?: string
  icon?: string
  attributes?: Readonly<Record<string, unknown>>
}

export interface Amenity {
  id: string
  name: string
  description?: string
  icon?: string
}

export type VenueResourceAvailability =
  | 'available'
  | 'limited'
  | 'unavailable'
  | 'unknown'

export interface VenueResource {
  id: string
  name: string
  resourceType: string
  description?: string
  quantity?: number
  availability?: VenueResourceAvailability
  attributes?: Readonly<Record<string, unknown>>
}

export interface Money {
  amount: number
  currency: string
}

export type PricingUnit = 'hour' | 'session' | 'person' | 'day' | 'month'

export interface PricingOption {
  id: string
  name: string
  price: Money
  unit: PricingUnit
  description?: string
  durationMinutes?: number
  minimumQuantity?: number
  maximumQuantity?: number
  resourceId?: string
  isStartingPrice?: boolean
  conditions?: readonly string[]
  membershipInfo?: string
}

export type OccupancyLevel = 'empty' | 'low' | 'moderate' | 'high' | 'full' | 'unknown'

export interface OccupancyStatus {
  level: OccupancyLevel
  availableCount?: number
  totalCount?: number
  updatedAt?: string
  label?: string
}

export type VenuePrimaryActionKind =
  | 'book'
  | 'call'
  | 'directions'
  | 'message'
  | 'open-url'
  | 'none'

export interface VenuePrimaryAction {
  kind: VenuePrimaryActionKind
  label: string
  url?: string
  isAvailable?: boolean
  disabledReason?: string
}

export interface VenueOperatingStatus {
  isOpen: boolean
  label?: string
  opensAt?: string
  closesAt?: string
}

export interface Venue {
  id: string
  slug: string
  name: string
  category: CategorySummary
  shortDescription?: string
  address?: Address
  location?: GeoPoint
  coverMedia?: VenueMedia
  rating?: RatingSummary
  priceFrom?: PricingOption
  occupancy?: OccupancyStatus
  operatingStatus?: VenueOperatingStatus
  primaryAction?: VenuePrimaryAction
  isFavorite?: boolean
  isVerified?: boolean
}

export interface VenueListItem extends Venue {
  distanceMeters?: number
  highlights?: readonly string[]
  activityIds?: readonly string[]
  amenityIds?: readonly string[]
}

export interface VenueDetail extends Venue {
  description?: string
  media?: readonly VenueMedia[]
  openingHours?: OpeningHours
  contact?: ContactInfo
  activities?: readonly Activity[]
  facilities?: readonly Facility[]
  amenities?: readonly Amenity[]
  resources?: readonly VenueResource[]
  pricing?: readonly PricingOption[]
}
