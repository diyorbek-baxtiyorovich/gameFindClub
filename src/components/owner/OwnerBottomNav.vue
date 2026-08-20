<script setup lang="ts">
import { useRoute } from 'vue-router'

import AppLucideIcon from '@/components/ui/AppLucideIcon.vue'
import { OWNER_NAVIGATION } from '@/config'
import { t, type MessageKey } from '@/i18n'

const route = useRoute()
</script>

<template>
  <nav class="owner-nav" :aria-label="t('owner.workspace')">
    <RouterLink
      v-for="item in OWNER_NAVIGATION"
      :key="item.routeName"
      :to="{ name: item.routeName }"
      class="owner-nav__item"
      :class="{ 'owner-nav__item--active': route.name === item.routeName }"
      :aria-current="route.name === item.routeName ? 'page' : undefined"
    >
      <AppLucideIcon :name="item.icon" :size="22" />
      <span>{{ t(item.labelKey as MessageKey) }}</span>
    </RouterLink>
  </nav>
</template>

<style scoped>
.owner-nav { position: fixed; z-index: 100; right: 50%; bottom: 0; width: min(100%, var(--content-max-width)); min-height: calc(70px + var(--safe-area-bottom)); display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); padding: var(--space-1) var(--safe-area-right) var(--safe-area-bottom) var(--safe-area-left); transform: translateX(50%); border: 1px solid var(--color-border); border-bottom: 0; background: color-mix(in srgb, var(--color-surface) 97%, transparent); box-shadow: var(--elevation-2); backdrop-filter: blur(14px); }
.owner-nav__item { min-width: 0; min-height: 64px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px; border-radius: var(--radius-md); color: var(--color-text-secondary); text-decoration: none; font-size: .625rem; font-weight: var(--font-weight-medium); }
.owner-nav__item--active { color: var(--color-primary); background: var(--color-primary-soft); }
.owner-nav__item span { max-width: 100%; overflow: hidden; padding-inline: 2px; text-overflow: ellipsis; white-space: nowrap; }
</style>
