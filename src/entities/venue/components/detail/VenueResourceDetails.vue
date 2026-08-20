<script setup lang="ts">
import type { VenueResource } from '../../model/venue'
import DetailSection from './DetailSection.vue'

defineProps<{ title: string; resources: readonly VenueResource[] }>()
const label = (key: string): string => key.replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/[-_]/g, ' ').replace(/^./, (value) => value.toUpperCase())
const value = (input: unknown): string => Array.isArray(input) ? input.join(', ') : typeof input === 'boolean' ? input ? 'Yes' : 'No' : input == null ? '—' : String(input)
</script>
<template><DetailSection v-if="resources.length" :title="title"><div class="resources"><article v-for="resource in resources" :key="resource.id"><header><h3>{{ resource.name }}</h3><span v-if="resource.quantity">{{ resource.quantity }} available</span></header><dl v-if="resource.attributes"><template v-for="(attribute, key) in resource.attributes" :key="key"><dt>{{ label(String(key)) }}</dt><dd>{{ value(attribute) }}</dd></template></dl></article></div></DetailSection></template>
<style scoped>.resources { display: grid; gap: var(--space-3); }.resources article { padding: var(--space-3); border: 1px solid var(--color-border); border-radius: var(--radius-md); background: var(--color-surface); }.resources header { display: flex; justify-content: space-between; gap: var(--space-3); }.resources h3 { margin: 0; font-size: var(--font-size-md); }.resources header span { color: var(--color-text-secondary); font-size: var(--font-size-xs); }.resources dl { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: var(--space-2); margin: var(--space-3) 0 0; }.resources dt { color: var(--color-text-secondary); font-size: var(--font-size-sm); }.resources dd { margin: 0; overflow-wrap: anywhere; text-align: right; font-weight: var(--font-weight-medium); font-size: var(--font-size-sm); }</style>
