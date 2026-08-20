import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { VenueSort } from './sort'
export const useSortStore = defineStore('sort', () => { const selected = ref<VenueSort>('recommended'); return { selected } })
