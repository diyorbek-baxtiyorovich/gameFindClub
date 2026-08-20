import { onUnmounted, toValue, watch, type MaybeRefOrGetter } from 'vue'
import { registerTelegramBackHandler } from '@/services/telegram-back-button'

export function useTelegramBackButton(
  handler: () => void,
  enabled: MaybeRefOrGetter<boolean> = true,
): void {
  const registration = registerTelegramBackHandler(handler)
  watch(() => toValue(enabled), (value) => registration.setEnabled(value), { immediate: true })
  onUnmounted(() => registration.dispose())
}
