<script setup lang="ts">
import AppEmptyState from '@/components/feedback/AppEmptyState.vue'
import AppButton from '@/components/ui/AppButton.vue'
import VenueList from '@/components/venue/VenueList.vue'
import { useHistoryStore } from '@/stores'
const history = useHistoryStore()
</script>
<template><section class="history-page"><div v-if="history.items.length" class="history-page__header"><p>Recently viewed venues</p><AppButton variant="ghost" @click="history.clear">Clear</AppButton></div><AppEmptyState v-if="history.items.length === 0" title="No recent venues" description="Venues you open will appear here." /><VenueList v-else :items="history.items" card-variant="horizontal" /></section></template>
<style scoped>.history-page { display: grid; gap: var(--space-4); padding-block: var(--space-3); }.history-page__header { display: flex; align-items: center; justify-content: space-between; }.history-page__header p { margin: 0; color: var(--color-text-secondary); }</style>
