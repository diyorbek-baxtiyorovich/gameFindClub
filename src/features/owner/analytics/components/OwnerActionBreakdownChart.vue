<script setup lang="ts">
import { computed } from 'vue'
import type { OwnerAnalyticsActionMetric } from '@/entities/owner'
import type { Locale, MessageKey } from '@/i18n'
import { t } from '@/i18n'
import { formatAnalyticsCount } from '../formatters'
const props = defineProps<{ items: readonly OwnerAnalyticsActionMetric[]; locale: Locale }>()
const max = computed(() => Math.max(1, ...props.items.map((item) => item.value)))
const labelKey = (key: OwnerAnalyticsActionMetric['key']): MessageKey => `owner.analytics.metric.${key}`
</script>
<template><div class="action-chart"><div v-for="item in items" :key="item.key" class="action-chart__row"><div><span>{{ t(labelKey(item.key)) }}</span><strong>{{ formatAnalyticsCount(item.value,locale) }}</strong></div><span class="action-chart__track"><span :style="{width:`${Math.max(0,item.value)/max*100}%`}" /></span></div></div></template>
<style scoped>.action-chart{display:grid;gap:var(--space-4)}.action-chart__row{display:grid;gap:var(--space-2)}.action-chart__row>div{display:flex;justify-content:space-between;gap:var(--space-3);font-size:var(--font-size-sm)}.action-chart__track{height:9px;overflow:hidden;border-radius:var(--radius-pill);background:var(--color-surface-muted)}.action-chart__track>span{height:100%;display:block;border-radius:inherit;background:var(--color-primary);transition:width var(--motion-normal)}</style>
