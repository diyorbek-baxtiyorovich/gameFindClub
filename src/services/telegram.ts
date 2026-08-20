import { applyTelegramTheme } from './telegram-theme'
import type { TelegramButton, TelegramHapticFeedback, TelegramUser, TelegramWebApp } from './telegram.types'

const getWebApp = (): TelegramWebApp | undefined =>
  typeof window === 'undefined' ? undefined : window.Telegram?.WebApp

const handleThemeChanged = (): void => applyTelegramTheme(getWebApp())

export interface TelegramService {
  readonly isAvailable: boolean
  readonly user?: TelegramUser
  readonly backButton?: TelegramButton
  readonly mainButton?: TelegramButton
  readonly haptics?: TelegramHapticFeedback
  openLink(url: string): void
  openTelegramLink(url: string): void
}

export function initializeTelegram(): () => void {
  const webApp = getWebApp()
  applyTelegramTheme(webApp)

  if (!webApp) return () => undefined

  webApp.ready()
  webApp.expand()
  webApp.onEvent?.('themeChanged', handleThemeChanged)

  return () => webApp.offEvent?.('themeChanged', handleThemeChanged)
}

export function getTelegramService(): TelegramService {
  const webApp = getWebApp()

  return {
    isAvailable: Boolean(webApp),
    user: webApp?.initDataUnsafe?.user,
    backButton: webApp?.BackButton,
    mainButton: webApp?.MainButton,
    haptics: webApp?.HapticFeedback,
    openLink(url) {
      if (webApp) webApp.openLink(url)
      else if (typeof window !== 'undefined') window.open(url, '_blank', 'noopener,noreferrer')
    },
    openTelegramLink(url) {
      if (webApp?.openTelegramLink) webApp.openTelegramLink(url)
      else if (webApp) webApp.openLink(url)
      else if (typeof window !== 'undefined') window.open(url, '_blank', 'noopener,noreferrer')
    },
  }
}
