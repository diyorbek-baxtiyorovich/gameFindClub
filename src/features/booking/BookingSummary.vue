<script setup lang="ts">
import type { BookingDraft } from '@/entities/booking/booking'
defineProps<{ draft: BookingDraft; endTime: string; total: number }>()
</script>
<template>
  <dl class="summary">
    <div><dt>Klub</dt><dd>{{ draft.clubName }}</dd></div><div><dt>Qurilma/xona</dt><dd>{{ draft.device }}</dd></div>
    <div><dt>Sana</dt><dd>{{ draft.date }}</dd></div><div><dt>Vaqt</dt><dd>{{ draft.startTime }}–{{ endTime }}</dd></div>
    <div><dt>Davomiyligi</dt><dd>{{ draft.durationHours }} soat</dd></div><div><dt>Joylar</dt><dd>{{ draft.stationCount }} ta</dd></div>
    <div class="summary__total"><dt>Jami</dt><dd>{{ total.toLocaleString('uz-UZ') }} UZS</dd></div>
  </dl>
</template>
<style scoped>.summary{display:grid;gap:0;margin:0;border:1px solid var(--color-border);border-radius:var(--radius-lg);background:var(--color-surface);overflow:hidden}.summary>div{display:flex;justify-content:space-between;gap:var(--space-4);padding:var(--space-3) var(--space-4);border-bottom:1px solid var(--color-border)}.summary>div:last-child{border:0}.summary dt{color:var(--color-text-secondary)}.summary dd{margin:0;text-align:right;font-weight:var(--font-weight-semibold)}.summary__total{color:var(--color-primary);font-size:var(--font-size-lg)}.summary__total dt{color:inherit}</style>
