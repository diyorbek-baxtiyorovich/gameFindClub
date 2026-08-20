<script setup lang="ts">
import { t } from '@/i18n'
import AppEmptyState from './AppEmptyState.vue'
defineEmits<{ action: [] }>()
</script>
<template>
  <AppEmptyState
    :title="t('common.unauthorized')"
    description="Continue in Telegram or sign in to access this content."
    action-label="Continue"
    @action="$emit('action')"
  />
</template>
