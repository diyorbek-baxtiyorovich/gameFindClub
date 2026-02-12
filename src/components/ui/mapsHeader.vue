<template>
  <yandex-map v-model="map" height="100vh" width="100%" :settings="mapSettings">
    <yandex-map-default-scheme-layer />
    <yandex-map-default-features-layer />

    <yandex-map-controls :settings="{ position: 'right' }">
      <yandex-map-zoom-control />
    </yandex-map-controls>

    <yandex-map-controls :settings="{ position: 'left' }">
      <yandex-map-geolocation-control />
    </yandex-map-controls>

    <yandex-map-clusterer
      :settings="{
        gridSize: 64,
        zoomOnClusterClick: true,
      }"
    >
      <yandex-map-default-marker
        v-for="(item, i) in markers"
        :key="i"
        :settings="getMarker(item)"
      />

      <template #cluster="{ length }">
        <div class="cluster">
          {{ length }}
        </div>
      </template>
    </yandex-map-clusterer>
  </yandex-map>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import {
  YandexMap,
  YandexMapClusterer,
  YandexMapControls,
  YandexMapDefaultFeaturesLayer,
  YandexMapDefaultMarker,
  YandexMapDefaultSchemeLayer,
  YandexMapGeolocationControl,
  YandexMapZoomControl,
} from 'vue-yandex-maps'
const map = ref(null)

const mapSettings = ref({
  location: {
    center: [69.2401, 41.2995],
    zoom: 14,
  },
  theme: 'dark',
})

const markers = ref([
  {
    id: 1,
    lat: 41.305,
    lng: 69.25,
    title: 'CyberZone',
    status: 'active',
  },
  {
    id: 2,
    lat: 41.29,
    lng: 69.22,
    title: 'GameClub',
    status: 'passive',
  },
])

onMounted(() => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude
        const lng = pos.coords.longitude

        mapSettings.value.location.center = [lng, lat]
        mapSettings.value.location.zoom = 17
      },
      () => {
        console.log('Location olinmadi')
      },
    )
  }
})

const getMarker = (item) => {
  return {
    coordinates: [item.lng, item.lat],
    title: item.title,
    subtitle: 'Game Club',
    color: getColor(item.status),
    scale: 0.9,

    onClick: () => {
      console.log('Bosildi:', item.id)
    },
  }
}

const getColor = (status) => {
  if (status === 'active') return 'green'
  if (status === 'passive') return 'red'

  return 'gray'
}
</script>

<style scoped>
.cluster {
  width: 36px;
  height: 36px;

  background: linear-gradient(135deg, #7c3aed, #3b82f6);
  color: white;

  border-radius: 50%;

  display: flex;
  align-items: center;
  justify-content: center;

  font-weight: bold;
  font-size: 13px;

  box-shadow: 0 0 10px rgba(124, 58, 237, 0.6);
}
</style>
