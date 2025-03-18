<script setup lang="ts">
import AppCatalogFilter from '../Filter/AppProductFilter.vue'
</script>

<template>
  <aside class="sidebar">
    <app-catalog-filter />
  </aside>
</template>

<style lang="scss" scoped>
.sidebar {
  margin-top: 100px;
  padding: 0 15px 0 0;
  max-width: 280px;
  width: 100%;

  border-right: 1px solid rgb(207, 207, 207);
}
</style>
