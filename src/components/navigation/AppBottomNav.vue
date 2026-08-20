<script setup lang="ts">
import { useRoute } from 'vue-router'

import { PRIMARY_NAVIGATION } from '@/config'
import AppLucideIcon from '@/components/ui/AppLucideIcon.vue'

const route = useRoute()
</script>

<template>
  <nav class="bottom-nav" aria-label="Primary navigation">
    <RouterLink
      v-for="item in PRIMARY_NAVIGATION"
      :key="item.routeName"
      class="bottom-nav__item"
      :class="{ 'bottom-nav__item--active': route.name === item.routeName }"
      :to="{ name: item.routeName }"
      :aria-current="route.name === item.routeName ? 'page' : undefined"
    >
      <span class="bottom-nav__icon"><AppLucideIcon :name="item.icon" :size="23" /></span>
      <span>{{ item.label }}</span>
    </RouterLink>
  </nav>
</template>

<style scoped>
.bottom-nav {
  position: fixed;
  z-index: 100;
  right: 0;
  bottom: 0;
  left: 0;
  min-height: calc(70px + var(--safe-area-bottom));
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  padding: var(--space-1) var(--safe-area-right) var(--safe-area-bottom) var(--safe-area-left);
  border-top: 1px solid var(--color-border);
  background: color-mix(in srgb, var(--color-surface) 97%, transparent);
  box-shadow: 0 -4px 18px rgb(15 23 42 / 4%);
  backdrop-filter: blur(14px);
}
.bottom-nav__item {
  min-width: 0;
  min-height: 64px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  border-radius: var(--radius-md);
  color: var(--color-text-secondary);
  text-decoration: none;
  font-size: 0.625rem;
  font-weight: var(--font-weight-medium);
}
.bottom-nav__item--active {
  color: var(--color-primary);
}
.bottom-nav__icon {
  font-size: 1.45rem;
  font-weight: var(--font-weight-semibold);
  line-height: 1;
}
@media (min-width: 520px) {
  .bottom-nav {
    right: 50%;
    left: auto;
    width: var(--content-max-width);
    transform: translateX(50%);
    border-right: 1px solid var(--color-border);
    border-left: 1px solid var(--color-border);
  }
}
</style>
