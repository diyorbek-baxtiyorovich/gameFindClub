<script setup lang="ts">
import type { Activity } from '../../model/venue'
import DetailSection from './DetailSection.vue'
defineProps<{ items?: readonly Activity[] }>()
</script>
<template><DetailSection v-if="items?.length" title="Activities"><ul class="tag-list"><li v-for="item in items" :key="item.id">{{ item.name }}</li></ul></DetailSection></template>
<style scoped>.tag-list { display: flex; flex-wrap: wrap; gap: var(--space-2); margin: 0; padding: 0; list-style: none; }.tag-list li { padding: var(--space-2) var(--space-3); border-radius: var(--radius-pill); background: var(--color-surface-muted); font-size: var(--font-size-sm); }</style>
