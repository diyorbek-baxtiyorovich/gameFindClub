<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

import AppIconButton from '@/components/ui/AppIconButton.vue'
import AppLucideIcon from '@/components/ui/AppLucideIcon.vue'
import { getTelegramService } from '@/services'

const props = withDefaults(defineProps<{ label?: string; fallbackRoute?: string }>(), {
  label: 'Go back',
  fallbackRoute: '/',
})
const router = useRouter()

function goBack(): void {
  if (window.history.length > 1) router.back()
  else void router.replace(props.fallbackRoute)
}

const telegramBackButton = getTelegramService().backButton
onMounted(() => {
  telegramBackButton?.onClick(goBack)
  telegramBackButton?.show()
})
onUnmounted(() => {
  telegramBackButton?.offClick(goBack)
  telegramBackButton?.hide()
})
</script>

<template>
  <AppIconButton :label="label" variant="ghost" @click="goBack"
    ><AppLucideIcon name="arrow-left" /></AppIconButton
  >
</template>
