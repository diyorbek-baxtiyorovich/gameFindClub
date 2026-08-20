<script setup lang="ts">
import FilterChip from './FilterChip.vue'
defineProps<{ filters: readonly { key: string; label: string }[] }>()
defineEmits<{ remove: [key: string] }>()
</script>
<template><div v-if="filters.length" class="active-filters" aria-label="Active filters"><FilterChip v-for="filter in filters" :key="filter.key" :label="filter.label" @remove="$emit('remove', filter.key)" /></div></template>
<style scoped>.active-filters { display: flex; gap: var(--space-2); overflow-x: auto; padding-bottom: var(--space-1); scrollbar-width: none; }.active-filters::-webkit-scrollbar { display: none; }</style>
