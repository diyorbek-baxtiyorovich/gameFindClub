<script setup lang="ts">
import AppEmptyState from '@/components/feedback/AppEmptyState.vue'
import AppLucideIcon from '@/components/ui/AppLucideIcon.vue'
import { t } from '@/i18n'
</script>

<template>
  <AppEmptyState
    :title="t('owner.foundation_title')"
    :description="t('owner.foundation_description')"
  >
    <template #icon><AppLucideIcon name="settings" /></template>
  </AppEmptyState>
</template>
