import type { TelegramThemeParams, TelegramWebApp } from './telegram.types'

type SemanticToken =
  | '--color-bg'
  | '--color-surface'
  | '--color-surface-raised'
  | '--color-text-primary'
  | '--color-text-secondary'
  | '--color-primary'
  | '--color-text-inverse'
  | '--color-border'
  | '--color-danger'

const themeMap: Readonly<Partial<Record<keyof TelegramThemeParams, SemanticToken>>> = {
  bg_color: '--color-bg',
  secondary_bg_color: '--color-surface',
  section_bg_color: '--color-surface-raised',
  text_color: '--color-text-primary',
  hint_color: '--color-text-secondary',
  button_color: '--color-primary',
  button_text_color: '--color-text-inverse',
  section_separator_color: '--color-border',
  destructive_text_color: '--color-danger',
}

export function applyTelegramTheme(webApp?: TelegramWebApp): void {
  if (typeof document === 'undefined') return

  const root = document.documentElement
  const colorScheme = webApp?.colorScheme

  if (colorScheme) root.dataset.theme = colorScheme

  const themeParams = webApp?.themeParams
  if (!themeParams) return

  for (const [telegramKey, semanticToken] of Object.entries(themeMap)) {
    const value = themeParams[telegramKey as keyof TelegramThemeParams]
    if (value && semanticToken) root.style.setProperty(semanticToken, value)
  }
}

export function clearTelegramTheme(): void {
  if (typeof document === 'undefined') return

  const root = document.documentElement
  delete root.dataset.theme
  for (const semanticToken of Object.values(themeMap)) {
    if (semanticToken) root.style.removeProperty(semanticToken)
  }
}
