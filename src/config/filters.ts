import type { FilterSchema } from '@/types'

export const GLOBAL_FILTER_SCHEMAS: readonly FilterSchema[] = [
  { key: 'radius', label: 'Search radius', labelKey: 'filters.radius', control: 'number', min: 1, max: 100, step: 1, unitLabel: 'km' },
  { key: 'openNow', label: 'Hozir ochiq', labelKey: 'filters.openNow', control: 'boolean' },
  { key: 'minRating', label: 'Minimum rating', labelKey: 'filters.minRating', control: 'select', options: [3, 4, 4.5].map((value) => ({ value, label: `${value}+` })) },
  { key: 'priceRange', label: 'Price range', labelKey: 'filters.priceRange', control: 'range', min: 0, step: 10000, unitLabel: 'UZS' },
  { key: 'amenities', label: 'Qulayliklar', labelKey: 'filters.amenities', control: 'multi-select', options: [
    { value: 'parking', label: 'Avtoturargoh' }, { value: 'food-drinks', label: 'Taom va ichimliklar' }, { value: 'air-conditioning', label: 'Konditsioner' }, { value: 'team-room', label: 'Jamoa xonasi' },
  ] },
  { key: 'verifiedOnly', label: 'Verified only', labelKey: 'filters.verifiedOnly', control: 'boolean' },
  { key: 'availability', label: 'Bo‘sh joy bor', labelKey: 'filters.availability', control: 'boolean' },
]
