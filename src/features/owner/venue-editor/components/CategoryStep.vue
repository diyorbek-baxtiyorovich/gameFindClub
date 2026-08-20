<script setup lang="ts">
import { ref } from 'vue'

import AppButton from '@/components/ui/AppButton.vue'
import AppModal from '@/components/ui/AppModal.vue'
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
</script>

<template>
  <div class="category-step">
    <div>
      <h3>{{ t('owner.editor.category.title') }}</h3>
      <p>{{ t('owner.editor.category.description') }}</p>
    </div>
    <CategorySelector :selected-id="draft.categoryId" @select="selectCategory" />
    <p v-if="!draft.categoryId" class="category-step__error" role="alert">{{ t('owner.editor.validation.category_required') }}</p>

    <AppModal :model-value="Boolean(pendingCategoryId)" :title="t('owner.editor.category.change_title')" :close-label="t('common.close')" @update:model-value="(open) => { if (!open) pendingCategoryId = null }">
      <p class="category-step__warning">{{ t('owner.editor.category.change_warning') }}</p>
      <template #footer>
        <AppButton variant="secondary" @click="pendingCategoryId = null">{{ t('owner.action.cancel') }}</AppButton>
        <AppButton @click="confirmCategoryChange">{{ t('owner.editor.category.change_confirm') }}</AppButton>
      </template>
    </AppModal>
  </div>
</template>

<style scoped>
.category-step { display: grid; gap: var(--space-5); }
.category-step h3, .category-step p { margin: 0; }
.category-step > div > p, .category-step__warning { margin-top: var(--space-2); color: var(--color-text-secondary); }
.category-step__error { color: var(--color-danger); font-size: var(--font-size-sm); }
</style>
