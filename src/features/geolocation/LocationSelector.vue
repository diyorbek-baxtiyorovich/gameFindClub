<script setup lang="ts">
import { useGeolocationStore } from './geolocation.store'
import AppLucideIcon from '@/components/ui/AppLucideIcon.vue'

withDefaults(defineProps<{ cities?: readonly { value: string; label: string }[] }>(), { cities: () => [] })
const location = useGeolocationStore()
</script>

<template>
  <section class="location-selector" aria-label="Location">
    <div class="location-selector__avatar" aria-hidden="true">GF</div>
    <label class="location-selector__picker">
      <span class="location-selector__pin"><AppLucideIcon name="map-pin" :size="15" /></span>
      <span class="sr-only">City</span>
      <select :value="location.manualLocation.city ?? 'Tashkent'" @change="location.setManualLocation({ ...location.manualLocation, city: ($event.target as HTMLSelectElement).value })">
        <option v-for="city in cities" :key="city.value" :value="city.value">{{ location.manualLocation.district ? `${location.manualLocation.district}, ${city.label}` : city.label }}</option>
      </select>
    </label>
    <button class="location-selector__current" type="button" aria-label="Use current location" :disabled="location.status === 'requesting'" @click="location.requestLocation"><AppLucideIcon name="locate" /></button>
  </section>
  <p v-if="location.error" class="location-selector__notice" role="status">Location is unavailable. Manual selection remains available.</p>
</template>

<style scoped>
.location-selector { min-height: 58px; display: grid; grid-template-columns: 40px minmax(0, 1fr) 44px; align-items: center; gap: var(--space-2); margin-inline: calc(var(--space-4) * -1); padding: var(--space-2) var(--space-4); border-bottom: 1px solid var(--color-border); background: var(--color-surface); }
.location-selector__avatar { width: 36px; height: 36px; display: grid; place-items: center; border: 2px solid var(--color-surface); border-radius: 50%; color: var(--color-text-inverse); background: linear-gradient(145deg, var(--color-primary), #52b788); box-shadow: 0 0 0 1px var(--color-border); font-size: 10px; font-weight: var(--font-weight-bold); }
.location-selector__picker { min-width: 0; display: flex; align-items: center; justify-self: end; padding-left: var(--space-3); border-radius: var(--radius-pill); background: var(--color-surface-muted); }
.location-selector__pin { color: var(--color-primary); font-size: 10px; }
.location-selector select { min-width: 0; min-height: 36px; padding: 0 30px 0 var(--space-2); border: 0; color: var(--color-text-primary); background: transparent; font-size: var(--font-size-xs); font-weight: var(--font-weight-medium); }
.location-selector__current { width: var(--touch-target-min); height: var(--touch-target-min); border: 0; border-radius: 50%; color: var(--color-primary); background: transparent; cursor: pointer; font-size: 1.2rem; }
.sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); }
.location-selector__notice { margin: var(--space-2) 0 0; color: var(--color-text-secondary); font-size: var(--font-size-xs); }
</style>
