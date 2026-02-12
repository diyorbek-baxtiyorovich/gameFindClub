<template>
  <div class="venue-page">
    <div class="hero" @touchstart="startSwipe" @touchend="endSwipe">
      <div class="slider" :style="sliderStyle">
        <img v-for="(img, i) in venue.images" :key="i" :src="img" class="hero-img" loading="lazy" />
      </div>

      <div class="hero-overlay"></div>

      <button class="arrow left" @click="prev">‹</button>

      <button class="arrow right" @click="next">›</button>

      <div class="top-bar">
        <button class="icon-btn" @click="goBack">←</button>

        <span class="page-title"> Club Profile </span>

        <div class="actions">
          <button class="icon-btn">⤴</button>
          <button class="icon-btn">♡</button>
        </div>
      </div>

      <div class="dots">
        <span
          v-for="(img, i) in venue.images"
          :key="i"
          :class="{ active: i === current }"
          @click="goTo(i)"
        />
      </div>
    </div>

    <div class="info-card">
      <div class="card-top">
        <div class="title-wrap">
          <h1 :title="venue.name">
            {{ venue.name }}
          </h1>
        </div>

        <span class="badge" :class="venue.open ? 'open' : 'closed'">
          {{ venue.open ? 'Open Now' : 'Closed' }}
        </span>
      </div>

      <div class="meta">
        <div class="rating">
          <span class="star">★</span>
          <span>{{ venue.rate }}</span>
          <span class="reviews"> ({{ venue.reviews }} reviews) </span>
        </div>

        <span class="divider">|</span>

        <div class="distance">📍 {{ venue.distance }} km away</div>
      </div>

      <div class="buttons">
        <button class="btn primary">
          <VIcon size="15px">mdi-map-marker</VIcon><span>Navigate</span>
        </button>

        <button class="btn icon"><VIcon size="20px">mdi-heart</VIcon></button>
        <button class="btn icon"><VIcon size="20px">mdi-phone</VIcon></button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { ref, computed, onMounted, onUnmounted } from 'vue'

const route = useRoute()
const router = useRouter()

const venues = [
  {
    id: 1,
    name: 'CyberZone Arena Super Long Name Example For Testing UI Layout',
    images: [
      'https://static.vecteezy.com/system/resources/thumbnails/022/460/214/small/children-flying-remote-control-drones-game-indoor-play-zone-photo.jpg',
      'https://plus.unsplash.com/premium_photo-1677870728119-52aef052d7ef',
      'https://img.freepik.com/free-vector/gradient-game-night-background_23-2151086344.jpg',
    ],
    rate: 4.9,
    reviews: 124,
    distance: 1.2,
    open: true,
  },
]

const venue = computed(() => {
  return (
    venues.find((v) => v.id == route.params.id) || {
      images: [],
    }
  )
})

const current = ref(0)
let timer = null

const startAuto = () => {
  stopAuto()

  if (!venue.value.images.length) return

  timer = setInterval(next, 4000)
}

const stopAuto = () => {
  if (timer) clearInterval(timer)
}

const next = () => {
  current.value = (current.value + 1) % venue.value.images.length
}

const prev = () => {
  current.value = (current.value - 1 + venue.value.images.length) % venue.value.images.length
}

const goTo = (i) => {
  current.value = i
  startAuto()
}

let startX = 0

const startSwipe = (e) => {
  startX = e.touches[0].clientX
}

const endSwipe = (e) => {
  const diff = e.changedTouches[0].clientX - startX

  if (diff > 50) prev()
  if (diff < -50) next()

  startAuto()
}

const sliderStyle = computed(() => ({
  transform: `translateX(-${current.value * 100}%)`,
}))

onMounted(startAuto)
onUnmounted(stopAuto)

const goBack = () => {
  router.back()
}
</script>

<style scoped>
.venue-page {
  background: transparent;
  color: white;
}

.hero {
  position: relative;
  height: 280px;
  overflow: hidden;
}

.slider {
  display: flex;
  height: 100%;
  transition: transform 0.45s ease;
}

.hero-img {
  min-width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-overlay {
  position: absolute;
  inset: 0;

  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.2), rgba(15, 19, 26, 0.9));
}

.arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);

  width: 36px;
  height: 36px;

  border-radius: 50%;
  border: none;

  background: rgba(0, 0, 0, 0.55);
  color: white;
  padding-bottom: 2px;
  font-size: 22px;

  z-index: 10;
}

.arrow.left {
  left: 10px;
}

.arrow.right {
  right: 10px;
}

.top-bar {
  position: absolute;
  inset: 0 0 auto 0;

  height: 60px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 0 16px;

  z-index: 20;
}

.page-title {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);

  font-size: 14px;
  font-weight: 500;

  pointer-events: none;
}

.actions {
  display: flex;
  gap: 10px;
}

.icon-btn {
  width: 38px;
  height: 38px;

  border-radius: 50%;
  border: none;

  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(6px);

  color: white;

  font-size: 16px;

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;
}

.dots {
  position: absolute;
  bottom: 70px;
  left: 50%;

  transform: translateX(-50%);

  display: flex;
  gap: 6px;

  z-index: 20;
}

.dots span {
  width: 8px;
  height: 8px;

  border-radius: 50%;
  background: rgba(255, 255, 255, 0.4);

  cursor: pointer;
}

.dots span.active {
  background: white;
}

.info-card {
  position: relative;
  background: linear-gradient(135deg, #1a1f2a, #141821);

  margin: -60px 16px 0;
  padding: 20px;

  border-radius: 26px;

  border: 1px solid rgba(255, 255, 255, 0.06);

  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.6),
    inset 0 1px 0 rgba(255, 255, 255, 0.04);
}

.card-top {
  display: flex;
  align-items: center;
}

.title-wrap {
  flex: 1;
  min-width: 0;
  margin-right: 12px;
}

.title-wrap h1 {
  font-size: 18px;
  font-weight: 700;
  line-height: 1.2;

  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;

  overflow: hidden;
  text-overflow: ellipsis;
}

.meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;

  margin-top: 10px;

  color: #cbd5e1;
  font-size: 14px;
}

.star {
  color: #facc15;
}

.reviews {
  opacity: 0.6;
}

.divider {
  opacity: 0.4;
}

.badge {
  padding: 6px 16px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
}

.badge.open {
  background: rgba(34, 197, 94, 0.15);
  color: #22c55e;
  border: 1px solid rgba(34, 197, 94, 0.4);
}

.badge.closed {
  background: rgba(239, 68, 68, 0.15);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.4);
}

.buttons {
  display: flex;
  gap: 14px;
  margin-top: 22px;
}

.btn.primary {
  flex: 1;
  min-width: 140px;

  background: linear-gradient(135deg, #4f8cff, #3b82f6);

  border-radius: 20px;

  font-size: 14px;
  font-weight: 600;

  color: white;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  box-shadow: 0 8px 30px rgba(59, 130, 246, 0.6);
}

.btn.icon {
  flex: 0 0 auto;

  width: 50px;
  height: 50px;

  border-radius: 18px;

  background: transparent;

  border: 2px solid #7c3aed;

  color: #7c3aed;

  font-size: 22px;

  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
