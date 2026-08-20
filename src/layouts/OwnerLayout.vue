<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import OwnerBottomNav from '@/components/owner/OwnerBottomNav.vue'
import AppLucideIcon from '@/components/ui/AppLucideIcon.vue'
import { t, type MessageKey } from '@/i18n'
import { useOwnerSessionStore } from '@/stores'
import { useTelegramBackButton } from '@/composables/useTelegramBackButton'

const route = useRoute()
const router = useRouter()
const ownerSession = useOwnerSessionStore()
const showBottomNav = computed(() => route.meta.ownerShowBottomNav !== false)
const showHeader = computed(() => !route.meta.hideOwnerHeader)
const title = computed(() =>
  route.meta.ownerTitleKey ? t(route.meta.ownerTitleKey as MessageKey) : t('owner.workspace'),
)

async function exitOwnerWorkspace(): Promise<void> {
  ownerSession.disableTemporaryMode()
  await router.push({ name: 'profile' })
}

function handleTelegramBack(): void {
  void router.push({ name: 'profile' })
}

useTelegramBackButton(handleTelegramBack, showHeader)
</script>

<template>
  <div class="owner-layout" :class="{ 'owner-layout--with-nav': showBottomNav }">
    <header v-if="showHeader" class="owner-layout__header">
      <slot name="header">
        <div class="owner-layout__identity">
          <small>{{ t('owner.workspace') }}</small>
          <h1>{{ title }}</h1>
        </div>
        <button type="button" :aria-label="t('owner.back_to_user')" @click="exitOwnerWorkspace">
          <AppLucideIcon name="user" :size="22" />
        </button>
      </slot>
    </header>
    <main class="owner-layout__content"><RouterView /></main>
    <slot name="bottom-navigation"><OwnerBottomNav v-if="showBottomNav" /></slot>
  </div>
</template>

<style scoped>
.owner-layout {
  width: 100%;
  max-width: var(--content-max-width);
  min-height: 100vh;
  min-height: 100dvh;
  margin-inline: auto;
  padding: var(--safe-area-top) calc(var(--space-4) + var(--safe-area-right))
    calc(var(--space-5) + var(--safe-area-bottom)) calc(var(--space-4) + var(--safe-area-left));
  background: var(--color-bg);
}
.owner-layout--with-nav {
  padding-bottom: calc(84px + var(--safe-area-bottom));
}
.owner-layout__header {
  min-height: 68px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  border-bottom: 1px solid var(--color-border);
}
.owner-layout__identity {
  min-width: 0;
}
.owner-layout__identity small {
  color: var(--color-primary);
  font-weight: var(--font-weight-semibold);
}
.owner-layout__identity h1 {
  margin: 2px 0 0;
  overflow: hidden;
  font-size: var(--font-size-xl);
  text-overflow: ellipsis;
  white-space: nowrap;
}
.owner-layout__header button {
  width: var(--touch-target-min);
  height: var(--touch-target-min);
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  border: 1px solid var(--color-border);
  border-radius: 50%;
  color: var(--color-primary);
  background: var(--color-surface);
  cursor: pointer;
}
.owner-layout__content {
  min-width: 0;
  padding-top: var(--space-5);
}
</style>
