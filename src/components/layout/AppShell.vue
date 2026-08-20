<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

import AppBottomNav from '@/components/navigation/AppBottomNav.vue'
import AppOfflineBanner from '@/components/feedback/AppOfflineBanner.vue'
import { useNetworkStatus } from '@/features/status/useNetworkStatus'
import { initializeTelegram } from '@/services'

import AppHeader from './AppHeader.vue'

const route = useRoute()
const { isOnline } = useNetworkStatus()
const standaloneLayout = computed(() => route.meta.standaloneLayout === true)
const showBottomNav = computed(() => !standaloneLayout.value && route.meta.showBottomNav)
const showHeader = computed(() => !standaloneLayout.value && !route.meta.hideHeader)
let disposeTelegram: (() => void) | undefined

onMounted(() => {
  disposeTelegram = initializeTelegram()
})
onUnmounted(() => disposeTelegram?.())
function reload(): void {
  window.location.reload()
}
</script>

<template>
  <div class="shell" :class="{ 'shell--with-nav': showBottomNav, 'shell--standalone': standaloneLayout }">
    <AppHeader
      v-if="showHeader"
      :title="route.meta.title"
      :show-back-button="route.meta.showBackButton"
    />
    <AppOfflineBanner v-if="!isOnline" @retry="reload" />
    <div class="shell__content"><RouterView /></div>
    <AppBottomNav v-if="showBottomNav" />
  </div>
</template>

<style scoped>
.shell {
  width: 100%;
  min-height: 100vh;
  min-height: 100dvh;
  margin-inline: auto;
  padding: var(--safe-area-top) calc(var(--space-4) + var(--safe-area-right))
    calc(var(--space-5) + var(--safe-area-bottom)) calc(var(--space-4) + var(--safe-area-left));
  background: var(--color-bg);
}
.shell--with-nav {
  padding-bottom: calc(84px + var(--safe-area-bottom));
}
.shell--standalone { max-width: none; padding: 0; }
.shell__content {
  min-width: 0;
}
@media (min-width: 520px) {
  .shell {
    max-width: var(--content-max-width);
  }
}
</style>
