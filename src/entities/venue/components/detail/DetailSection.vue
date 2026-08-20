<script setup lang="ts">
defineProps<{ title: string }>()
</script>
<template>
  <section class="detail-section">
    <h2>{{ title }}</h2>
    <slot />
  </section>
</template>
<style scoped>
.detail-section {
  display: grid;
  gap: var(--space-4);
}
.detail-section h2 {
  margin: 0;
  font-size: var(--font-size-xl);
  letter-spacing: -0.02em;
}
</style>
