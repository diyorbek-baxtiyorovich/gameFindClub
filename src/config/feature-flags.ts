export interface FeatureFlags {
  booking: boolean
  payments: boolean
  loyalty: boolean
  events: boolean
  aiRecommendations: boolean
  chat: boolean
}

export interface VenueActionFeatureFlags {
  booking: boolean
  calling: boolean
  directions: boolean
  externalLinks: boolean
}

export const FEATURE_FLAGS: Readonly<FeatureFlags> = {
  booking: false,
  payments: false,
  loyalty: false,
  events: false,
  aiRecommendations: false,
  chat: false,
}

export function isFeatureEnabled(feature: keyof FeatureFlags): boolean {
  return FEATURE_FLAGS[feature]
}

export const VENUE_ACTION_FEATURES: Readonly<VenueActionFeatureFlags> = {
  booking: FEATURE_FLAGS.booking,
  calling: true,
  directions: true,
  externalLinks: true,
}
