<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

import AppLucideIcon from '@/components/ui/AppLucideIcon.vue'
import AppModal from '@/components/ui/AppModal.vue'
import AppRadio from '@/components/ui/AppRadio.vue'
import AppSwitch from '@/components/ui/AppSwitch.vue'
import { useGeolocationStore } from '@/features/geolocation'
import { getTelegramService } from '@/services'
import { t, useLocale, type Locale } from '@/i18n'
import { useOwnerSessionStore } from '@/stores'

const telegram = getTelegramService()
const router = useRouter()
const ownerSession = useOwnerSessionStore()
const location = useGeolocationStore()
const user = telegram.user
const displayName = computed(() => user ? [user.first_name, user.last_name].filter(Boolean).join(' ') : t('profile.guest'))
const initials = computed(() => displayName.value.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase())
const locationLabel = computed(() => location.manualLocation.district || location.manualLocation.city || (location.hasLocation ? t('profile.current_location') : 'Toshkent'))
const darkMode = ref(document.documentElement.dataset.theme === 'dark')
const languageModalOpen = ref(false)
const { locale, setLocale } = useLocale()

function updateTheme(value: boolean): void {
  darkMode.value = value
  document.documentElement.dataset.theme = value ? 'dark' : 'light'
}

function selectLanguage(value: string | number): void {
  if (value !== 'uz' && value !== 'ru' && value !== 'en') return
  setLocale(value as Locale)
  languageModalOpen.value = false
}

async function openOwnerWorkspace(): Promise<void> {
  if (!ownerSession.enableTemporaryMode()) return
  await router.push({ name: 'owner-dashboard' })
}
</script>

<template>
  <div class="profile-page">
    <header class="profile-page__header">
      <h1>{{ t('profile.title') }}</h1>
      <a href="#profile-settings" :aria-label="t('profile.settings')"><AppLucideIcon name="settings" :size="27" /></a>
    </header>

    <section class="profile-card">
      <img v-if="user?.photo_url" :src="user.photo_url" :alt="displayName" />
      <span v-else class="profile-card__avatar" aria-hidden="true">{{ initials }}</span>
      <div class="profile-card__identity">
        <h2>{{ displayName }}</h2>
        <p><AppLucideIcon name="map-pin" :size="18" />{{ locationLabel }}</p>
        <small>{{ user?.username ? `@${user.username}` : telegram.isAvailable ? t('profile.telegram_user') : t('profile.browser_mode') }}</small>
      </div>
    </section>

    <nav class="profile-links" aria-label="Profil bo‘limlari">
      <RouterLink :to="{ name: 'favorites' }"><AppLucideIcon name="heart" /><strong>{{ t('profile.saved') }}</strong><AppLucideIcon name="chevron-right" /></RouterLink>
      <RouterLink :to="{ name: 'reviews' }"><AppLucideIcon name="message" /><strong>{{ t('profile.my_reviews') }}</strong><AppLucideIcon name="chevron-right" /></RouterLink>
      <RouterLink :to="{ name: 'history' }"><AppLucideIcon name="history" /><strong>{{ t('profile.history') }}</strong><AppLucideIcon name="chevron-right" /></RouterLink>
    </nav>

    <section id="profile-settings" class="profile-settings" aria-label="Sozlamalar">
      <button type="button" :disabled="location.status === 'requesting'" @click="location.requestLocation">
        <AppLucideIcon name="map-pin" /><strong>{{ t('profile.location') }}</strong><span>{{ location.status === 'requesting' ? t('profile.detecting') : locationLabel }}</span><AppLucideIcon name="chevron-right" />
      </button>
      <button type="button" @click="languageModalOpen = true">
        <AppLucideIcon name="globe" /><strong>{{ t('profile.language') }}</strong><span>{{ t(`language.${locale}` as 'language.uz' | 'language.ru' | 'language.en') }}</span><AppLucideIcon name="chevron-right" />
      </button>
      <div class="profile-settings__row">
        <AppLucideIcon name="moon" /><strong>{{ t('profile.theme') }}</strong>
        <AppSwitch :model-value="darkMode" :label="t('profile.dark_theme')" @update:model-value="updateTheme" />
      </div>
      <button type="button"><AppLucideIcon name="bell" /><strong>{{ t('profile.notifications') }}</strong><span /><AppLucideIcon name="chevron-right" /></button>
    </section>

    <button class="owner-entry" type="button" :disabled="!ownerSession.temporaryModeAvailable" @click="openOwnerWorkspace"><AppLucideIcon name="plus" /><span>{{ t('owner.open_workspace') }}</span></button>
    <small v-if="ownerSession.temporaryModeAvailable" class="owner-entry-notice">{{ t('owner.temporary_notice') }}</small>

    <AppModal v-model="languageModalOpen" :title="t('profile.select_language')" :close-label="t('common.close')">
      <div class="language-options">
        <AppRadio :model-value="locale" value="uz" name="profile-language" :label="t('language.uz')" @change="selectLanguage" />
        <AppRadio :model-value="locale" value="ru" name="profile-language" :label="t('language.ru')" @change="selectLanguage" />
        <AppRadio :model-value="locale" value="en" name="profile-language" :label="t('language.en')" @change="selectLanguage" />
      </div>
    </AppModal>
  </div>
</template>

<style scoped>
.profile-page { display: grid; gap: var(--space-5); padding-bottom: var(--space-4); }
.profile-page__header { min-height: 72px; display: flex; align-items: center; justify-content: space-between; }
.profile-page__header h1 { margin: 0; color: var(--color-primary); font-size: var(--font-size-2xl); }
.profile-page__header a { width: var(--touch-target-min); height: var(--touch-target-min); display: grid; place-items: center; border-radius: 50%; color: var(--color-primary); }
.profile-page__header a:hover { background: var(--color-surface-muted); }
.profile-card { min-height: 132px; display: flex; align-items: center; gap: var(--space-4); padding: var(--space-5); border: 1px solid var(--color-border); border-radius: var(--radius-xl); background: var(--color-surface); box-shadow: var(--elevation-1); }
.profile-card img, .profile-card__avatar { width: 78px; height: 78px; display: grid; place-items: center; flex: 0 0 auto; border: 1px solid var(--color-border); border-radius: 50%; object-fit: cover; color: var(--color-text-inverse); background: linear-gradient(145deg, var(--color-primary), var(--color-primary-strong)); font-size: var(--font-size-xl); font-weight: var(--font-weight-bold); }
.profile-card__identity { min-width: 0; }
.profile-card h2, .profile-card p { margin: 0; }
.profile-card h2 { overflow: hidden; font-size: var(--font-size-xl); text-overflow: ellipsis; white-space: nowrap; }
.profile-card p { display: flex; align-items: center; gap: var(--space-1); margin-top: var(--space-2); color: var(--color-text-secondary); }
.profile-card small { display: block; overflow: hidden; margin-top: var(--space-1); color: var(--color-text-secondary); text-overflow: ellipsis; white-space: nowrap; }
.profile-links, .profile-settings { display: grid; overflow: hidden; border: 1px solid var(--color-border); border-radius: var(--radius-xl); background: var(--color-surface); box-shadow: var(--elevation-1); }
.profile-links a, .profile-settings button, .profile-settings__row { min-height: 68px; display: grid; grid-template-columns: 28px minmax(0, 1fr) auto auto; align-items: center; gap: var(--space-3); padding: 0 var(--space-4); border: 0; border-bottom: 1px solid var(--color-border); color: var(--color-text-primary); background: transparent; text-align: left; text-decoration: none; }
.profile-links a { grid-template-columns: 28px minmax(0, 1fr) auto; }
.profile-links a:last-child, .profile-settings > :last-child { border-bottom: 0; }
.profile-links svg:first-child { color: var(--color-primary); }
.profile-links svg:last-child, .profile-settings svg:last-child { color: var(--color-text-secondary); }
.profile-links strong, .profile-settings strong { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.profile-settings button { font: inherit; cursor: pointer; }
.profile-settings button:disabled { cursor: wait; opacity: .65; }
.profile-settings button > span { max-width: 120px; overflow: hidden; color: var(--color-text-secondary); text-overflow: ellipsis; white-space: nowrap; }
.profile-settings__row :deep(.app-switch) { min-height: auto; justify-self: end; }
.profile-settings__row :deep(.app-switch > span:first-child) { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); }
.owner-entry { min-height: 72px; display: flex; align-items: center; justify-content: center; gap: var(--space-2); border: 1px dashed var(--color-border-strong); border-radius: var(--radius-xl); color: var(--color-primary); background: transparent; font: inherit; font-size: var(--font-size-lg); font-weight: var(--font-weight-semibold); opacity: .9; }
.owner-entry:disabled { cursor: not-allowed; opacity: .5; }
.owner-entry-notice { margin-top: calc(var(--space-3) * -1); color: var(--color-text-secondary); text-align: center; }
.language-options { display: grid; overflow: hidden; border: 1px solid var(--color-border); border-radius: var(--radius-lg); }
.language-options :deep(.app-radio) { width: 100%; min-height: 60px; padding-inline: var(--space-4); border-bottom: 1px solid var(--color-border); }
.language-options :deep(.app-radio:last-child) { border-bottom: 0; }
@media (max-width: 350px) {
  .profile-page { gap: var(--space-4); }
  .profile-card { min-height: 112px; padding: var(--space-4); }
  .profile-card img, .profile-card__avatar { width: 64px; height: 64px; }
  .profile-card h2 { font-size: var(--font-size-lg); }
  .profile-links a, .profile-settings button, .profile-settings__row { min-height: 62px; gap: var(--space-2); padding-inline: var(--space-3); }
  .profile-settings button > span { max-width: 82px; }
}
</style>
