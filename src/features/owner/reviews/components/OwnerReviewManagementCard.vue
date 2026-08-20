<script setup lang="ts">
import { computed, ref } from 'vue'

import AppButton from '@/components/ui/AppButton.vue'
import AppTextarea from '@/components/ui/AppTextarea.vue'
import type { OwnerReview } from '@/entities/owner'
import ReviewCard from '@/entities/review/components/ReviewCard.vue'
import { t } from '@/i18n'
import { useOwnerReviewsStore, useOwnerSessionStore } from '@/stores'

const props = defineProps<{ review: OwnerReview }>()
const reviews = useOwnerReviewsStore()
const session = useOwnerSessionStore()
const editing = ref(false)
const body = ref('')
const touched = ref(false)
const emptyError = computed(() => touched.value && !body.value.trim()
  ? t('owner.reply.validation_required')
  : undefined)

function cancel(): void {
  editing.value = false
  body.value = ''
  touched.value = false
  reviews.clearReplyError()
}

async function save(): Promise<void> {
  touched.value = true
  if (!body.value.trim()) return
  const saved = await reviews.reply(props.review.id, {
    body: body.value,
    ownerName: session.profile.displayName,
  })
  if (saved) cancel()
}
</script>

<template>
  <div class="owner-review-card">
    <ReviewCard :review="review" />
    <div v-if="!review.ownerReply" class="owner-review-card__reply">
      <AppButton v-if="!editing" variant="secondary" size="sm" @click="editing = true">
        {{ t('owner.reply.action') }}
      </AppButton>
      <template v-else>
        <AppTextarea
          v-model="body"
          :label="t('owner.reply.label')"
          :placeholder="t('owner.reply.placeholder')"
          :error="emptyError"
          :disabled="reviews.replyingReviewId === review.id"
          :maxlength="1000"
          @blur="touched = true"
        />
        <p v-if="reviews.replyError" class="owner-review-card__error" role="alert">
          {{ reviews.replyError }}
        </p>
        <div class="owner-review-card__actions">
          <AppButton variant="ghost" :disabled="reviews.replyingReviewId === review.id" @click="cancel">
            {{ t('owner.action.cancel') }}
          </AppButton>
          <AppButton :loading="reviews.replyingReviewId === review.id" @click="save">
            {{ t('owner.reply.save') }}
          </AppButton>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.owner-review-card,.owner-review-card__reply{display:grid;gap:var(--space-3)}.owner-review-card__reply{padding:var(--space-3);border:1px solid var(--color-border);border-radius:var(--radius-lg);background:var(--color-surface-muted)}.owner-review-card__reply>:deep(.app-button:first-child){justify-self:start}.owner-review-card__actions{display:flex;justify-content:flex-end;gap:var(--space-2)}.owner-review-card__error{margin:0;color:var(--color-danger);font-size:var(--font-size-sm)}
</style>
