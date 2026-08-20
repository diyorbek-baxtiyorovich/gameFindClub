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
    editorFields: [
      { key: 'monitorRefreshRate', label: 'Monitor refresh rate', labelKey: 'owner.field.monitor_refresh', control: 'single-select', unitLabel: 'Hz', options: [144, 165, 240, 360].map((value) => ({ value, label: `${value} Hz` })) },
      { key: 'gpu', label: 'GPU', labelKey: 'owner.field.gpu', control: 'text' },
      { key: 'cpu', label: 'CPU', labelKey: 'owner.field.cpu', control: 'text' },
      { key: 'ram', label: 'RAM', labelKey: 'owner.field.ram', control: 'single-select', options: [16, 32, 64, 128].map((value) => ({ value, label: `${value} GB` })) },
      { key: 'games', label: 'Games', labelKey: 'owner.field.games', control: 'multi-select', options: ['CS2', 'Dota 2', 'Valorant', 'EA Sports FC'].map((value) => ({ value, label: value })) },
      { key: 'vipZone', label: 'VIP zone', labelKey: 'owner.field.vip_zone', control: 'toggle' },
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
    editorFields: [
      { key: 'courtSurface', label: 'Court surface', labelKey: 'owner.field.court_surface', control: 'single-select', options: ['hard', 'clay', 'grass', 'carpet'].map((value) => ({ value, label: value[0].toUpperCase() + value.slice(1), labelKey: `owner.option.${value}` })) },
      { key: 'courtSetting', label: 'Court setting', labelKey: 'owner.field.setting', control: 'single-select', options: [{ value: 'indoor', label: 'Indoor', labelKey: 'owner.option.indoor' }, { value: 'outdoor', label: 'Outdoor', labelKey: 'owner.option.outdoor' }] },
      { key: 'courtCount', label: 'Court count', labelKey: 'owner.field.court_count', control: 'number', min: 1, max: 100, step: 1, required: true },
      { key: 'lighting', label: 'Lighting', labelKey: 'owner.field.lighting', control: 'toggle' },
      { key: 'coachAvailable', label: 'Coach available', labelKey: 'owner.field.coach', control: 'toggle' },
      { key: 'racketRental', label: 'Racket rental', labelKey: 'owner.field.racket_rental', control: 'toggle' },
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
    editorFields: [
      { key: 'fieldSize', label: 'Field size', labelKey: 'owner.field.field_size', control: 'single-select', options: ['5x5', '7x7', '11x11'].map((value) => ({ value, label: value })) },
      { key: 'fieldSurface', label: 'Surface', labelKey: 'owner.field.surface', control: 'single-select', options: [{ value: 'artificial-turf', label: 'Artificial turf', labelKey: 'owner.option.artificial_turf' }, { value: 'natural-grass', label: 'Natural grass', labelKey: 'owner.option.natural_grass' }, { value: 'indoor', label: 'Indoor surface', labelKey: 'owner.option.indoor_surface' }] },
      { key: 'fieldSetting', label: 'Field setting', labelKey: 'owner.field.setting', control: 'single-select', options: [{ value: 'indoor', label: 'Indoor', labelKey: 'owner.option.indoor' }, { value: 'outdoor', label: 'Outdoor', labelKey: 'owner.option.outdoor' }] },
      { key: 'changingRoom', label: 'Changing room', labelKey: 'owner.field.changing_room', control: 'toggle' },
      { key: 'shower', label: 'Shower', labelKey: 'owner.field.shower', control: 'toggle' },
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
    editorFields: [
      { key: 'trainerAvailable', label: 'Trainer available', labelKey: 'owner.field.trainer', control: 'toggle' },
      { key: 'saunaAvailable', label: 'Sauna', labelKey: 'owner.field.sauna', control: 'toggle' },
      { key: 'poolAvailable', label: 'Pool', labelKey: 'owner.field.pool', control: 'toggle' },
      { key: 'open24Hours', label: 'Open 24/7', labelKey: 'owner.field.open_24_7', control: 'toggle' },
      { key: 'groupClasses', label: 'Group classes', labelKey: 'owner.field.group_classes', control: 'toggle' },
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
  {
    id: 'category-padel',
    code: 'padel',
    label: { key: 'category.padel', defaultValue: 'Padel' },
    icon: 'trophy',
    accent: 'neutral',
    filters: [
      {
        key: 'courtSetting',
        label: 'Court setting',
        control: 'single-select',
        options: [{ value: 'indoor', label: 'Indoor' }, { value: 'outdoor', label: 'Outdoor' }],
      },
    ],
    editorFields: [
      { key: 'courtSetting', label: 'Court setting', labelKey: 'owner.field.setting', control: 'single-select', options: [{ value: 'indoor', label: 'Indoor', labelKey: 'owner.option.indoor' }, { value: 'outdoor', label: 'Outdoor', labelKey: 'owner.option.outdoor' }] },
      { key: 'courtCount', label: 'Court count', labelKey: 'owner.field.court_count', control: 'number', min: 1, max: 50, step: 1 },
      { key: 'racketRental', label: 'Racket rental', labelKey: 'owner.field.racket_rental', control: 'toggle' },
    ],
    detailSections: [
      { id: 'courts', label: { key: 'venue.courts', defaultValue: 'Courts' }, source: 'resources' },
      { id: 'facilities', label: { key: 'venue.facilities', defaultValue: 'Facilities' }, source: 'facilities' },
    ],
  },
  {
    id: 'category-billiard',
    code: 'billiard',
    label: { key: 'category.billiard', defaultValue: 'Billiard' },
    icon: 'trophy',
    accent: 'neutral',
    filters: [
      {
        key: 'tableType',
        label: 'Table type',
        control: 'multi-select',
        options: [{ value: 'pool', label: 'Pool' }, { value: 'snooker', label: 'Snooker' }, { value: 'russian-pyramid', label: 'Russian pyramid' }],
      },
    ],
    editorFields: [
      { key: 'tableType', label: 'Table type', labelKey: 'owner.field.table_type', control: 'multi-select', options: [{ value: 'pool', label: 'Pool', labelKey: 'owner.option.pool' }, { value: 'snooker', label: 'Snooker', labelKey: 'owner.option.snooker' }, { value: 'russian-pyramid', label: 'Russian pyramid', labelKey: 'owner.option.russian_pyramid' }] },
      { key: 'tableCount', label: 'Table count', labelKey: 'owner.field.table_count', control: 'number', min: 1, max: 100, step: 1 },
      { key: 'vipZone', label: 'VIP zone', labelKey: 'owner.field.vip_zone', control: 'toggle' },
    ],
    detailSections: [
      { id: 'resources', label: { key: 'venue.resources', defaultValue: 'Tables' }, source: 'resources' },
      { id: 'pricing', label: { key: 'venue.pricing', defaultValue: 'Pricing' }, source: 'pricing' },
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
