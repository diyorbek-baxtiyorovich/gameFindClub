import { defineStore } from 'pinia'
import { ref } from 'vue'
import { localBookingRepository } from '@/entities/booking/booking.repository'
import type { Booking, BookingDraft } from '@/entities/booking/booking'

export const useBookingsStore = defineStore('bookings', () => {
  const items = ref<readonly Booking[]>([])
  const loading = ref(false)
  const latest = ref<Booking | null>(null)
  async function load(): Promise<void> {
    loading.value = true
    try {
      items.value = await localBookingRepository.list()
    } finally {
      loading.value = false
    }
  }
  async function confirm(draft: BookingDraft): Promise<Booking> {
    const booking = await localBookingRepository.create(draft)
    latest.value = booking
    await load()
    return booking
  }
  async function cancel(id: string): Promise<void> {
    await localBookingRepository.cancel(id)
    await load()
  }
  return { items, loading, latest, load, confirm, cancel }
})
