<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppHeader from './components/layout/AppHeader.vue'
import AppFooter from './components/layout/AppFooter.vue'
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
