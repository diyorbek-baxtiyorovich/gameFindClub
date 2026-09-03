export type PrimaryRouteName = 'home' | 'explore' | 'bookings' | 'favorites' | 'profile'

export interface NavigationItem {
  routeName: PrimaryRouteName
  label: string
  labelKey: string
  icon: string
}

export const PRIMARY_NAVIGATION: readonly NavigationItem[] = [
  { routeName: 'home', label: 'Bosh', labelKey: 'navigation.home', icon: 'home' },
  { routeName: 'explore', label: 'Qidiruv', labelKey: 'navigation.explore', icon: 'search' },
  { routeName: 'bookings', label: 'Bandlar', labelKey: 'navigation.bookings', icon: 'calendar' },
  { routeName: 'favorites', label: 'Saqlangan', labelKey: 'navigation.saved', icon: 'heart' },
  { routeName: 'profile', label: 'Profil', labelKey: 'navigation.profile', icon: 'user' },
]
