<script setup lang="ts">
import type { PricingOption } from '../../model/venue'
import { formatPrice } from '../../utils'
import AppLucideIcon from '@/components/ui/AppLucideIcon.vue'
import DetailSection from './DetailSection.vue'
import { t } from '@/i18n'
defineProps<{ options?: readonly PricingOption[] }>()
</script>
<template>
  <DetailSection v-if="options?.length" :title="t('venue.pricing')"
    ><div class="pricing">
      <article v-for="option in options" :key="option.id">
        <span class="pricing__icon"><AppLucideIcon name="tag" /></span>
        <div>
          <h3>{{ option.name }}</h3>
          <p v-if="option.description">{{ option.description }}</p>
        </div>
        <strong>{{ formatPrice(option) }}</strong>
        <ul v-if="option.conditions?.length">
          <li v-for="condition in option.conditions" :key="condition">{{ condition }}</li>
        </ul>
        <p v-if="option.membershipInfo" class="pricing__membership">{{ option.membershipInfo }}</p>
      </article>
    </div></DetailSection
  >
</template>
<style scoped>
.pricing {
  display: grid;
  gap: var(--space-3);
}
.pricing article {
  display: grid;
  grid-template-columns: 44px minmax(0, 1fr) auto;
  align-items: center;
  gap: var(--space-2) var(--space-3);
  padding: var(--space-3);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-surface-muted);
}
.pricing__icon {
  width: 40px;
  height: 40px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  color: var(--color-primary);
  background: var(--color-primary-soft);
}
.pricing h3,
.pricing p,
.pricing ul {
  margin: 0;
}
.pricing h3 {
  overflow-wrap: anywhere;
  font-size: var(--font-size-md);
}
.pricing p,
.pricing li {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
}
.pricing strong {
  padding: var(--space-2);
  border-radius: var(--radius-sm);
  white-space: nowrap;
  background: var(--color-surface);
}
.pricing ul,
.pricing__membership {
  grid-column: 2 / -1;
  padding-left: var(--space-5);
}
@media (max-width: 360px) {
  .pricing article {
    grid-template-columns: 40px minmax(0, 1fr);
  }
  .pricing strong {
    grid-column: 2;
    justify-self: start;
  }
}
</style>
