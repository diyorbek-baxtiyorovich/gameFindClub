<script setup lang="ts">
import { computed, ref } from 'vue'

import AppButton from '@/components/ui/AppButton.vue'
import AppTextarea from '@/components/ui/AppTextarea.vue'
import AppModal from '@/components/ui/AppModal.vue'
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
      <AppButton variant="secondary" size="sm" @click="editing = true">
        {{ t('owner.reply.action') }}
      </AppButton>
      <AppModal v-model="editing" placement="bottom" :title="t('owner.reply.sheet_title')" :close-label="t('common.close')" :close-on-backdrop="reviews.replyingReviewId !== review.id" @close="cancel">
        <div class="owner-review-card__editor">
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
        </div>
        <template #footer>
          <AppButton variant="ghost" :disabled="reviews.replyingReviewId === review.id" @click="cancel">
            {{ t('owner.action.cancel') }}
          </AppButton>
          <AppButton :loading="reviews.replyingReviewId === review.id" @click="save">
            {{ t('owner.reply.save') }}
          </AppButton>
        </template>
      </AppModal>
    </div>
  </div>
</template>

<style scoped>
.owner-review-card,.owner-review-card__reply,.owner-review-card__editor{display:grid;gap:var(--space-3)}.owner-review-card__reply{justify-items:start}.owner-review-card__error{margin:0;color:var(--color-danger);font-size:var(--font-size-sm)}
</style>
