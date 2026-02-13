<template>
  <div class="sheet" :style="sheetStyle">
    <div v-if="isClosed" class="sheet-preview" @click="openSheet">
      <div class="preview-handle"></div>
      <span>Nearby Venues</span>
    </div>

    <div class="sheet-header">
      <div>
        <h3>Nearby Venues</h3>
        <span>{{ items.length }} results</span>
      </div>

      <button class="close-btn" @click="closeSheet">✕</button>
    </div>

    <div ref="contentRef" class="sheet-content" @touchstart="detectDirection">
      <div class="card-row">
        <div v-for="item in items" :key="item.id" class="venue-card" @click="openDetail(item.id)">
          <div class="card-img">
            <img v-if="item.image" :src="item.image" />

            <div v-else class="no-image">No Image</div>

            <span class="status" :class="item.open ? 'open' : 'closed'">
              {{ item.open ? 'Open' : 'Closed' }}
            </span>

            <span class="rate">⭐ {{ item.rate }}</span>
          </div>

          <div class="card-body">
            <h4>{{ item.name }}</h4>

            <p>📍 {{ item.distance }} km · {{ item.type }}</p>

            <div class="tags">
              <span v-for="tag in item.tags" :key="tag">
                {{ tag }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="drag-zone" @touchstart="startDrag" @touchmove="onDrag" @touchend="endDrag"></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const getScreenHeight = () => {
  const tg = window.Telegram?.WebApp

  if (tg?.viewportHeight) {
    return tg.viewportHeight
  }

  return window.innerHeight
}

const screenH = getScreenHeight()

const SNAP = {
  FULL: 60,
  HALF: screenH * 0.45,
  CLOSED: screenH - 50,
}

const translateY = ref(SNAP.HALF)

const isClosed = computed(() => {
  return translateY.value >= SNAP.CLOSED - 5
})

let startY = 0
let startX = 0

const items = ref([
  {
    id: 1,
    name: 'Nexus eSports Bar',
    open: false,
    rate: 4.7,
    distance: 2.4,
    type: 'Bar & Lounge',
    tags: ['Console', 'Cocktails'],
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRc8rPdqJPDeSBASRqdBvA5GRW-3zBrm5miHQ&s',
  },
  {
    id: 2,
    name: 'Pixel Lounge',
    open: true,
    rate: 4.9,
    distance: 3.1,
    type: 'Arcade',
    tags: ['Events', 'VR'],
    image: 'https://frankfurt.apollo.olxcdn.com/v1/files/i2dq7g1pjtws2-UZ/image',
  },
  {
    id: 3,
    name: 'Game Arena',
    open: true,
    rate: 4.6,
    distance: 1.8,
    type: 'Gaming Club',
    tags: ['PC', 'LAN'],
    image: 'https://telegra.ph/file/f720f60fd6b42ee0ff5f8.jpg',
  },
])

const openDetail = (id) => {
  router.push(`/card/${id}`)
}

const detectDirection = (e) => {
  startX = e.touches[0].clientX
  startY = e.touches[0].clientY
}

const startDrag = (e) => {
  startY = e.touches[0].clientY
}

const onDrag = (e) => {
  const diffY = e.touches[0].clientY - startY
  const diffX = e.touches[0].clientX - startX

  if (Math.abs(diffX) > Math.abs(diffY)) return

  let next = translateY.value + diffY

  next = Math.max(SNAP.FULL, Math.min(SNAP.CLOSED, next))

  translateY.value = next

  startY = e.touches[0].clientY
}

const endDrag = () => {
  const y = translateY.value

  if (y < (SNAP.FULL + SNAP.HALF) / 2) {
    translateY.value = SNAP.FULL
  } else if (y < (SNAP.HALF + SNAP.CLOSED) / 2) {
    translateY.value = SNAP.HALF
  } else {
    translateY.value = SNAP.CLOSED
  }
}

const closeSheet = () => {
  translateY.value = SNAP.CLOSED
}

const openSheet = () => {
  translateY.value = SNAP.HALF
}

const sheetStyle = computed(() => ({
  transform: `translateY(${translateY.value}px)`,
}))

onMounted(() => {
  const tg = window.Telegram?.WebApp

  if (!tg) return

  tg.ready()
  tg.expand()

  tg.onEvent('viewportChanged', () => {
    const h = tg.viewportHeight

    SNAP.HALF = h * 0.5
    SNAP.CLOSED = h - 140
  })

  if (parseFloat(tg.version) >= 6.1) {
    tg.disableVerticalSwipes()
  }
})
</script>

<style scoped>
.sheet {
  max-height: 100dvh;
  height: 100dvh;
  position: fixed;
  inset: 0;

  background: #141821;

  border-radius: 26px 26px 0 0;

  z-index: 4000;

  display: flex;
  flex-direction: column;

  will-change: transform;

  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);

  padding-bottom: env(safe-area-inset-bottom);
}

.sheet-preview {
  position: absolute;

  top: -46px;
  left: 0;
  right: 0;

  height: 46px;

  background: #141821;

  border-radius: 20px 20px 0 0;

  display: flex;
  align-items: center;
  justify-content: center;

  gap: 8px;

  color: white;
  font-size: 14px;

  cursor: pointer;
}

.preview-handle {
  width: 34px;
  height: 4px;

  background: #666;

  border-radius: 999px;
}
.sheet-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 10px 18px;

  color: #f3f4f6;
}

.sheet-header h3 {
  font-size: 16px;
}

.close-btn {
  width: 32px;
  height: 32px;

  border-radius: 50%;
  border: none;

  background: rgba(255, 255, 255, 0.08);

  color: white;
  font-size: 18px;

  cursor: pointer;
}

.sheet-content {
  flex: 1;

  overflow-y: auto;

  -webkit-overflow-scrolling: touch;
}

.card-row {
  display: flex;

  gap: 16px;

  padding: 14px 16px 28px;

  overflow-x: auto;

  scroll-snap-type: x mandatory;
}

.card-row::-webkit-scrollbar {
  display: none;
}

.venue-card {
  min-width: 260px;

  background: #1c2230;

  border-radius: 18px;

  overflow: hidden;

  flex-shrink: 0;

  scroll-snap-align: start;

  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.45);

  transition: transform 0.15s ease;
}

.venue-card:active {
  transform: scale(0.96);
}

.card-img {
  height: 120px;

  background: #2d3441;

  position: relative;
  overflow: hidden;
}

.card-img img {
  width: 100%;
  height: 100%;

  object-fit: cover;
}

.no-image {
  width: 100%;
  height: 100%;

  background: #1f2937;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #d4dae6;
}

.status {
  position: absolute;
  top: 10px;
  left: 10px;

  font-size: 12px;

  padding: 4px 10px;

  border-radius: 999px;

  color: white;
}

.status.open {
  background: #22c55e;
}

.status.closed {
  background: #ef4444;
}

.rate {
  position: absolute;
  top: 10px;
  right: 10px;

  background: rgba(0, 0, 0, 0.6);

  color: white;

  font-size: 12px;

  padding: 4px 8px;

  border-radius: 999px;
}

.card-body {
  padding: 14px;

  color: #e5e7eb;
}

.card-body h4 {
  font-size: 15px;
  margin-bottom: 6px;
}

.card-body p {
  font-size: 12px;
  opacity: 0.8;
}

.tags {
  display: flex;
  gap: 8px;

  margin-top: 8px;

  flex-wrap: wrap;
}

.tags span {
  background: rgba(255, 255, 255, 0.06);

  padding: 4px 10px;

  border-radius: 999px;

  font-size: 11px;
}

.drag-zone {
  height: 26px;
  width: 100%;
}
</style>
