<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import AppButton from '@/components/ui/AppButton.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppSelect from '@/components/ui/AppSelect.vue'
import AppLucideIcon from '@/components/ui/AppLucideIcon.vue'
import AppErrorState from '@/components/feedback/AppErrorState.vue'
import { localVenueRepository } from '@/entities/venue/api'
import type { VenueDetail } from '@/entities/venue'
import type { BookingDraft } from '@/entities/booking/booking'
import { BookingSummary, TimeSlotPicker } from '@/features/booking'
import { useBookingsStore } from '@/stores'

const props = defineProps<{ slug: string }>()
const router = useRouter(); const bookings = useBookingsStore(); const club = ref<VenueDetail | null>(null); const done = ref(false)
const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10)
const device = ref(''); const date = ref(tomorrow); const startTime = ref('20:00'); const duration = ref(2); const count = ref(1)
onMounted(async () => { club.value = await localVenueRepository.getBySlug(props.slug); device.value = club.value?.pricing?.[0]?.name ?? '' })
const deviceOptions = computed(() => (club.value?.pricing ?? []).map((item) => ({ value: item.name, label: `${item.name} — ${item.price.amount.toLocaleString('uz-UZ')} UZS/soat` })))
const hourlyPrice = computed(() => club.value?.pricing?.find((item) => item.name === device.value)?.price.amount ?? 0)
const endTime = computed(() => { const [hour, minute] = startTime.value.split(':').map(Number); return `${String((hour + duration.value) % 24).padStart(2, '0')}:${String(minute).padStart(2, '0')}` })
const total = computed(() => hourlyPrice.value * duration.value * count.value)
const draft = computed<BookingDraft>(() => ({ clubId: club.value?.id ?? '', clubSlug: props.slug, clubName: club.value?.name ?? '', device: device.value, date: date.value, startTime: startTime.value, durationHours: duration.value, stationCount: count.value, hourlyPrice: hourlyPrice.value }))
async function confirm(): Promise<void> { await bookings.confirm(draft.value); done.value = true }
</script>
<template>
  <section class="booking-flow">
    <AppErrorState v-if="!club" title="Gaming klub topilmadi" description="Boshqa klubni tanlab ko‘ring." retry-label="" />
    <div v-else-if="done" class="booking-success"><span><AppLucideIcon name="check" :size="38" /></span><h1>Joy muvaffaqiyatli band qilindi</h1><p>Booking kodi: <strong>{{ bookings.latest?.code }}</strong></p><AppButton full-width @click="router.push({ name: 'bookings' })">Bandlarimni ko‘rish</AppButton></div>
    <template v-else>
      <header><small>BOOKING</small><h1>{{ club.name }}</h1><p>Qurilma, sana va vaqtni tanlang.</p></header>
      <section class="booking-step"><span>1</span><div><h2>Gaming turi yoki PC darajasi</h2><AppSelect v-model="device" label="Qurilma yoki xona" :options="deviceOptions" /></div></section>
      <section class="booking-step"><span>2</span><div><h2>Sana</h2><AppInput v-model="date" type="date" label="Booking sanasi" /></div></section>
      <section class="booking-step"><span>3</span><div><h2>Boshlanish vaqti</h2><TimeSlotPicker v-model="startTime" :busy="['18:00', '21:00']" /></div></section>
      <section class="booking-step"><span>4</span><div><h2>Davomiyligi</h2><div class="choice-row"><button v-for="hours in [1,2,3,4,5]" :key="hours" type="button" :class="{selected:duration===hours}" @click="duration=hours">{{ hours }} soat</button></div></div></section>
      <section class="booking-step"><span>5</span><div><h2>Joylar soni</h2><div class="counter"><button type="button" :disabled="count<=1" @click="count--">−</button><strong>{{ count }}</strong><button type="button" :disabled="count>=(club.occupancy?.availableCount ?? 1)" @click="count++">+</button></div></div></section>
      <section class="booking-review"><small>6 · TASDIQLASH</small><h2>Booking ma’lumotlari</h2><BookingSummary :draft="draft" :end-time="endTime" :total="total" /><p>Bekor qilish: boshlanishidan 2 soat oldin bepul. Hozircha tasdiqlash mock lokal ma’lumot sifatida saqlanadi.</p><AppButton size="lg" full-width @click="confirm">{{ total.toLocaleString('uz-UZ') }} UZS · Tasdiqlash</AppButton></section>
    </template>
  </section>
</template>
<style scoped>
.booking-flow{max-width:760px;display:grid;gap:var(--space-6);margin-inline:auto;padding-block:var(--space-4) var(--space-10)}header small,.booking-review>small{color:var(--color-secondary);font-weight:var(--font-weight-bold);letter-spacing:.12em}header h1{margin:var(--space-2) 0 0;font-size:var(--font-size-2xl)}header p,.booking-review>p{margin:var(--space-2) 0 0;color:var(--color-text-secondary)}.booking-step{display:grid;grid-template-columns:36px minmax(0,1fr);gap:var(--space-3);padding:var(--space-5);border:1px solid var(--color-border);border-radius:var(--radius-xl);background:var(--color-surface)}.booking-step>span{width:32px;height:32px;display:grid;place-items:center;border-radius:50%;color:white;background:var(--color-primary);font-weight:var(--font-weight-bold)}.booking-step>div{min-width:0}.booking-step h2,.booking-review h2{margin:2px 0 var(--space-4);font-size:var(--font-size-lg)}.choice-row{display:flex;gap:var(--space-2);overflow:auto}.choice-row button{min-width:70px;min-height:48px;border:1px solid var(--color-border);border-radius:var(--radius-md);color:var(--color-text-primary);background:var(--color-surface-muted)}.choice-row button.selected{border-color:var(--color-primary);color:var(--color-primary);background:var(--color-primary-soft)}.counter{width:180px;display:grid;grid-template-columns:52px 1fr 52px;align-items:center;text-align:center}.counter button{height:48px;border:1px solid var(--color-border);color:var(--color-text-primary);background:var(--color-surface-muted);font-size:1.4rem}.booking-review{display:grid;gap:var(--space-3);padding:var(--space-5);border:1px solid var(--color-border-strong);border-radius:var(--radius-xl);background:linear-gradient(145deg,var(--color-surface),rgb(139 92 246 / 6%))}.booking-success{min-height:65vh;display:grid;place-content:center;justify-items:center;gap:var(--space-3);text-align:center}.booking-success>span{width:78px;height:78px;display:grid;place-items:center;border-radius:50%;color:var(--color-success);background:var(--color-success-soft);box-shadow:0 0 35px rgb(74 222 128 / 18%)}.booking-success h1,.booking-success p{margin:0}
</style>
