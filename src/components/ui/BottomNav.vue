<template>
  <div class="bottom-wrapper">
    <v-bottom-navigation height="60" grow class="bottom-nav">
      <v-btn
        v-for="item in navItems"
        :key="item.value"
        :to="item.to"
        variant="text"
        class="nav-btn"
      >
        <v-icon :color="isActive(item.to) ? 'primary' : '#9ca3af'" size="26">
          {{ item.icon }}
        </v-icon>

        <span class="nav-label" :class="{ active: isActive(item.to) }">
          {{ item.label }}
        </span>
      </v-btn>
    </v-bottom-navigation>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()

const navItems = [
  { to: '/', value: 'home', icon: 'mdi-home', label: 'Home' },
  { to: '/favorites', value: 'favorites', icon: 'mdi-heart-outline', label: 'Favorites' },
  { to: '/history', value: 'history', icon: 'mdi-history', label: 'History' },
  { to: '/profile', value: 'profile', icon: 'mdi-account-circle-outline', label: 'Profile' },
]

const isActive = (path) => route.path === path
</script>

<style scoped>
.bottom-wrapper {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;

  display: flex;
  justify-content: center;

  z-index: 1000000;
}

.bottom-nav {
  width: 100%;

  border-radius: 0 0 20px 20px;

  background: transparent;

  backdrop-filter: blur(10px);

  border: 1px solid rgba(255, 255, 255, 0.05);
}

.nav-btn {
  min-height: 100%;

  display: flex;
  flex-direction: column;
  justify-content: center;

  gap: 4px;

  padding: 0;
}

.nav-label {
  font-size: 12px;
  color: #9ca3af;
  transition: all 0.2s ease;
}

.nav-label.active {
  color: rgb(var(--v-theme-primary));
  font-weight: 600;
}
</style>
