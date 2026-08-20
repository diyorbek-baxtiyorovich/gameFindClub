<script setup lang="ts">
import { ref } from 'vue'

import AppButton from '@/components/ui/AppButton.vue'
import { CategorySelector } from '@/entities/category'
import type { VenueEditorDraft } from '@/features/owner/venue-editor'
import { t } from '@/i18n'
import { useOwnerVenueDraftStore } from '@/stores'

const props = defineProps<{ draft: VenueEditorDraft }>()
const draftStore = useOwnerVenueDraftStore()
const pendingCategoryId = ref<string | null>(null)

function selectCategory(categoryId: string | null): void {
  if (!categoryId || categoryId === props.draft.categoryId) return
  if (Object.keys(props.draft.categoryAttributes).length) {
    pendingCategoryId.value = categoryId
    return
  }
  draftStore.setCategory(categoryId)
}

function confirmCategoryChange(): void {
  if (!pendingCategoryId.value) return
  draftStore.setCategory(pendingCategoryId.value, true)
  pendingCategoryId.value = null
}

function cancelCategoryChange(): void {
  pendingCategoryId.value = null
}
</script>

<template>
  <div class="category-step">
    <div>
      <h3>{{ t('owner.editor.category.title') }}</h3>
      <p>{{ t('owner.editor.category.description') }}</p>
    </div>
    <CategorySelector :selected-id="pendingCategoryId ?? draft.categoryId" @select="selectCategory" />
    <p v-if="!draft.categoryId" class="category-step__error" role="alert">{{ t('owner.editor.validation.category_required') }}</p>

    <section v-if="pendingCategoryId" class="category-step__confirmation" role="alert">
      <div>
        <strong>{{ t('owner.editor.category.change_title') }}</strong>
        <p>{{ t('owner.editor.category.change_warning') }}</p>
      </div>
      <div class="category-step__actions">
        <AppButton variant="secondary" @click="cancelCategoryChange">{{ t('owner.action.cancel') }}</AppButton>
        <AppButton @click="confirmCategoryChange">{{ t('owner.editor.category.change_confirm') }}</AppButton>
      </div>
    </section>
  </div>
</template>

<style scoped>
.category-step { display: grid; gap: var(--space-5); }
.category-step h3, .category-step p { margin: 0; }
.category-step > div > p, .category-step__confirmation p { margin-top: var(--space-2); color: var(--color-text-secondary); }
.category-step__error { color: var(--color-danger); font-size: var(--font-size-sm); }
.category-step__confirmation { display: grid; gap: var(--space-3); padding: var(--space-4); border: 1px solid var(--color-warning); border-radius: var(--radius-xl); background: var(--color-warning-soft); }
.category-step__actions { display: flex; justify-content: flex-end; gap: var(--space-2); }
@media (max-width: 350px) { .category-step__actions { grid-template-columns: 1fr; display: grid; } }
</style>
