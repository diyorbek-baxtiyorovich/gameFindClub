<template>
  <div class="card-page">
    <VenueDetail />
    <InfoDetails />
  </div>
</template>
<script setup>
import VenueDetail from '@/pages/card/components/VenueDetail.vue'
import InfoDetails from '@/pages/card/components/InfoDetails.vue'
</script>
<style scoped>
.card-page {
  width: 100%;
  height: auto;
  background: #0f1115;
}
</style>
