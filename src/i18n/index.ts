import { readonly, ref, watch } from 'vue'

import { messages, type Locale, type MessageKey } from './messages'

export type { Locale, MessageKey } from './messages'

const STORAGE_KEY = 'game-club-finder.locale'
const browserLocale =
  typeof navigator === 'undefined' ? 'uz' : navigator.language.toLowerCase().split('-')[0]
const storedLocale = typeof localStorage === 'undefined' ? null : localStorage.getItem(STORAGE_KEY)
const initialLocale: Locale =
  storedLocale === 'uz' || storedLocale === 'ru' || storedLocale === 'en'
    ? storedLocale
    : browserLocale === 'ru' || browserLocale === 'en'
      ? browserLocale
      : 'uz'

const locale = ref<Locale>(initialLocale)

export function t(key: MessageKey, params?: Readonly<Record<string, string | number>>): string {
  let message: string = messages[locale.value][key] ?? messages.en[key]
  for (const [name, value] of Object.entries(params ?? {}))
    message = message.replaceAll(`{${name}}`, String(value))
  return message
}

export function setLocale(value: Locale): void {
  locale.value = value
}

export function useLocale() {
  return { locale: readonly(locale), setLocale, t }
}

watch(
  locale,
  (value) => {
    document.documentElement.lang = value
    localStorage.setItem(STORAGE_KEY, value)
  },
  { immediate: true },
)
