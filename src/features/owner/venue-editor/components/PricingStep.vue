<script setup lang="ts">
import AppButton from '@/components/ui/AppButton.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppLucideIcon from '@/components/ui/AppLucideIcon.vue'
import AppSelect from '@/components/ui/AppSelect.vue'
import AppTextarea from '@/components/ui/AppTextarea.vue'
import type { PricingOption, PricingUnit } from '@/entities/venue'
import { validatePricingOption, type VenueEditorDraft } from '@/features/owner/venue-editor'
import { t } from '@/i18n'
import { useOwnerVenueDraftStore } from '@/stores'

const props = defineProps<{ draft: VenueEditorDraft }>()
const draftStore = useOwnerVenueDraftStore()
const unitOptions: readonly { value: PricingUnit; label: string }[] = [
  { value: 'hour', label: t('owner.pricing.unit.hour') },
  { value: 'session', label: t('owner.pricing.unit.session') },
  { value: 'day', label: t('owner.pricing.unit.day') },
  { value: 'month', label: t('owner.pricing.unit.month') },
  { value: 'person', label: t('owner.pricing.unit.person') },
]
const optionError = (option: PricingOption, field: 'name'|'amount'|'description') => {
  const key = validatePricingOption(option)[field]
  return key ? t(key) : undefined
}
const identityPricingUpdater = (option: PricingOption): PricingOption => option
type PricingUpdater = typeof identityPricingUpdater

function createId(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto ? `price-${crypto.randomUUID()}` : `price-${Date.now()}`
}

function addOption(): void {
  const option: PricingOption = {
    id: createId(),
    name: '',
    price: { amount: 0, currency: 'UZS' },
    unit: 'session',
  }
  draftStore.setPricing([...props.draft.pricing, option])
}

function updateOption(id: string, update: PricingUpdater): void {
  draftStore.setPricing(props.draft.pricing.map((option) => option.id === id ? update(option) : option))
}

function updateAmount(option: PricingOption, raw: string): void {
  const amount = Number(raw)
  updateOption(option.id, (current) => ({
    ...current,
    price: { ...current.price, amount: Number.isFinite(amount) ? amount : 0 },
  }))
}

function updateUnit(option: PricingOption, value: string | number | null): void {
  if (!unitOptions.some((item) => item.value === value)) return
  updateOption(option.id, (current) => ({ ...current, unit: value as PricingUnit }))
}

function removeOption(id: string): void {
  draftStore.setPricing(props.draft.pricing.filter((option) => option.id !== id))
}
</script>

<template>
  <div class="pricing-step">
    <header>
      <div><h3>{{ t('owner.editor.pricing.title') }}</h3><p>{{ t('owner.editor.pricing.description') }}</p></div>
      <AppButton size="sm" variant="secondary" @click="addOption"><template #leading><AppLucideIcon name="plus" /></template>{{ t('owner.editor.pricing.add') }}</AppButton>
    </header>

    <div v-if="draft.pricing.length" class="pricing-step__list">
      <article v-for="(option, index) in draft.pricing" :key="option.id">
        <div class="pricing-step__card-header"><strong>{{ t('owner.editor.pricing.option', { number: index + 1 }) }}</strong><button type="button" :aria-label="t('owner.editor.pricing.remove')" @click="removeOption(option.id)"><AppLucideIcon name="x" /></button></div>
        <AppInput :model-value="option.name" :label="t('owner.editor.pricing.name')" :placeholder="t('owner.editor.pricing.name_placeholder')" :error="optionError(option,'name')" required @update:model-value="updateOption(option.id, (current) => ({ ...current, name: $event }))" />
        <div class="pricing-step__row">
          <AppInput :model-value="option.price.amount > 0 ? option.price.amount.toString() : ''" type="number" :label="t('owner.editor.pricing.amount')" :min="1" :step="1000" :error="optionError(option,'amount')" required @update:model-value="updateAmount(option, $event)" />
          <div class="pricing-step__currency"><span>{{ t('owner.editor.pricing.currency') }}</span><strong>UZS</strong></div>
        </div>
        <AppSelect :model-value="option.unit" :label="t('owner.editor.pricing.unit')" :options="unitOptions" @update:model-value="updateUnit(option, $event)" />
        <AppTextarea :model-value="option.description ?? ''" :label="t('owner.editor.pricing.option_description')" :rows="3" :maxlength="300" :error="optionError(option,'description')" @update:model-value="updateOption(option.id, (current) => ({ ...current, description: $event || undefined }))" />
      </article>
    </div>
    <p v-else class="pricing-step__empty">{{ t('owner.editor.pricing.empty') }}</p>
  </div>
</template>

<style scoped>
.pricing-step { display: grid; gap: var(--space-4); }
.pricing-step > header { display: flex; align-items: flex-start; justify-content: space-between; gap: var(--space-3); }
.pricing-step h3, .pricing-step p { margin: 0; }
.pricing-step header p, .pricing-step__empty { margin-top: var(--space-1); color: var(--color-text-secondary); }
.pricing-step__list { display: grid; gap: var(--space-4); }
.pricing-step__list article { display: grid; gap: var(--space-4); padding: var(--space-4); border: 1px solid var(--color-border); border-radius: var(--radius-lg); background: var(--color-surface); }
.pricing-step__card-header { display: flex; align-items: center; justify-content: space-between; }
.pricing-step__card-header button { width: var(--touch-target-min); height: var(--touch-target-min); display: grid; place-items: center; border: 0; border-radius: var(--radius-md); color: var(--color-danger); background: transparent; cursor: pointer; }
.pricing-step__row { display: grid; grid-template-columns: minmax(0, 1fr) 90px; gap: var(--space-3); }
.pricing-step__currency { display: grid; align-content: start; gap: var(--space-2); }
.pricing-step__currency span { font-size: var(--font-size-sm); font-weight: var(--font-weight-medium); }
.pricing-step__currency strong { min-height: var(--touch-target-min); display: flex; align-items: center; padding-inline: var(--space-3); border: 1px solid var(--color-border); border-radius: var(--radius-md); background: var(--color-surface-muted); }
@media (max-width: 350px) { .pricing-step > header { flex-direction: column; } .pricing-step__row { grid-template-columns: 1fr; } }
</style>
