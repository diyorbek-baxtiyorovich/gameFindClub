<script setup lang="ts">
import VenueCard from '@/entities/venue/components/VenueCard.vue'
import type { VenueListItem } from '@/entities/venue/model/venue'
defineProps<{ venue: VenueListItem }>()
defineEmits<{ favorite: [venue: VenueListItem] }>()
</script>
<template><VenueCard :venue="venue" variant="map-preview" @favorite="$emit('favorite', $event)" /></template>
