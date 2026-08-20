<script setup lang="ts">
import L from 'leaflet'
import 'leaflet.markercluster'
import { inject, onBeforeUnmount, provide, shallowRef, watch } from 'vue'
import { MAP_LAYER_CONTEXT } from './map.context'

const parent = inject(MAP_LAYER_CONTEXT)
if (!parent) throw new Error('VenueCluster must be used inside VenueMap.')
const target = shallowRef<L.LayerGroup | null>(null)
provide(MAP_LAYER_CONTEXT, { map: parent.map, target })

watch(parent.map, (map) => {
  if (!map || target.value) return
  const cluster = L.markerClusterGroup({
    showCoverageOnHover: false,
    maxClusterRadius: 48,
    iconCreateFunction: (group) => L.divIcon({ className: 'venue-cluster-shell', html: `<span class="venue-cluster">${group.getChildCount()}</span>`, iconSize: [44, 44] }),
  })
  target.value = cluster
  map.addLayer(cluster)
}, { immediate: true })

onBeforeUnmount(() => {
  if (parent.map.value && target.value) parent.map.value.removeLayer(target.value)
  target.value = null
})
</script>

<template><slot /></template>

<style>:global(.venue-cluster-shell) { background: transparent; border: 0; }:global(.venue-cluster) { width: 44px; height: 44px; display: grid; place-items: center; border: 3px solid var(--color-surface); border-radius: 50%; color: var(--color-text-inverse); background: var(--color-primary); box-shadow: var(--elevation-2); font-weight: var(--font-weight-bold); }</style>
