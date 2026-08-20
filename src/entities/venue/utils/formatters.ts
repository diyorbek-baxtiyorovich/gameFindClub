import type { Money, PricingOption, Venue, VenueOperatingStatus } from '../model/venue'

const pricingUnitLabels: Readonly<Record<PricingOption['unit'], string>> = {
  hour: 'hour',
  session: 'session',
  person: 'person',
  day: 'day',
  month: 'month',
}

export function formatMoney(money: Money | null | undefined, locale = 'en-US'): string | null {
  if (!money || !Number.isFinite(money.amount) || !money.currency) return null
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: money.currency,
      maximumFractionDigits: money.amount % 1 === 0 ? 0 : 2,
    }).format(money.amount)
  } catch {
    return `${money.amount.toLocaleString(locale)} ${money.currency}`
  }
}

export function formatPrice(
  option: PricingOption | null | undefined,
  locale = 'en-US',
): string | null {
  const amount = formatMoney(option?.price, locale)
  return amount && option ? `${amount} / ${pricingUnitLabels[option.unit]}` : null
}

export function formatDistance(
  distanceMeters: number | null | undefined,
  locale = 'en-US',
): string | null {
  if (distanceMeters == null || !Number.isFinite(distanceMeters) || distanceMeters < 0) return null
  if (distanceMeters < 1000) return `${Math.round(distanceMeters).toLocaleString(locale)} m`
  const kilometers = distanceMeters / 1000
  return `${new Intl.NumberFormat(locale, { maximumFractionDigits: kilometers < 10 ? 1 : 0 }).format(kilometers)} km`
}

export function formatRating(rating: Venue['rating'], locale = 'en-US'): string | null {
  if (!rating || !Number.isFinite(rating.average) || rating.count < 0) return null
  const score = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(rating.average)
  return `${score} (${rating.count.toLocaleString(locale)})`
}

export function formatOperatingStatus(
  status: VenueOperatingStatus | null | undefined,
): string | null {
  if (!status) return null
  if (status.label) return status.label
  if (status.isOpen && status.closesAt) return `Open · closes ${status.closesAt}`
  if (!status.isOpen && status.opensAt) return `Closed · opens ${status.opensAt}`
  return status.isOpen ? 'Open now' : 'Closed'
}

export function getVenueImage(venue: Venue, fallback?: string): string | null {
  const categoryFallbacks: Readonly<Record<string, string>> = {
    gaming:
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=900&q=80',
    tennis:
      'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=900&q=80',
    football:
      'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&w=900&q=80',
    gym: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=900&q=80',
  }
  return (
    venue.coverMedia?.url ||
    fallback ||
    categoryFallbacks[venue.category.slug] ||
    categoryFallbacks.gym
  )
}
