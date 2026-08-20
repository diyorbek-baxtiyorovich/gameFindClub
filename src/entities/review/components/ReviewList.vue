<script setup lang="ts">
import AppEmptyState from '@/components/feedback/AppEmptyState.vue'
import AppErrorState from '@/components/feedback/AppErrorState.vue'
import AppSkeleton from '@/components/ui/AppSkeleton.vue'
import type { Review } from '../model/review'
import ReviewCard from './ReviewCard.vue'
defineProps<{ items: readonly Review[]; loading?: boolean; error?: string | null }>()
defineEmits<{ retry: [] }>()
</script>
<template><div v-if="loading" class="list"><AppSkeleton v-for="index in 3" :key="index" height="128px"/></div><AppErrorState v-else-if="error" title="Could not load reviews" description="Please check your connection and try again." @retry="$emit('retry')"/><AppEmptyState v-else-if="!items.length" title="No reviews yet" description="Be the first to share a helpful experience."/><div v-else class="list"><ReviewCard v-for="review in items" :key="review.id" :review="review"/></div></template>
<style scoped>.list{display:grid;gap:var(--space-3)}</style>
