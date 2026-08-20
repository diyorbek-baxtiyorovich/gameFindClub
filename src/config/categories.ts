import type { CategoryCode, CategoryConfig } from './categories.types'

export const CATEGORY_CONFIGS = [
  {
    id: 'category-gaming',
    code: 'gaming',
    label: { key: 'category.gaming', defaultValue: 'Gaming' },
    icon: 'gamepad',
    accent: 'gaming',
    filters: [
      {
        key: 'monitorRefreshRate',
        label: 'Monitor refresh rate',
        control: 'multi-select',
        unitLabel: 'Hz',
        options: [144, 165, 240, 360].map((value) => ({ value, label: `${value} Hz` })),
      },
      {
        key: 'games',
        label: 'Games',
        control: 'multi-select',
        options: ['CS2', 'Dota 2', 'Valorant', 'EA Sports FC'].map((value) => ({
          value,
          label: value,
        })),
      },
    ],
    detailSections: [
      { id: 'resources', label: { key: 'venue.resources', defaultValue: 'Equipment' }, source: 'resources' },
      { id: 'pricing', label: { key: 'venue.pricing', defaultValue: 'Pricing' }, source: 'pricing' },
    ],
    reviewCriteria: [
      { key: 'equipmentQuality', label: { key: 'review.equipment_quality', defaultValue: 'Equipment quality' } },
      { key: 'internetSpeed', label: { key: 'review.internet_speed', defaultValue: 'Internet speed' } },
    ],
    highlights: [
      { source: 'resource-attribute', key: 'monitorRefreshRate' },
      { source: 'resource-attribute', key: 'gpu' },
    ],
  },
  {
    id: 'category-tennis',
    code: 'tennis',
    label: { key: 'category.tennis', defaultValue: 'Tennis' },
    icon: 'tennis-ball',
    accent: 'tennis',
    filters: [
      {
        key: 'courtSurface',
        label: 'Court surface',
        control: 'multi-select',
        options: ['hard', 'clay', 'grass', 'carpet'].map((value) => ({
          value,
          label: value[0].toUpperCase() + value.slice(1),
        })),
      },
      {
        key: 'courtSetting',
        label: 'Court setting',
        control: 'single-select',
        options: [
          { value: 'indoor', label: 'Indoor' },
          { value: 'outdoor', label: 'Outdoor' },
        ],
      },
    ],
    detailSections: [
      { id: 'courts', label: { key: 'venue.courts', defaultValue: 'Courts' }, source: 'resources' },
      { id: 'facilities', label: { key: 'venue.facilities', defaultValue: 'Facilities' }, source: 'facilities' },
    ],
    reviewCriteria: [
      { key: 'courtQuality', label: { key: 'review.courtQuality', defaultValue: 'Court quality' } },
      { key: 'lighting', label: { key: 'review.lighting', defaultValue: 'Lighting' } },
    ],
    highlights: [
      { source: 'resource-attribute', key: 'surface' },
      { source: 'resource-attribute', key: 'setting' },
    ],
  },
  {
    id: 'category-football',
    code: 'football',
    label: { key: 'category.football', defaultValue: 'Football' },
    icon: 'football',
    accent: 'football',
    filters: [
      {
        key: 'fieldSize',
        label: 'Field size',
        control: 'multi-select',
        options: ['5x5', '7x7', '11x11'].map((value) => ({ value, label: value })),
      },
      {
        key: 'fieldSurface',
        label: 'Field surface',
        control: 'multi-select',
        options: [
          { value: 'artificial-turf', label: 'Artificial turf' },
          { value: 'natural-grass', label: 'Natural grass' },
          { value: 'indoor', label: 'Indoor' },
        ],
      },
    ],
    detailSections: [
      { id: 'fields', label: { key: 'venue.fields', defaultValue: 'Fields' }, source: 'resources' },
      { id: 'amenities', label: { key: 'venue.amenities', defaultValue: 'Amenities' }, source: 'amenities' },
    ],
    reviewCriteria: [
      { key: 'fieldQuality', label: { key: 'review.fieldQuality', defaultValue: 'Field quality' } },
      { key: 'changingRooms', label: { key: 'review.changingRooms', defaultValue: 'Changing rooms' } },
    ],
    highlights: [
      { source: 'resource-attribute', key: 'fieldSize' },
      { source: 'resource-attribute', key: 'surface' },
    ],
  },
  {
    id: 'category-gym',
    code: 'gym',
    label: { key: 'category.gym', defaultValue: 'Gym' },
    icon: 'dumbbell',
    accent: 'gym',
    filters: [
      { key: 'trainerAvailable', label: 'Trainer available', control: 'toggle' },
      { key: 'saunaAvailable', label: 'Sauna', control: 'toggle' },
      { key: 'open24Hours', label: 'Open 24/7', control: 'toggle' },
    ],
    detailSections: [
      { id: 'resources', label: { key: 'venue.resources', defaultValue: 'Training areas' }, source: 'resources' },
      { id: 'activities', label: { key: 'venue.activities', defaultValue: 'Activities' }, source: 'activities' },
      { id: 'facilities', label: { key: 'venue.facilities', defaultValue: 'Facilities' }, source: 'facilities' },
    ],
    reviewCriteria: [
      { key: 'equipmentQuality', label: { key: 'review.equipment_quality', defaultValue: 'Equipment quality' } },
      { key: 'crowding', label: { key: 'review.crowding', defaultValue: 'Crowding' } },
    ],
    highlights: [
      { source: 'opening-hours', key: 'open24Hours' },
      { source: 'facility', key: 'trainer' },
      { source: 'amenity', key: 'sauna' },
    ],
  },
] as const satisfies readonly CategoryConfig[]

export const UNKNOWN_CATEGORY: CategoryConfig = {
  id: 'category-unknown',
  code: 'unknown',
  label: { key: 'category.unknown', defaultValue: 'Other' },
  icon: 'place',
  accent: 'neutral',
}

export function getCategoryByCode(code: string | null | undefined): CategoryConfig {
  const normalizedCode = code?.trim().toLowerCase()
  return CATEGORY_CONFIGS.find((category) => category.code === normalizedCode) ?? UNKNOWN_CATEGORY
}

export function getCategoryById(id: string | null | undefined): CategoryConfig {
  return CATEGORY_CONFIGS.find((category) => category.id === id) ?? UNKNOWN_CATEGORY
}

export function isKnownCategoryCode(code: string): code is CategoryCode {
  return CATEGORY_CONFIGS.some((category) => category.code === code)
}
