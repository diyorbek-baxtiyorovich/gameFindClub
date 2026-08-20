<script setup lang="ts">
import { computed, ref } from 'vue'

import AppButton from '@/components/ui/AppButton.vue'
import AppSelect from '@/components/ui/AppSelect.vue'
import AppSwitch from '@/components/ui/AppSwitch.vue'
import AppLucideIcon from '@/components/ui/AppLucideIcon.vue'
import { useGeolocationStore } from '@/features/geolocation'
import { getTelegramService } from '@/services'

const telegram = getTelegramService()
const location = useGeolocationStore()
const user = telegram.user
const displayName = computed(() => user ? [user.first_name, user.last_name].filter(Boolean).join(' ') : 'Guest user')
const initials = computed(() => displayName.value.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase())
const darkMode = ref(document.documentElement.dataset.theme === 'dark')
const language = ref<string | number | null>('en')

function updateTheme(value: boolean): void {
  darkMode.value = value
  document.documentElement.dataset.theme = value ? 'dark' : 'light'
}
</script>

<template>
  <div class="profile-page">
    <section class="profile-card">
      <img v-if="user?.photo_url" :src="user.photo_url" :alt="displayName" />
      <span v-else class="profile-card__avatar" aria-hidden="true">{{ initials }}</span>
      <div><h2>{{ displayName }}</h2><p>{{ user?.username ? `@${user.username}` : telegram.isAvailable ? 'Telegram user' : 'Local browser mode' }}</p></div>
    </section>

    <nav class="profile-links" aria-label="Profile shortcuts">
      <RouterLink :to="{ name: 'favorites' }"><AppLucideIcon name="heart" /><strong>Favorites</strong><AppLucideIcon name="chevron-right" /></RouterLink>
      <RouterLink :to="{ name: 'reviews' }"><AppLucideIcon name="star" /><strong>Reviews</strong><AppLucideIcon name="chevron-right" /></RouterLink>
      <RouterLink :to="{ name: 'history' }"><AppLucideIcon name="clock" /><strong>History</strong><AppLucideIcon name="chevron-right" /></RouterLink>
    </nav>

    <section class="profile-settings">
      <h2>Settings</h2>
      <AppSelect v-model="language" label="Language" :options="[{ value: 'en', label: 'English' }, { value: 'uz', label: 'O‘zbekcha' }]" />
      <AppSwitch :model-value="darkMode" label="Dark theme" description="Theme preference foundation." @update:model-value="updateTheme" />
      <div class="profile-settings__location">
        <div><strong>Location access</strong><span>{{ location.status === 'granted' ? 'Enabled' : location.status === 'denied' ? 'Denied' : 'Not enabled' }}</span></div>
        <AppButton variant="secondary" :loading="location.status === 'requesting'" @click="location.requestLocation">Update</AppButton>
      </div>
    </section>

    <section class="owner-entry">
      <div><h2>Venue owners</h2><p>Owner tools will be available in a future release.</p></div>
      <AppButton variant="secondary" disabled>Add venue</AppButton>
    </section>
  </div>
</template>

<style scoped>
.profile-page { display: grid; gap: var(--space-6); padding-block: var(--space-3); }
.profile-card { display: flex; align-items: center; gap: var(--space-4); padding: var(--space-4); border: 1px solid var(--color-border); border-radius: var(--radius-xl); background: var(--color-surface); }
.profile-card img, .profile-card__avatar { width: 64px; height: 64px; display: grid; place-items: center; flex: 0 0 auto; border-radius: 50%; object-fit: cover; color: var(--color-text-inverse); background: var(--color-primary); font-weight: var(--font-weight-bold); }
.profile-card h2, .profile-card p, .profile-settings h2, .owner-entry h2, .owner-entry p { margin: 0; }.profile-card p, .owner-entry p { color: var(--color-text-secondary); font-size: var(--font-size-sm); }
.profile-links { display: grid; overflow: hidden; border: 1px solid var(--color-border); border-radius: var(--radius-lg); background: var(--color-surface); }.profile-links a { min-height: 52px; display: grid; grid-template-columns: 28px 1fr auto; align-items: center; gap: var(--space-2); padding: 0 var(--space-4); border-bottom: 1px solid var(--color-border); color: var(--color-text-primary); text-decoration: none; }.profile-links a:last-child { border-bottom: 0; }.profile-links a > span:last-child { color: var(--color-text-secondary); font-size: var(--font-size-xl); }
.profile-settings { display: grid; gap: var(--space-4); }.profile-settings__location { min-height: var(--touch-target-min); display: flex; align-items: center; justify-content: space-between; gap: var(--space-3); }.profile-settings__location strong, .profile-settings__location span { display: block; }.profile-settings__location span { color: var(--color-text-secondary); font-size: var(--font-size-sm); }
.owner-entry { display: flex; align-items: center; justify-content: space-between; gap: var(--space-3); padding: var(--space-4); border: 1px dashed var(--color-border-strong); border-radius: var(--radius-lg); }
</style>
