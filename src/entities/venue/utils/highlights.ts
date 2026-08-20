import { getCategoryByCode } from '@/config'
import type { CategoryHighlightRule } from '@/config'

import type { VenueDetail, VenueListItem } from '../model/venue'

function readable(value: unknown): string | null {
  if (typeof value === 'string' && value.trim()) {
    return value.split('-').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ')
  }
  if (typeof value === 'number' && Number.isFinite(value)) return String(value)
  if (typeof value === 'boolean') return value ? 'Yes' : null
  return null
}

function fromRule(venue: VenueDetail, rule: CategoryHighlightRule): string | null {
  if (rule.source === 'resource-attribute') {
    for (const resource of venue.resources ?? []) {
      const value = readable(resource.attributes?.[rule.key])
      if (value) return rule.key === 'monitorRefreshRate' ? `${value} Hz` : value
    }
  }
  if (rule.source === 'amenity') return venue.amenities?.find((item) => item.id === rule.key)?.name ?? null
  if (rule.source === 'facility') return venue.facilities?.find((item) => item.id === rule.key)?.name ?? null
  if (rule.source === 'activity') return venue.activities?.find((item) => item.id === rule.key)?.name ?? null
  if (rule.source === 'opening-hours' && rule.key === 'open24Hours') {
    return venue.openingHours?.weekly.some((day) => day.isOpen24Hours) ? 'Open 24/7' : null
  }
  return null
}

export function getVenueHighlights(venue: VenueListItem | VenueDetail, limit = 3): readonly string[] {
  if ('highlights' in venue && venue.highlights?.length) return venue.highlights.slice(0, limit)
  const category = getCategoryByCode(venue.category.slug)
  const highlights = (category.highlights ?? [])
    .map((rule) => fromRule(venue as VenueDetail, rule))
    .filter((value): value is string => Boolean(value))
  return [...new Set(highlights)].slice(0, limit)
}
