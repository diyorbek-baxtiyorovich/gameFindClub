<script setup lang="ts">
import {
  ArrowLeft, Check, ChevronRight, CircleGauge, CircleUserRound, Clock3, Dumbbell,
  ExternalLink, Gamepad2, Heart, Home, List, ListFilter, LocateFixed, Map,
  MapPin, Navigation, Phone, Search, SlidersHorizontal, Sparkles, Star, Tag,
  Trophy, UserRound, X,
} from '@lucide/vue'

const props = withDefaults(defineProps<{ name: string; size?: number; strokeWidth?: number; filled?: boolean }>(), { size: 20, strokeWidth: 2, filled: false })
const icons: Readonly<Record<string, typeof Home>> = {
  'arrow-left': ArrowLeft, check: Check, 'chevron-right': ChevronRight, gauge: CircleGauge,
  'circle-user': CircleUserRound, clock: Clock3, dumbbell: Dumbbell, 'external-link': ExternalLink,
  gamepad: Gamepad2, heart: Heart, home: Home, list: List, filter: ListFilter, locate: LocateFixed,
  map: Map, 'map-pin': MapPin, navigation: Navigation, phone: Phone, search: Search,
  sliders: SlidersHorizontal, sparkles: Sparkles, star: Star, tag: Tag, trophy: Trophy,
  user: UserRound, x: X,
}
</script>

<template>
  <component :is="icons[props.name] ?? Sparkles" :size="size" :stroke-width="strokeWidth" :fill="filled ? 'currentColor' : 'none'" aria-hidden="true" />
</template>
