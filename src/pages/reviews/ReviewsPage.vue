<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import CategorySelector from '@/entities/category/components/CategorySelector.vue'
import { ReviewForm, ReviewList } from '@/entities/review'
import { venueListFixtures } from '@/entities/venue'
import { getCategoryById } from '@/config'
import { useReviewsStore } from '@/stores'
const reviews = useReviewsStore()
const selectedCategoryId = ref<string | null>(null)
const category = computed(() => getCategoryById(selectedCategoryId.value))
const filtered = computed(() => selectedCategoryId.value ? reviews.items.filter((item) => item.categoryCode === category.value.code) : reviews.items)
const venue = computed(() => venueListFixtures.find((item) => !selectedCategoryId.value || item.category.id === selectedCategoryId.value) ?? venueListFixtures[0])
onMounted(() => reviews.load())
</script>
<template><section class="reviews-page"><header><h1>Reviews</h1><p>Experiences across every venue category.</p></header><CategorySelector include-all :selected-id="selectedCategoryId" @select="selectedCategoryId=$event"/><ReviewList :items="filtered" :loading="reviews.loading" :error="reviews.error" @retry="reviews.load"/><ReviewForm v-if="venue" :venue-id="venue.id" :category-code="venue.category.slug" @submit="reviews.submit"/></section></template>
<style scoped>.reviews-page{display:grid;gap:var(--space-6);padding-block:var(--space-3)}header h1,header p{margin:0}header p{margin-top:var(--space-1);color:var(--color-text-secondary)}</style>
