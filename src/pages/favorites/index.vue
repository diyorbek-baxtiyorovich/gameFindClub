<template>
  <v-container class="favorites-page pa-4">
    <div class="d-flex justify-space-between align-center mb-4">
      <div>
        <h2 class="text-white">Favorites Club</h2>
        <span class="text-grey text-caption">
          {{ favorites.length }} clubs saved to your list
        </span>
      </div>

      <v-btn icon variant="tonal">
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
    </div>

    <div class="favorites-list" v-if="favorites.length">
      <v-card v-for="item in favorites" :key="item.id" class="favorite-card mb-4" elevation="0">
        <div class="image-wrapper" @click="openDetail(item.id)">
          <v-img :src="item.image" height="180" cover />

          <div class="img-overlay"></div>

          <v-chip
            class="status-chip"
            :color="item.open ? 'green' : 'red'"
            variant="flat"
            text-color="white"
            size="small"
          >
            {{ item.open ? 'Open Now' : 'Closed' }}
          </v-chip>

          <v-chip class="rating-chip" color="black" variant="flat" text-color="white" size="small">
            ⭐ {{ item.rating }}
          </v-chip>
        </div>

        <v-card-text class="pt-3">
          <div class="d-flex justify-space-between align-center mb-1">
            <h3 class="text-white venue-title">
              {{ item.name }}
            </h3>
          </div>

          <div class="text-grey text-caption mb-3 location-text">
            <v-icon>mdi-map-marker</v-icon>
            {{ item.distance }} • {{ item.area }}
          </div>

          <div class="d-flex align-center justify-space-between">
            <v-btn color="primary" variant="tonal" class="flex-grow-1 mr-2" @click="navigate(item)">
              <v-icon start>mdi-navigation</v-icon>
              Yo‘nalish
            </v-btn>

            <v-btn icon color="red" variant="tonal" size="small" @click="remove(item.id)">
              <v-icon size="20">mdi-trash-can</v-icon>
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </div>
    <div v-else class="empty-state">
      <v-icon size="70" color="grey-darken-1"> mdi-heart-off-outline </v-icon>

      <h3 class="text-grey-lighten-1 mt-4">No Favorites Yet</h3>

      <p class="text-grey text-caption mt-2">Saved clubs will appear here</p>
    </div>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const favorites = ref([
  {
    id: 1,
    name: 'CyberZone Arena',
    distance: '1.2 km',
    area: 'Downtown District',
    rating: 4.9,
    open: true,
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQV40z1f-MwQSlZcS4GtpY7tceL2WswYXCk3g&s',
  },

  {
    id: 2,
    name: 'Nexus eSports Bar',
    distance: '2.4 km',
    area: 'Waterfront Area',
    rating: 4.7,
    open: false,
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8PLdc-X1hWS-RTdIJscCshL801AVpi9d7TQ&s',
  },

  {
    id: 3,
    name: 'Pixel Lounge',
    distance: '3.1 km',
    area: 'Uptown Square',
    rating: 4.5,
    open: true,
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSWbOXVJQbAExni8_AC76nvHNkC_jgivXSYg&s',
  },
])
const openDetail = (id) => {
  router.push(`/card/${id}`)
}

const navigate = (item) => {
  console.log('Navigate to:', item.name)
}

const remove = (id) => {
  favorites.value = favorites.value.filter((i) => i.id !== id)
}
</script>

<style scoped>
.favorites-page {
  background: #0f172a;
  min-height: 100vh;
}

.favorite-card {
  background: #020617;
  border-radius: 16px;
  overflow: hidden;
}

.image-wrapper {
  position: relative;
}
.img-overlay {
  position: absolute;
  inset: 0;

  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.4));

  pointer-events: none;
}

.status-chip {
  position: absolute;
  top: 10px;
  left: 10px;
}

.rating-chip {
  position: absolute;
  top: 10px;
  right: 10px;
}

.favorites-list {
  max-height: calc(100vh - 120px);
  overflow-y: auto;
}

.favorites-list::-webkit-scrollbar {
  width: 4px;
}

.favorites-list::-webkit-scrollbar-thumb {
  background: #334155;
  border-radius: 10px;
}

.venue-title {
  max-width: 75%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 16px;
  font-weight: 600;
}

.location-text {
  line-height: 1.3;
}

.v-btn {
  min-height: 38px;
}

.empty-state {
  height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}
</style>
