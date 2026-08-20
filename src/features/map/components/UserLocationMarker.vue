<script setup lang="ts">
import L from 'leaflet'
import { inject, onBeforeUnmount, watch } from 'vue'
import type { GeoPoint } from '@/entities/venue'
import { MAP_LAYER_CONTEXT } from './map.context'

const props = defineProps<{ point?: GeoPoint | null }>()
const injectedContext = inject(MAP_LAYER_CONTEXT)
if (!injectedContext) throw new Error('UserLocationMarker must be used inside VenueMap.')
const context = injectedContext
let marker: L.CircleMarker | undefined

function render(): void {
  if (marker && context.target.value) context.target.value.removeLayer(marker)
  marker = undefined
  if (!props.point || !context.target.value) return
  marker = L.circleMarker([props.point.latitude, props.point.longitude], { radius: 8, color: '#fff', weight: 3, fillColor: '#3157d5', fillOpacity: 1 })
  marker.bindTooltip('Your location')
  context.target.value.addLayer(marker)
}

watch([context.target, () => props.point], render, { immediate: true, deep: true })
onBeforeUnmount(() => { if (marker && context.target.value) context.target.value.removeLayer(marker) })
</script>
<template><span hidden /></template>
