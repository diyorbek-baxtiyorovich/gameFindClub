<script setup lang="ts">
import VenueRail from '@/components/venue/VenueRail.vue'
import type { VenueListItem } from '../../model/venue'
defineProps<{ items?: readonly VenueListItem[] }>()
</script>
<template><VenueRail v-if="items?.length" title="Similar venues" :items="items" /></template>
