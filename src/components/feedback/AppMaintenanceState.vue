<script setup lang="ts">
import { t } from '@/i18n'
import AppErrorState from './AppErrorState.vue'
defineEmits<{ retry: [] }>()
</script>
<template>
  <AppErrorState
    :title="t('common.maintenance')"
    description="This area is undergoing maintenance. Please return shortly."
    @retry="$emit('retry')"
  />
</template>
