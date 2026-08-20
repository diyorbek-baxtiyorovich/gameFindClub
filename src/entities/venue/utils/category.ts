import { getCategoryByCode } from '@/config'
import type { Venue } from '../model/venue'

export const getVenueCategory = (venue: Venue) => getCategoryByCode(venue.category.slug)
