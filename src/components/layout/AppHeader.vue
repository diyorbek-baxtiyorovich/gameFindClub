<script setup lang="ts">
import AppBackButton from '@/components/navigation/AppBackButton.vue'

withDefaults(defineProps<{ title?: string; showBackButton?: boolean }>(), { title: '', showBackButton: false })
</script>

<template>
  <header class="app-header">
    <div class="app-header__side"><AppBackButton v-if="showBackButton" /></div>
    <h1>{{ title }}</h1>
    <div class="app-header__side app-header__side--end"><slot name="actions" /></div>
  </header>
</template>

<style scoped>
.app-header {
  min-height: 56px;
  display: grid;
  grid-template-columns: 44px minmax(0, 1fr) 44px;
  align-items: center;
  gap: var(--space-2);
}
.app-header h1 {
  min-width: 0;
  margin: 0;
  overflow: hidden;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: var(--font-size-lg);
}
.app-header__side {
  min-width: 44px;
}
.app-header__side--end {
  display: flex;
  justify-content: flex-end;
}
</style>
