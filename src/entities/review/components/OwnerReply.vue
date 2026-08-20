<script setup lang="ts">
import type { OwnerReply } from '../model/review'
import { t } from '@/i18n'
defineProps<{ reply: OwnerReply }>()
</script>
<template><aside class="reply"><strong>{{ reply.ownerName ?? t('review.venue_response') }}</strong><p>{{ reply.body }}</p></aside></template>
<style scoped>.reply{padding:var(--space-3);border-inline-start:3px solid var(--color-primary);border-radius:var(--radius-sm);background:var(--color-surface-muted)}.reply strong{font-size:var(--font-size-sm)}.reply p{margin:var(--space-1) 0 0;color:var(--color-text-secondary)}</style>
