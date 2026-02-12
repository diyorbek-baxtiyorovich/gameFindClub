<template>
  <div class="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-900 text-white">
    <h1 class="text-2xl font-bold">Hello User 👋</h1>

    <v-btn color="primary" size="large" rounded="xl" elevation="4" class="px-8" @click="send">
      Profilega O‘tish
    </v-btn>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const userId = 123 // bu backend/telegramdan keladi

const send = () => {
  router.push(`/user/${userId}`)
}
</script>
