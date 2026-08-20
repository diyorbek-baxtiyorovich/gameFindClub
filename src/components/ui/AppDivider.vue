<script setup lang="ts">
withDefaults(defineProps<{ orientation?: 'horizontal' | 'vertical'; label?: string }>(), {
  orientation: 'horizontal',
})
</script>

<template>
  <div
    class="app-divider"
    :class="`app-divider--${orientation}`"
    role="separator"
    :aria-orientation="orientation"
  >
    <span v-if="label" class="app-divider__label">{{ label }}</span>
  </div>
</template>

<style scoped>
.app-divider {
  border-color: var(--color-border);
}
.app-divider--horizontal {
  width: 100%;
  border-top: 1px solid var(--color-border);
  text-align: center;
}
.app-divider--vertical {
  align-self: stretch;
  border-left: 1px solid var(--color-border);
}
.app-divider__label {
  position: relative;
  top: -0.75em;
  padding: 0 var(--space-2);
  color: var(--color-text-secondary);
  background: var(--color-bg);
  font-size: var(--font-size-xs);
}
</style>
