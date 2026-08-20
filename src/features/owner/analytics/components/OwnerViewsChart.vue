<script setup lang="ts">
import { computed } from 'vue'
import type { OwnerAnalyticsSeriesPoint } from '@/entities/owner'
import type { Locale } from '@/i18n'
import { formatAnalyticsCount, formatAnalyticsDate } from '../formatters'

const props = defineProps<{ points: readonly OwnerAnalyticsSeriesPoint[]; locale: Locale; label: string }>()
const chart = computed(() => {
  if (!props.points.length) return { path: '', min: 0, max: 0 }
  const values = props.points.map((point) => point.value)
  const min = Math.min(...values); const max = Math.max(...values); const range = Math.max(1, max - min)
  const path = props.points.map((point, index) => {
    const x = props.points.length === 1 ? 150 : 10 + index * (280 / (props.points.length - 1))
    const y = 86 - ((point.value - min) / range) * 66
    return `${x.toFixed(1)},${y.toFixed(1)}`
  }).join(' ')
  return { path, min, max }
})
</script>
<template><section class="views-chart"><div v-if="points.length" class="views-chart__plot" role="img" :aria-label="label"><svg viewBox="0 0 300 100" preserveAspectRatio="none" aria-hidden="true"><line x1="10" y1="86" x2="290" y2="86" /><line x1="10" y1="53" x2="290" y2="53" /><line x1="10" y1="20" x2="290" y2="20" /><polyline :points="chart.path" /></svg></div><p v-else class="views-chart__empty">—</p><div v-if="points.length" class="views-chart__context"><span>{{ formatAnalyticsDate(points[0].date, locale) }}</span><strong>{{ formatAnalyticsCount(chart.min, locale) }}–{{ formatAnalyticsCount(chart.max, locale) }}</strong><span>{{ formatAnalyticsDate(points[points.length-1].date, locale) }}</span></div></section></template>
<style scoped>.views-chart{display:grid;gap:var(--space-2)}.views-chart__plot{height:128px;color:var(--color-primary)}svg{width:100%;height:100%;overflow:visible}line{stroke:var(--color-border);stroke-width:1;vector-effect:non-scaling-stroke}polyline{fill:none;stroke:currentColor;stroke-width:3;stroke-linecap:round;stroke-linejoin:round;vector-effect:non-scaling-stroke}.views-chart__context{display:grid;grid-template-columns:1fr auto 1fr;gap:var(--space-2);color:var(--color-text-secondary);font-size:var(--font-size-xs)}.views-chart__context span:last-child{text-align:right}.views-chart__context strong{color:var(--color-text-primary)}.views-chart__empty{margin:0;padding:var(--space-8);text-align:center;color:var(--color-text-secondary);background:var(--color-surface-muted);border-radius:var(--radius-md)}</style>
