import { getTelegramService } from './telegram'

interface BackHandlerRegistration {
  id: symbol
  handler: () => void
  enabled: boolean
}

const registrations: BackHandlerRegistration[] = []
let attachedHandler: (() => void) | undefined

function syncBackButton(): void {
  const button = getTelegramService().backButton
  if (!button) return
  if (attachedHandler) button.offClick(attachedHandler)
  const active = [...registrations].reverse().find((registration) => registration.enabled)
  attachedHandler = active?.handler
  if (attachedHandler) {
    button.onClick(attachedHandler)
    button.show()
  } else button.hide()
}

export interface TelegramBackHandlerRegistration {
  setEnabled(enabled: boolean): void
  dispose(): void
}

/** Maintains one active Telegram SDK callback while nested Owner flows register handlers. */
export function registerTelegramBackHandler(handler: () => void): TelegramBackHandlerRegistration {
  const registration: BackHandlerRegistration = { id: Symbol('telegram-back'), handler, enabled: true }
  registrations.push(registration)
  syncBackButton()
  return {
    setEnabled(enabled) {
      registration.enabled = enabled
      syncBackButton()
    },
    dispose() {
      const index = registrations.findIndex((item) => item.id === registration.id)
      if (index >= 0) registrations.splice(index, 1)
      syncBackButton()
    },
  }
}
