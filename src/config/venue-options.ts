import { GLOBAL_FILTER_SCHEMAS } from './filters'

export interface UniversalVenueOption {
  id: string
  labelKey: string
  defaultLabel: string
}

const discoveryAmenities = GLOBAL_FILTER_SCHEMAS
  .find((schema) => schema.key === 'amenities')
  ?.options?.filter((option) => typeof option.value === 'string') ?? []

export const UNIVERSAL_AMENITY_OPTIONS: readonly UniversalVenueOption[] = [
  ...discoveryAmenities.map((option) => ({
    id: String(option.value),
    labelKey: `amenity.${String(option.value)}`,
    defaultLabel: option.label,
  })),
  { id: 'cafe', labelKey: 'amenity.cafe', defaultLabel: 'Cafe' },
  { id: 'locker', labelKey: 'amenity.locker', defaultLabel: 'Locker' },
  { id: 'air-conditioner', labelKey: 'amenity.air_conditioner', defaultLabel: 'Air conditioner' },
  { id: 'toilet', labelKey: 'amenity.toilet', defaultLabel: 'Toilet' },
]

export const UNIVERSAL_FACILITY_OPTIONS: readonly UniversalVenueOption[] = [
  { id: 'changing-room', labelKey: 'facility.changing_room', defaultLabel: 'Changing room' },
  { id: 'waiting-area', labelKey: 'facility.waiting_area', defaultLabel: 'Waiting area' },
  { id: 'security', labelKey: 'facility.security', defaultLabel: 'Security' },
]
