<script setup lang="ts">
import { computed, onMounted } from 'vue'
import AppErrorState from '@/components/feedback/AppErrorState.vue'
import OwnerStatCard from '@/components/owner/OwnerStatCard.vue'
import AppSkeleton from '@/components/ui/AppSkeleton.vue'
import OwnerActionBreakdownChart from '@/features/owner/analytics/components/OwnerActionBreakdownChart.vue'
import OwnerViewsChart from '@/features/owner/analytics/components/OwnerViewsChart.vue'
import { formatAnalyticsCount, formatAnalyticsRating } from '@/features/owner/analytics'
import { t, useLocale } from '@/i18n'
import { useOwnerAnalyticsStore, useOwnerSessionStore } from '@/stores'

const analytics = useOwnerAnalyticsStore(); const session = useOwnerSessionStore(); const { locale } = useLocale()
const summary = computed(() => analytics.summary)
type MetricKey = 'views'|'favorites'|'calls'|'directions'|'reviews'|'rating'
interface Metric { key: MetricKey; value: string; icon: string; tone: 'neutral'|'primary'|'success'|'warning' }
const metrics = computed<readonly Metric[]>(() => [
  { key:'views', value:formatAnalyticsCount(summary.value?.totalViews,locale.value), icon:'eye', tone:'primary' as const },
  { key:'favorites', value:formatAnalyticsCount(summary.value?.totalFavorites,locale.value), icon:'heart', tone:'warning' as const },
  { key:'calls', value:formatAnalyticsCount(summary.value?.totalCalls,locale.value), icon:'phone', tone:'success' as const },
  { key:'directions', value:formatAnalyticsCount(summary.value?.totalDirections,locale.value), icon:'navigation', tone:'primary' as const },
  { key:'reviews', value:formatAnalyticsCount(summary.value?.reviewCount,locale.value), icon:'message', tone:'neutral' as const },
  { key:'rating', value:formatAnalyticsRating(summary.value?.averageRating,locale.value), icon:'star', tone:'warning' as const },
])
onMounted(() => analytics.load(session.profile.id))
</script>
<template><div class="analytics-page"><header><div><h2>{{ t('owner.analytics.title') }}</h2><p>{{ t('owner.analytics.description') }}</p></div></header><div v-if="analytics.loading&&!summary" class="analytics-page__metrics"><AppSkeleton v-for="index in 6" :key="index" height="84px" radius="var(--radius-lg)" /></div><AppErrorState v-else-if="analytics.error" :title="t('owner.analytics.load_error')" :description="analytics.error" @retry="analytics.load(session.profile.id)" /><template v-else><section class="analytics-page__metrics" :aria-label="t('owner.analytics.overview')"><OwnerStatCard v-for="metric in metrics" :key="metric.key" :label="t(`owner.analytics.metric.${metric.key}`)" :value="metric.value" :icon="metric.icon" :tone="metric.tone" /></section><section class="analytics-panel"><h3>{{ t('owner.analytics.views_chart') }}</h3><p>{{ t('owner.analytics.views_context_product') }}</p><OwnerViewsChart :points="summary?.viewsOverTime??[]" :locale="locale" :label="t('owner.analytics.views_chart_label')" /></section><section class="analytics-panel"><h3>{{ t('owner.analytics.actions_chart') }}</h3><p>{{ t('owner.analytics.actions_context_product') }}</p><OwnerActionBreakdownChart :items="summary?.actionBreakdown??[]" :locale="locale" /></section></template></div></template>
<style scoped>.analytics-page{display:grid;gap:var(--space-5)}header{display:flex;align-items:flex-start;justify-content:space-between;gap:var(--space-3)}header h2,header p,.analytics-panel h3,.analytics-panel p{margin:0}header p,.analytics-panel>p{color:var(--color-text-secondary);font-size:var(--font-size-sm)}header p{margin-top:var(--space-1)}.analytics-page__metrics{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:var(--space-3)}.analytics-panel{display:grid;gap:var(--space-3);padding:var(--space-4);border:1px solid var(--color-border);border-radius:var(--radius-xl);background:var(--color-surface);box-shadow:var(--elevation-1)}.analytics-panel h3{font-size:var(--font-size-lg)}@media(max-width:350px){.analytics-page__metrics{gap:var(--space-2)}.analytics-panel{padding:var(--space-3)}}</style>
