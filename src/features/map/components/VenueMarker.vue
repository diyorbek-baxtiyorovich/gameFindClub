<script setup lang="ts">
import L from 'leaflet'
import { inject, onBeforeUnmount, watch } from 'vue'
import { getVenueCategory } from '@/entities/venue'
import type { VenueListItem } from '@/entities/venue'
import { MAP_LAYER_CONTEXT } from './map.context'

const props = withDefaults(defineProps<{ venue: VenueListItem; selected?: boolean; featured?: boolean; unavailable?: boolean }>(), { selected: false, featured: false, unavailable: false })
const emit = defineEmits<{ select: [venue: VenueListItem] }>()
const injectedContext = inject(MAP_LAYER_CONTEXT)
if (!injectedContext) throw new Error('VenueMarker must be used inside VenueMap.')
const context = injectedContext
let marker: L.Marker | undefined

function renderMarker(): void {
  if (marker && context.target.value) context.target.value.removeLayer(marker)
  marker = undefined
  if (!context.target.value || !props.venue.location) return
  const category = getVenueCategory(props.venue)
  const classes = ['venue-marker', `venue-marker--${category.accent}`, props.selected && 'venue-marker--selected', props.featured && 'venue-marker--featured', props.unavailable && 'venue-marker--unavailable'].filter(Boolean).join(' ')
  const colors: Readonly<Record<string, string>> = { gaming: '#7257d5', tennis: '#718f19', football: '#16805c', gym: '#c05b24', neutral: '#68707c' }
  const accent = colors[category.accent] ?? colors.neutral
  const selectedRing = props.selected ? 'box-shadow:0 0 0 5px rgba(0,119,168,.28),0 8px 20px rgba(15,23,42,.22);transform:rotate(-45deg) scale(1.12);' : 'box-shadow:0 8px 20px rgba(15,23,42,.22);'
  const unavailableStyle = props.unavailable ? 'filter:grayscale(.8);opacity:.6;' : ''
  const markerStyle = `width:44px;height:44px;display:grid;place-items:center;border:4px solid white;border-radius:50% 50% 50% 12px;transform:rotate(-45deg);color:white;background:${accent};font-size:18px;${selectedRing}${unavailableStyle}`
  const symbolStyle = 'display:block;width:18px;height:18px;transform:rotate(45deg)'
  const lucideDot = `<svg style="${symbolStyle}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></svg>`
  const icon = L.divIcon({ className: 'venue-marker-shell', html: `<span class="${classes}" style="${markerStyle}" aria-hidden="true">${lucideDot}</span>`, iconSize: [48, 54], iconAnchor: [24, 50] })
  marker = L.marker([props.venue.location.latitude, props.venue.location.longitude], { icon, title: props.venue.name, riseOnHover: true })
  marker.on('click', () => emit('select', props.venue))
  marker.bindTooltip(props.venue.name, { direction: 'top', offset: [0, -38], opacity: 0.9 })
  context.target.value.addLayer(marker)
}

watch([context.target, () => props.venue, () => props.selected, () => props.featured, () => props.unavailable], renderMarker, { immediate: true, deep: true })
onBeforeUnmount(() => { if (marker && context.target.value) context.target.value.removeLayer(marker) })
</script>

<template><span hidden /></template>

<style>:global(.venue-marker-shell) { background: transparent; border: 0; }:global(.venue-marker) { --marker-accent: var(--color-accent-neutral); width: 40px; height: 40px; display: grid; place-items: center; border: 3px solid var(--color-surface); border-radius: 50% 50% 50% 12px; transform: rotate(-45deg); color: var(--color-text-inverse); background: var(--marker-accent); box-shadow: var(--elevation-2); font-weight: var(--font-weight-bold); }:global(.venue-marker > span) { transform: rotate(45deg); }:global(.venue-marker--gaming) { --marker-accent: var(--color-accent-gaming); }:global(.venue-marker--tennis) { --marker-accent: var(--color-accent-tennis); }:global(.venue-marker--football) { --marker-accent: var(--color-accent-football); }:global(.venue-marker--gym) { --marker-accent: var(--color-accent-gym); }:global(.venue-marker--selected) { outline: 4px solid color-mix(in srgb, var(--color-primary) 35%, transparent); transform: rotate(-45deg) scale(1.14); }:global(.venue-marker--featured) { box-shadow: 0 0 0 3px var(--color-warning), var(--elevation-2); }:global(.venue-marker--unavailable) { filter: grayscale(0.85); opacity: 0.58; }</style>
