<script setup lang="ts">
import { computed } from 'vue'
import { getCategoryByCode } from '@/config'
import type { VenueDetail } from '../../model/venue'
import { CATEGORY_DETAIL_REGISTRY } from './category-detail.registry'

const props = defineProps<{ venue: VenueDetail }>()
const sections = computed(() => (getCategoryByCode(props.venue.category.slug).detailSections ?? [])
  .filter((section) => section.source in CATEGORY_DETAIL_REGISTRY)
  .map((section) => ({ ...section, component: CATEGORY_DETAIL_REGISTRY[section.source as keyof typeof CATEGORY_DETAIL_REGISTRY] })))
</script>
<template><component :is="section.component" v-for="section in sections" :key="section.id" :title="section.label.defaultValue" :resources="venue.resources ?? []" /></template>
