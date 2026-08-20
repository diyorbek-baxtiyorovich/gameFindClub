<script setup lang="ts">
import L from 'leaflet'
import { nextTick, onBeforeUnmount, onMounted, provide, ref, shallowRef, watch } from 'vue'
import type { GeoPoint } from '@/entities/venue/model/venue'
import type { MapViewport } from '../map.types'
import { MAP_LAYER_CONTEXT } from './map.context'

const props = withDefaults(defineProps<{ center?: GeoPoint; zoom?: number; selectable?: boolean }>(), { center: () => ({ latitude: 41.3111, longitude: 69.2797 }), zoom: 12, selectable: false })
const emit = defineEmits<{ viewportChange: [viewport: MapViewport]; ready: []; pointSelect: [point: GeoPoint] }>()
const container = ref<HTMLElement>()
const map = shallowRef<L.Map | null>(null)
const target = shallowRef<L.Map | L.LayerGroup | null>(null)
const ready = ref(false)
let moveTimer: ReturnType<typeof setTimeout> | undefined

provide(MAP_LAYER_CONTEXT, { map, target })

function emitViewport(): void {
  if (!map.value) return
  if (moveTimer) clearTimeout(moveTimer)
  moveTimer = setTimeout(() => {
    if (!map.value) return
    const bounds = map.value.getBounds()
    const center = map.value.getCenter()
    emit('viewportChange', {
      center: { latitude: center.lat, longitude: center.lng },
      zoom: map.value.getZoom(),
      bounds: { north: bounds.getNorth(), south: bounds.getSouth(), east: bounds.getEast(), west: bounds.getWest() },
    })
  }, 300)
}

function selectPoint(event: L.LeafletMouseEvent): void {
  if (!props.selectable) return
  emit('pointSelect', { latitude: event.latlng.lat, longitude: event.latlng.lng })
}

onMounted(async () => {
  await nextTick()
  if (!container.value) return
  map.value = L.map(container.value, { zoomControl: false, attributionControl: true }).setView([props.center.latitude, props.center.longitude], props.zoom)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(map.value)
  target.value = map.value
  map.value.on('moveend zoomend', emitViewport)
  map.value.on('click', selectPoint)
  ready.value = true
  emit('ready')
  emitViewport()
})

watch(() => props.center, (center) => map.value?.flyTo([center.latitude, center.longitude], Math.max(map.value.getZoom(), 14)), { deep: true })

onBeforeUnmount(() => {
  if (moveTimer) clearTimeout(moveTimer)
  map.value?.off('moveend zoomend', emitViewport)
  map.value?.off('click', selectPoint)
  map.value?.remove()
  map.value = null
  target.value = null
})
</script>

<template><div class="venue-map"><div ref="container" class="venue-map__canvas" /><slot v-if="ready" /></div></template>

<style scoped>
.venue-map, .venue-map__canvas { width: 100%; height: 100%; min-height: 360px; }
.venue-map { position: relative; overflow: hidden; background: var(--color-surface-muted); }
.venue-map:has(.venue-map__canvas) { touch-action: pan-x pan-y; }
</style>
