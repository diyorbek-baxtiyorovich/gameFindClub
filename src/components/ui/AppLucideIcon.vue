<script setup lang="ts">
import {
  ArrowLeft, BarChart3, Bell, Building2, Check, ChevronRight, CircleGauge, CircleUserRound, Clock3, Copy,
  ExternalLink, Eye, Gamepad2, Heart, Home, Image, List, ListFilter, LocateFixed, Map,
  Globe2, History, MapPin, MessageSquareText, Moon, Navigation, Phone, PlusCircle,
  Search, Settings, SlidersHorizontal, Sparkles, Star, Tag, Trophy, UserRound, X, MoreVertical,
  CalendarDays, DoorOpen, Glasses, UsersRound, Share2, Cpu, Monitor, Wifi, Armchair, Headphones, Keyboard, Mouse,
} from '@lucide/vue'

const props = withDefaults(defineProps<{ name: string; size?: number; strokeWidth?: number; filled?: boolean }>(), { size: 20, strokeWidth: 2, filled: false })
const icons: Readonly<Record<string, typeof Home>> = {
  'arrow-left': ArrowLeft, analytics: BarChart3, bell: Bell, building: Building2, check: Check, 'chevron-right': ChevronRight, copy: Copy, gauge: CircleGauge,
  'circle-user': CircleUserRound, clock: Clock3, 'external-link': ExternalLink,
  eye: Eye, gamepad: Gamepad2, heart: Heart, home: Home, image: Image, list: List, filter: ListFilter, locate: LocateFixed,
  globe: Globe2, history: History, map: Map, 'map-pin': MapPin, message: MessageSquareText,
  moon: Moon, navigation: Navigation, phone: Phone, plus: PlusCircle, search: Search, settings: Settings,
  sliders: SlidersHorizontal, sparkles: Sparkles, star: Star, tag: Tag, trophy: Trophy,
  user: UserRound, x: X, calendar: CalendarDays, door: DoorOpen, glasses: Glasses, users: UsersRound,
  share: Share2, cpu: Cpu, monitor: Monitor, wifi: Wifi, chair: Armchair, headphones: Headphones,
  keyboard: Keyboard, mouse: Mouse,
  more: MoreVertical,
}
</script>

<template>
  <component :is="icons[props.name] ?? Sparkles" :size="size" :stroke-width="strokeWidth" :fill="filled ? 'currentColor' : 'none'" aria-hidden="true" />
</template>
