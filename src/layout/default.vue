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

  background: #2d3441;
}

/* Scroll faqat contentda */
.content {
  flex: 1;

  overflow-y: auto;

  -webkit-overflow-scrolling: touch;

  padding-bottom: env(safe-area-inset-bottom);
}
</style>
