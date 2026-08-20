export type PrimaryRouteName = 'home' | 'explore' | 'map' | 'favorites' | 'profile'

export interface NavigationItem {
  routeName: PrimaryRouteName
  label: string
  labelKey: string
  icon: string
}

export const PRIMARY_NAVIGATION: readonly NavigationItem[] = [
  { routeName: 'home', label: 'Bosh', labelKey: 'navigation.home', icon: 'home' },
  { routeName: 'explore', label: 'Qidiruv', labelKey: 'navigation.explore', icon: 'search' },
  { routeName: 'map', label: 'Xarita', labelKey: 'navigation.map', icon: 'map' },
  { routeName: 'favorites', label: 'Saqlangan', labelKey: 'navigation.saved', icon: 'heart' },
  { routeName: 'profile', label: 'Profil', labelKey: 'navigation.profile', icon: 'user' },
]
