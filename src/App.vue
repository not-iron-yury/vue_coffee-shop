<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppHeader from './components/layout/AppHeader.vue'
import AppFooter from './components/layout/AppFooter.vue'
import { useAuthStore } from '@/stores/authStore'
import { onMounted } from 'vue'

import { useProductsStore } from '@/stores/productsStore'

const productsStore = useProductsStore()

const authStore = useAuthStore()

onMounted(async () => {
  await productsStore.getProducts()

  const storedToken = localStorage.getItem('token')
  if (storedToken) {
    await authStore.loginWithToken(storedToken)
  }
})
</script>

<template>
  <app-header />
  <main class="main">
    <div class="container">
      <RouterView />
    </div>
  </main>
  <app-footer />
</template>

<style scoped>
.main {
  padding: 30px 0;
  flex-grow: 1;
}
</style>
