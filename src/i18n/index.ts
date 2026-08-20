import { enMessages, type MessageKey } from './messages'
export type { MessageKey } from './messages'
export function t(key: MessageKey, params?: Readonly<Record<string, string | number>>): string {
  let message: string = enMessages[key]
  for (const [name, value] of Object.entries(params ?? {})) message = message.replaceAll(`{${name}}`, String(value))
  return message
}
