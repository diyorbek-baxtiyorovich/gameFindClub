<script setup lang="ts">
import AppBadge from '@/components/ui/AppBadge.vue'
import { getVenueStatusPresentation, type VenueStatus } from '@/entities/owner'
import { t } from '@/i18n'

const props = defineProps<{ status: VenueStatus }>()
</script>

<template>
  <AppBadge :tone="getVenueStatusPresentation(props.status).tone">
    {{ t(getVenueStatusPresentation(props.status).labelKey) }}
  </AppBadge>
</template>
