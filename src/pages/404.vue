<template>
  <v-container fluid class="not-found">
    <div class="card">
      <v-icon size="96" color="primary" class="icon"> mdi-alert-circle-outline </v-icon>

      <h1 class="code">404</h1>

      <h2 class="title">Sahifa topilmadi</h2>

      <p class="description">Siz izlayotgan sahifa mavjud emas yoki o‘chirilgan bo‘lishi mumkin.</p>

      <div class="actions">
        <v-btn color="primary" size="large" rounded="lg" @click="goHome">
          <v-icon start>mdi-home</v-icon>
          Asosiy sahifaga
        </v-btn>

        <v-btn variant="text" color="grey" @click="goBack"> Orqaga qaytish </v-btn>
      </div>
    </div>
  </v-container>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/')
}

const goBack = () => {
  router.back()
}
</script>

<style scoped>
.not-found {
  height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;

  padding: 16px;

  background: #2d3441;
}

.card {
  width: 100%;
  max-width: 420px;

  padding: 32px 24px;

  text-align: center;

  background: #1f2633;
  border-radius: 20px;

  border: 1px solid rgba(255, 255, 255, 0.05);

  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
}

.icon {
  margin-bottom: 12px;
  opacity: 0.9;
}

.code {
  font-size: 72px;
  font-weight: 800;

  margin: 0;

  color: rgb(var(--v-theme-primary));
}

.title {
  font-size: 22px;
  font-weight: 600;

  margin: 8px 0;

  color: #f3f4f6;
}

.description {
  font-size: 14px;

  color: #9ca3af;
  margin-bottom: 24px;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.actions .v-btn--variant-text {
  color: #9ca3af;
}
</style>
