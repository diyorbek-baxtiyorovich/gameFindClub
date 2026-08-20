export interface TelegramUser {
  id: number
  first_name: string
  last_name?: string
  username?: string
  language_code?: string
  is_premium?: boolean
  photo_url?: string
}

export interface TelegramThemeParams {
  bg_color?: string
  secondary_bg_color?: string
  text_color?: string
  hint_color?: string
  link_color?: string
  button_color?: string
  button_text_color?: string
  header_bg_color?: string
  accent_text_color?: string
  section_bg_color?: string
  section_separator_color?: string
  destructive_text_color?: string
}

export interface TelegramButton {
  show(): void
  hide(): void
  enable?(): void
  disable?(): void
  setText?(text: string): void
  onClick(callback: () => void): void
  offClick(callback: () => void): void
}

export interface TelegramHapticFeedback {
  impactOccurred(style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft'): void
  notificationOccurred(type: 'error' | 'success' | 'warning'): void
  selectionChanged(): void
}

export interface TelegramLocationData {
  latitude: number
  longitude: number
  altitude?: number | null
  course?: number | null
  speed?: number | null
  horizontal_accuracy?: number | null
  vertical_accuracy?: number | null
}

export interface TelegramLocationManager {
  isInited: boolean
  isLocationAvailable: boolean
  isAccessRequested: boolean
  isAccessGranted: boolean
  init(callback?: () => void): TelegramLocationManager
  getLocation(callback: (location: TelegramLocationData | null) => void): TelegramLocationManager
  openSettings(): TelegramLocationManager
}

export interface TelegramWebApp {
  colorScheme?: 'light' | 'dark'
  themeParams?: TelegramThemeParams
  initDataUnsafe?: { user?: TelegramUser }
  BackButton?: TelegramButton
  MainButton?: TelegramButton
  HapticFeedback?: TelegramHapticFeedback
  LocationManager?: TelegramLocationManager
  ready(): void
  expand(): void
  openLink(url: string): void
  openTelegramLink?(url: string): void
  onEvent?(event: 'themeChanged', callback: () => void): void
  offEvent?(event: 'themeChanged', callback: () => void): void
}

declare global {
  interface Window {
    Telegram?: { WebApp?: TelegramWebApp }
  }
}
