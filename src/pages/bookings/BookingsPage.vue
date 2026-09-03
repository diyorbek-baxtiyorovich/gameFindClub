<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppEmptyState from '@/components/feedback/AppEmptyState.vue'
import AppSkeleton from '@/components/ui/AppSkeleton.vue'
import type { BookingStatus } from '@/entities/booking/booking'
import { useBookingsStore } from '@/stores'

const bookings = useBookingsStore(); const activeTab = ref<BookingStatus>('upcoming')
const tabs: { value: BookingStatus; label: string }[] = [{ value:'upcoming',label:'Kutilmoqda'},{value:'active',label:'Faol'},{value:'completed',label:'Tugallangan'},{value:'cancelled',label:'Bekor qilingan'}]
const visible = computed(() => bookings.items.filter((item) => item.status === activeTab.value))
onMounted(bookings.load)
</script>
<template>
  <section class="bookings-page"><header><small>MY BOOKINGS</small><h1>Bandlarim</h1><p>Gaming sessiyalaringizni bir joyda boshqaring.</p></header>
    <div class="booking-tabs" role="tablist"><button v-for="tab in tabs" :key="tab.value" type="button" role="tab" :aria-selected="activeTab===tab.value" :class="{active:activeTab===tab.value}" @click="activeTab=tab.value">{{ tab.label }}</button></div>
    <div v-if="bookings.loading" class="booking-loading"><AppSkeleton v-for="index in 2" :key="index" height="190px" /></div>
    <AppEmptyState v-else-if="!visible.length" title="Bu bo‘limda booking yo‘q" description="Gaming klub tanlab, o‘zingizga qulay vaqtni band qiling." />
    <div v-else class="booking-list"><article v-for="booking in visible" :key="booking.id" class="booking-card"><div class="booking-card__top"><div><small>{{ booking.status.toUpperCase() }}</small><h2>{{ booking.clubName }}</h2><p>{{ booking.device }}</p></div><strong>{{ booking.code }}</strong></div><dl><div><dt>Sana</dt><dd>{{ booking.date }}</dd></div><div><dt>Vaqt</dt><dd>{{ booking.startTime }}–{{ booking.endTime }}</dd></div><div><dt>Davomiyligi</dt><dd>{{ booking.durationHours }} soat</dd></div><div><dt>Joylar</dt><dd>{{ booking.stationCount }} ta</dd></div></dl><footer><b>{{ booking.totalPrice.toLocaleString('uz-UZ') }} UZS</b><div><RouterLink :to="{ name:'venue-detail',params:{slug:booking.clubSlug} }">Klubni ko‘rish</RouterLink><AppButton v-if="booking.status==='upcoming'" size="sm" variant="danger" @click="bookings.cancel(booking.id)">Bekor qilish</AppButton></div></footer></article></div>
  </section>
</template>
<style scoped>
.bookings-page{display:grid;gap:var(--space-5);padding-block:var(--space-4)}header small{color:var(--color-secondary);font-weight:var(--font-weight-bold);letter-spacing:.12em}header h1{margin:var(--space-1) 0 0;font-size:var(--font-size-2xl)}header p{margin:var(--space-1) 0 0;color:var(--color-text-secondary)}.booking-tabs{display:flex;gap:var(--space-2);overflow-x:auto;padding-bottom:var(--space-1)}.booking-tabs button{min-height:44px;padding:0 var(--space-4);border:1px solid var(--color-border);border-radius:var(--radius-pill);color:var(--color-text-secondary);background:var(--color-surface);white-space:nowrap}.booking-tabs button.active{border-color:var(--color-primary);color:white;background:var(--color-primary);box-shadow:0 0 20px rgb(139 92 246 / 20%)}.booking-list,.booking-loading{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,340px),1fr));gap:var(--space-4)}.booking-card{display:grid;gap:var(--space-4);padding:var(--space-5);border:1px solid var(--color-border);border-radius:var(--radius-xl);background:var(--color-surface);box-shadow:var(--elevation-1)}.booking-card__top{display:flex;justify-content:space-between;gap:var(--space-3)}.booking-card__top small{color:var(--color-success);font-weight:var(--font-weight-bold)}.booking-card h2,.booking-card p{margin:0}.booking-card h2{font-size:var(--font-size-lg)}.booking-card p{color:var(--color-text-secondary)}.booking-card__top>strong{height:fit-content;padding:5px 8px;border:1px solid var(--color-border);border-radius:var(--radius-sm);color:var(--color-secondary);font-family:monospace}.booking-card dl{display:grid;grid-template-columns:1fr 1fr;gap:var(--space-3);margin:0}.booking-card dl div{display:grid}.booking-card dt{color:var(--color-text-secondary);font-size:var(--font-size-xs)}.booking-card dd{margin:0;font-weight:var(--font-weight-semibold)}.booking-card footer{display:flex;align-items:center;justify-content:space-between;gap:var(--space-3);padding-top:var(--space-3);border-top:1px solid var(--color-border)}.booking-card footer>b{color:var(--color-primary)}.booking-card footer>div{display:flex;align-items:center;gap:var(--space-2)}.booking-card a{color:var(--color-text-secondary);font-size:var(--font-size-sm)}
</style>
