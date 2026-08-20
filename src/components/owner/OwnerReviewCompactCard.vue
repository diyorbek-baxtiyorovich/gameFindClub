<script setup lang="ts">
import AppBadge from '@/components/ui/AppBadge.vue'
import AppLucideIcon from '@/components/ui/AppLucideIcon.vue'
import type { OwnerReview } from '@/entities/owner'
import { t } from '@/i18n'

defineProps<{ review: OwnerReview }>()
</script>

<template>
  <article class="owner-review-compact">
    <header>
      <strong>{{ review.venueName || t('owner.review.unknown_venue') }}</strong>
      <span><AppLucideIcon name="star" :size="15" filled />{{ review.rating.toFixed(1) }}</span>
    </header>
    <p>{{ review.body || t('owner.review.no_comment') }}</p>
    <footer>
      <time :datetime="review.createdAt">{{ new Date(review.createdAt).toLocaleDateString() }}</time>
      <AppBadge :tone="review.ownerReply ? 'success' : 'neutral'">
        {{ review.ownerReply ? t('owner.review.replied') : t('owner.review.awaiting_reply') }}
      </AppBadge>
    </footer>
  </article>
</template>

<style scoped>
.owner-review-compact { display: grid; gap: var(--space-2); padding: var(--space-4); border: 1px solid var(--color-border); border-radius: var(--radius-lg); background: var(--color-surface); box-shadow: var(--elevation-1); }
.owner-review-compact header, .owner-review-compact footer { display: flex; align-items: center; justify-content: space-between; gap: var(--space-3); }
.owner-review-compact header strong { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.owner-review-compact header span { display: inline-flex; align-items: center; gap: var(--space-1); flex: 0 0 auto; color: var(--color-warning); font-weight: var(--font-weight-semibold); }
.owner-review-compact p { display: -webkit-box; overflow: hidden; margin: 0; color: var(--color-text-secondary); font-size: var(--font-size-sm); -webkit-box-orient: vertical; -webkit-line-clamp: 2; }
.owner-review-compact time { color: var(--color-text-secondary); font-size: var(--font-size-xs); }
</style>
