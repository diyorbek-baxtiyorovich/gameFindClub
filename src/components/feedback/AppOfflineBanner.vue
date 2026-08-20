<script setup lang="ts">
import { t } from '@/i18n'
defineEmits<{ retry: [] }>()
</script>
<template>
  <aside class="offline" role="status">
    <div>
      <strong>{{ t('common.offline') }}</strong
      ><span>{{ t('common.offline_description') }}</span>
    </div>
    <button type="button" @click="$emit('retry')">{{ t('common.retry') }}</button>
  </aside>
</template>
<style scoped>
.offline {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  margin-block: var(--space-2);
  padding: var(--space-3);
  border-radius: var(--radius-md);
  color: var(--color-text-primary);
  background: var(--color-warning-soft);
}
.offline div {
  display: grid;
  gap: var(--space-1);
}
.offline span {
  font-size: var(--font-size-xs);
}
button {
  min-height: var(--touch-target-min);
  border: 0;
  color: var(--color-primary);
  background: transparent;
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
}
</style>
