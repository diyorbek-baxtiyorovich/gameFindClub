<template>
  <div class="map-page">
    <MapsHeader />

    <SearchFilterBar
      class="map-search"
      @search="onSearch"
      @filter="onFilter"
      @openFilter="openFilterModal"
    />
    <BottomSheetSlider />
  </div>
</template>

<script setup>
import SearchFilterBar from '@/components/ui/SearchFilterBar.vue'
import MapsHeader from '@/components/ui/mapsHeader.vue'
import BottomSheetSlider from '@/components/ui/BottomSheetSlider.vue'

const onSearch = (text) => {
  console.log('Search:', text)
}

const onFilter = (filter) => {
  console.log('Filter:', filter)
}

const openFilterModal = () => {
  console.log('Open filter modal')
}
</script>

<style scoped>
.map-page {
  position: relative;
  width: 100%;
  height: auto;
}

.map-search {
  position: absolute;
  top: 5px;
  left: 50%;
  transform: translateX(-50%);

  width: calc(100% - 10px);
  max-width: 720px;

  z-index: 1000;
}
</style>
