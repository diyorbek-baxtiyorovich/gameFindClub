<template>
  <v-app>
    <v-layout class="app-layout">
      <v-main class="content">
        <slot />
      </v-main>

      <BottomNav />
    </v-layout>
  </v-app>
</template>

<script setup>
import BottomNav from '@/components/ui/BottomNav.vue'
</script>

<style scoped>
.app-layout {
  width: 100%;
  height: 100dvh;
  max-width: 1000px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;

  overflow: hidden;
  background: #2d3441;
}

.content {
  flex: 1;

  overflow-y: auto;

  padding-bottom: calc(56px + env(safe-area-inset-bottom));
}
</style>
