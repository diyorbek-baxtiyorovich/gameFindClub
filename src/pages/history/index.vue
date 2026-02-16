<template>
  <v-container class="archive-page pa-4">
    <div class="archive-header">
      <div class="d-flex justify-space-between align-center mb-4">
        <h2 class="text-white">Archive</h2>

        <v-btn icon variant="tonal">
          <v-icon>mdi-magnify</v-icon>
        </v-btn>
      </div>

      <div class="filter-row mb-4">
        <v-chip
          v-for="f in filters"
          :key="f"
          :color="activeFilter === f ? 'deep-purple-accent-4' : ''"
          :variant="activeFilter === f ? 'flat' : 'tonal'"
          class="mr-2 filter-chip"
          @click="activeFilter = f"
        >
          {{ f }}
        </v-chip>
      </div>
    </div>
    <div class="archive-list">
      <div v-if="!filteredList.length" class="empty-state">
        <v-icon size="70" color="grey-darken-1"> mdi-archive-off </v-icon>

        <h3 class="text-grey-lighten-1 mt-3">No Records Found</h3>
      </div>

      <v-card
        v-else
        v-for="item in filteredList"
        :key="item.id"
        class="archive-card mb-4"
        elevation="0"
      >
        <div class="image-wrapper">
          <v-img :src="item.image" height="170" cover />

          <div class="img-overlay"></div>

          <v-chip class="status-chip" :class="item.status" size="small">
            ● {{ item.status }}
          </v-chip>
        </div>

        <v-card-text class="card-body">
          <h3 class="text-white card-title">
            {{ item.name }}
          </h3>

          <div class="text-grey text-caption location mb-3">
            <v-icon size="14">mdi-map-marker</v-icon>
            {{ item.location }}
          </div>

          <div class="info-grid mb-4">
            <div class="info-box">
              <v-icon size="18" color="deep-purple-accent-4"> mdi-calendar </v-icon>

              <div>
                <div class="info-label">Date</div>
                <div class="info-value">{{ item.date }}</div>
              </div>
            </div>

            <div class="info-box">
              <v-icon size="18" color="deep-purple-accent-4"> mdi-timer </v-icon>

              <div>
                <div class="info-label">Duration</div>
                <div class="info-value">{{ item.duration }}</div>
              </div>
            </div>
          </div>

          <div class="bottom-row">
            <div class="rating">⭐ 4.9 <span>(2k+)</span></div>

            <v-btn :color="item.btnColor" variant="flat" size="small" class="ticket-btn">
              {{ item.btnText }}
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </div>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue'

const filters = ['All', 'Completed', 'Cancelled', 'Upcoming']
const activeFilter = ref('All')

const archiveList = ref([
  {
    id: 1,
    name: 'Cyber Nexus Gaming Hub',
    location: 'Shibuya, Tokyo • 1.2km away',
    date: 'Oct 12, 2023',
    duration: '4 Hours Session',
    status: 'Completed',
    users: 3,
    btnText: 'View Details',
    btnColor: 'deep-purple',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfsJO6vEp5eKRi2zDAd03mKFBOzQ9fDKbs9A&s',
  },

  {
    id: 2,
    name: 'Neon Arena Esports',
    location: 'Seoul, South Korea • 4.5km away',
    date: 'Nov 05, 2023',
    duration: 'Full Day Pass',
    status: 'Cancelled',
    users: 1,
    btnText: 'Support',
    btnColor: 'red',
    image:
      'https://avatars.mds.yandex.net/get-altay/10648814/2a0000018c80e1f1ebc009b1cf3a554f5810/L_height',
  },

  {
    id: 3,
    name: 'The Pixel Hub Berlin',
    location: 'Berlin, Germany • 0.8km away',
    date: 'Dec 22, 2023',
    duration: '3 Hours Session',
    status: 'Upcoming',
    users: 2,
    btnText: 'View Ticket',
    btnColor: 'blue',
    image:
      'https://avatars.mds.yandex.net/get-altay/10636707/2a0000018bbdd951a8d2be6fb1b712893003/L_height',
  },
])

const filteredList = computed(() => {
  if (activeFilter.value === 'All') {
    return archiveList.value
  }

  return archiveList.value.filter((i) => i.status === activeFilter.value)
})
</script>

<style scoped>
.archive-page {
  background: #0f172a;
  min-height: 100vh;

  display: flex;
  flex-direction: column;
}
.archive-header {
  position: sticky;
  top: 0;
  z-index: 10;

  background: #0f172a;
  padding-bottom: 8px;
}
.filter-row {
  display: flex;
  overflow-x: auto;
}

.archive-card {
  background: #020617;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.image-wrapper {
  position: relative;
}

.img-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.6));
}
.archive-list {
  flex: 1;
  overflow-y: auto;

  padding-bottom: 16px;
}
.filter-chip {
  color: white;
  font-weight: 500;
  backdrop-filter: blur(15px);
  border-radius: 100px;
}
.archive-list::-webkit-scrollbar {
  width: 4px;
}

.archive-list::-webkit-scrollbar-thumb {
  background: #334155;
  border-radius: 10px;
}
.status-chip {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
}

.Completed {
  border-left: 3px solid #22c55e;
}

.Cancelled {
  border-left: 3px solid #ef4444;
}

.Upcoming {
  border-left: 3px solid #3b82f6;
}

.info-row {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #94a3b8;
}
/* Card body */
.card-body {
  padding: 16px;
}

/* Title */
.card-title {
  font-size: 17px;
  font-weight: 600;
  line-height: 1.3;
}

/* Location */
.location {
  display: flex;
  align-items: center;
  gap: 4px;
}

/* Info Grid */
.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

/* Info Box */
.info-box {
  display: flex;
  align-items: center;
  gap: 10px;

  background: rgba(255, 255, 255, 0.04);
  padding: 10px 12px;
  border-radius: 12px;
}

/* Label */
.info-label {
  font-size: 11px;
  color: #94a3b8;
}

.info-value {
  font-size: 13px;
  color: white;
  font-weight: 500;
}

.bottom-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.rating {
  display: flex;
  align-items: center;
  gap: 4px;

  color: #facc15;
  font-weight: 600;
  font-size: 14px;
}

.rating span {
  color: #94a3b8;
  font-weight: 400;
}

.ticket-btn {
  border-radius: 20px;
  padding: 0 18px;
  font-weight: 600;
}

.empty-state {
  height: 60vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
