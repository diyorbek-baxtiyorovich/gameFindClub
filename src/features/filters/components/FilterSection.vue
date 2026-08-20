<script setup lang="ts">
defineProps<{ title: string; description?: string }>()
</script>
<template><fieldset class="filter-section"><legend>{{ title }}</legend><p v-if="description">{{ description }}</p><div class="filter-section__content"><slot /></div></fieldset></template>
<style scoped>.filter-section { display: grid; gap: var(--space-2); margin: 0; padding: 0; border: 0; } legend { font-weight: var(--font-weight-semibold); } p { margin: 0; color: var(--color-text-secondary); font-size: var(--font-size-sm); } .filter-section__content { display: grid; gap: var(--space-2); }</style>
