import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { TEMPORARY_OWNER_MODE_AVAILABLE } from '@/config'
import type { OwnerProfile } from '@/entities/owner'
import { ownerProfileFixture } from '@/fixtures/owner'
import { getTelegramService } from '@/services'

export const useOwnerSessionStore = defineStore('owner-session', () => {
  const temporaryModeEnabled = ref(false)
  const temporaryModeAvailable = TEMPORARY_OWNER_MODE_AVAILABLE

  const profile = computed<OwnerProfile>(() => {
    const telegramUser = getTelegramService().user
    if (!telegramUser) return ownerProfileFixture
    return {
      ...ownerProfileFixture,
      telegramUserId: telegramUser.id,
      username: telegramUser.username ?? ownerProfileFixture.username,
      displayName: [telegramUser.first_name, telegramUser.last_name].filter(Boolean).join(' '),
      avatarUrl: telegramUser.photo_url,
    }
  })

  const canAccessOwnerWorkspace = computed(
    () => temporaryModeAvailable && temporaryModeEnabled.value,
  )

  function enableTemporaryMode(): boolean {
    if (!temporaryModeAvailable) return false
    temporaryModeEnabled.value = true
    return true
  }

  function disableTemporaryMode(): void {
    temporaryModeEnabled.value = false
  }

  return {
    profile,
    temporaryModeAvailable,
    temporaryModeEnabled,
    canAccessOwnerWorkspace,
    enableTemporaryMode,
    disableTemporaryMode,
  }
})
