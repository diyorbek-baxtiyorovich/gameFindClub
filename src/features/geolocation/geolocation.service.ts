import type { TelegramLocationManager } from '@/services'
import type { LocationResult } from './geolocation.types'

const browserErrorCode = (code: number): 'permission-denied' | 'unavailable' | 'timeout' | 'unknown' => {
  if (code === 1) return 'permission-denied'
  if (code === 2) return 'unavailable'
  if (code === 3) return 'timeout'
  return 'unknown'
}

async function requestTelegramLocation(manager: TelegramLocationManager): Promise<LocationResult> {
  if (!manager.isInited) await new Promise<void>((resolve) => manager.init(resolve))
  if (!manager.isLocationAvailable) return { ok: false, source: 'telegram', error: { code: 'unavailable', message: 'Telegram location is unavailable on this device.' } }
  return new Promise((resolve) => manager.getLocation((location) => {
    if (!location) {
      resolve({ ok: false, source: 'telegram', error: { code: manager.isAccessGranted ? 'unavailable' : 'permission-denied', message: manager.isAccessGranted ? 'Location could not be determined.' : 'Location permission was not granted.' } })
      return
    }
    resolve({ ok: true, source: 'telegram', coordinates: { latitude: location.latitude, longitude: location.longitude, accuracyMeters: location.horizontal_accuracy ?? undefined, altitudeMeters: location.altitude ?? undefined } })
  }))
}

async function requestBrowserLocation(timeoutMs: number): Promise<LocationResult> {
  if (typeof navigator === 'undefined' || !navigator.geolocation) return { ok: false, source: 'none', error: { code: 'unsupported', message: 'Geolocation is not supported in this environment.' } }
  return new Promise((resolve) => navigator.geolocation.getCurrentPosition(
    (position) => resolve({ ok: true, source: 'browser', coordinates: { latitude: position.coords.latitude, longitude: position.coords.longitude, accuracyMeters: position.coords.accuracy, altitudeMeters: position.coords.altitude ?? undefined } }),
    (error) => resolve({ ok: false, source: 'browser', error: { code: browserErrorCode(error.code), message: error.message || 'Unable to retrieve location.' } }),
    { enableHighAccuracy: false, timeout: timeoutMs, maximumAge: 300_000 },
  ))
}

export async function requestCurrentLocation(timeoutMs = 10_000): Promise<LocationResult> {
  const manager = typeof window === 'undefined' ? undefined : window.Telegram?.WebApp?.LocationManager
  return manager ? requestTelegramLocation(manager) : requestBrowserLocation(timeoutMs)
}
