<script setup lang="ts">
import { computed, ref } from 'vue'
import type { VenueDetail } from '../../model/venue'
const props = defineProps<{ venue: VenueDetail }>()
const active = ref(0)
const media = computed(() =>
  props.venue.media?.length
    ? props.venue.media.filter((item) => item.type === 'image')
    : props.venue.coverMedia
      ? [props.venue.coverMedia]
      : [],
)
</script>
<template>
  <section v-if="media.length" class="gallery" aria-label="Venue gallery">
    <div class="gallery__track">
      <button
        v-for="(item, index) in media"
        :key="item.id"
        type="button"
        :aria-label="`View image ${index + 1}`"
        @click="active = index"
      >
        <img
          :src="item.url"
          :alt="item.alt || ''"
          :width="item.width"
          :height="item.height"
          :loading="index === 0 ? 'eager' : 'lazy'"
          :fetchpriority="index === 0 ? 'high' : 'auto'"
          decoding="async"
          @error="($event.target as HTMLImageElement).style.display = 'none'"
        />
      </button>
    </div>
    <span v-if="media.length > 1" class="gallery__count"
      >{{ active + 1 }} / {{ media.length }}</span
    >
  </section>
</template>
<style scoped>
.gallery {
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-xl);
  background: var(--color-surface-muted);
}
.gallery__track {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 100%;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
}
.gallery button {
  position: relative;
  height: clamp(220px, 66vw, 320px);
  padding: 0;
  border: 0;
  scroll-snap-align: start;
  color: var(--color-text-secondary);
  background: transparent;
}
.gallery button::after {
  content: 'Photo unavailable';
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
}
.gallery img {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}
.gallery__count {
  position: absolute;
  z-index: 2;
  right: var(--space-3);
  bottom: var(--space-3);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-pill);
  color: white;
  background: rgb(0 0 0 / 64%);
  font-size: var(--font-size-xs);
}
</style>
