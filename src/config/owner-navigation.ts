export type OwnerPrimaryRouteName =
  | 'owner-dashboard'
  | 'owner-venues'
  | 'owner-reviews'
  | 'owner-analytics'

export interface OwnerNavigationItem {
  routeName: OwnerPrimaryRouteName
  labelKey: string
  icon: string
}

export const OWNER_NAVIGATION: readonly OwnerNavigationItem[] = [
  { routeName: 'owner-dashboard', labelKey: 'owner.nav.dashboard', icon: 'gauge' },
  { routeName: 'owner-venues', labelKey: 'owner.nav.venues', icon: 'list' },
  { routeName: 'owner-reviews', labelKey: 'owner.nav.reviews', icon: 'message' },
  { routeName: 'owner-analytics', labelKey: 'owner.nav.analytics', icon: 'analytics' },
]
