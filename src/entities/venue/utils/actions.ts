import { VENUE_ACTION_FEATURES } from '@/config'
import type { VenueActionFeatureFlags } from '@/config'

import type { VenueDetail, VenuePrimaryAction } from '../model/venue'

export function selectPrimaryVenueAction(
  venue: VenueDetail,
  flags: VenueActionFeatureFlags = VENUE_ACTION_FEATURES,
): VenuePrimaryAction | null {
  const configured = venue.primaryAction
  if (configured) {
    const enabled =
      (configured.kind === 'book' && flags.booking) ||
      (configured.kind === 'call' && flags.calling) ||
      (configured.kind === 'directions' && flags.directions) ||
      (configured.kind === 'open-url' && flags.externalLinks) ||
      configured.kind === 'message' ||
      configured.kind === 'none'
    if (enabled) return configured
  }
  if (flags.booking && venue.contact?.bookingUrl) return { kind: 'book', label: 'Band qilish', url: venue.contact.bookingUrl, isAvailable: true }
  if (flags.calling && venue.contact?.phone) return { kind: 'call', label: 'Qo‘ng‘iroq qilish', url: `tel:${venue.contact.phone}`, isAvailable: true }
  if (flags.directions && venue.location) {
    return { kind: 'directions', label: 'Yo‘nalish olish', url: `https://www.openstreetmap.org/?mlat=${venue.location.latitude}&mlon=${venue.location.longitude}`, isAvailable: true }
  }
  return null
}
