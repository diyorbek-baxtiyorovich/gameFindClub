import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { requestCurrentLocation } from './geolocation.service'
import type { GeolocationErrorCode, LocationCoordinates, ManualLocation } from './geolocation.types'

export type GeolocationStatus = 'idle' | 'requesting' | 'granted' | 'denied' | 'unavailable' | 'error'

export const useGeolocationStore = defineStore('geolocation', () => {
  const coordinates = ref<LocationCoordinates | null>(null)
  const manualLocation = ref<ManualLocation>({})
  const status = ref<GeolocationStatus>('idle')
  const error = ref<{ code: GeolocationErrorCode; message: string } | null>(null)
  const requestedOnce = ref(false)
  const hasLocation = computed(() => coordinates.value != null)
  const nearbyQuery = computed(() => coordinates.value ? { latitude: coordinates.value.latitude, longitude: coordinates.value.longitude } : null)

  async function requestLocation(): Promise<void> {
    if (status.value === 'requesting') return
    requestedOnce.value = true
    status.value = 'requesting'
    error.value = null
    const result = await requestCurrentLocation()
    if (result.ok) {
      coordinates.value = result.coordinates
      status.value = 'granted'
      return
    }
    coordinates.value = null
    error.value = result.error
    status.value = result.error.code === 'permission-denied' ? 'denied' : result.error.code === 'unavailable' || result.error.code === 'unsupported' ? 'unavailable' : 'error'
  }

  function setManualLocation(value: ManualLocation): void {
    manualLocation.value = value
  }

  function clearCoordinates(): void {
    coordinates.value = null
    status.value = 'idle'
    error.value = null
  }

  return { coordinates, manualLocation, status, error, requestedOnce, hasLocation, nearbyQuery, requestLocation, setManualLocation, clearCoordinates }
})
