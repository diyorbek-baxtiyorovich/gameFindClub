<script setup lang="ts">
import type { Review } from '../model/review'
import OwnerReply from './OwnerReply.vue'
import AppLucideIcon from '@/components/ui/AppLucideIcon.vue'
defineProps<{ review: Review }>()
</script>
<template><article class="card"><header><div><img v-if="review.author.avatarUrl" :src="review.author.avatarUrl" :alt="review.author.displayName" width="40" height="40" loading="lazy" decoding="async"/><span v-else class="avatar" aria-hidden="true">{{ review.author.displayName.slice(0,1) }}</span><strong>{{ review.author.displayName }}</strong></div><span><AppLucideIcon name="star" :size="16" filled />{{ review.rating.toFixed(1) }}</span></header><p v-if="review.body">{{ review.body }}</p><time :datetime="review.createdAt">{{ new Date(review.createdAt).toLocaleDateString() }}</time><OwnerReply v-if="review.ownerReply" :reply="review.ownerReply"/></article></template>
<style scoped>.card{display:grid;gap:var(--space-3);padding:var(--space-4);border:1px solid var(--color-border);border-radius:var(--radius-lg);background:var(--color-surface)}header,header div{display:flex;align-items:center;gap:var(--space-2)}header{justify-content:space-between}header img,.avatar{width:40px;height:40px;display:grid;place-items:center;border-radius:50%;object-fit:cover;color:var(--color-text-inverse);background:var(--color-primary)}header>span{color:var(--color-warning);font-weight:var(--font-weight-semibold)}p{margin:0}time{color:var(--color-text-secondary);font-size:var(--font-size-xs)}</style>
