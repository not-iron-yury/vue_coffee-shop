<script setup lang="ts">
import { useProductsStore } from '@/stores/productsStore'
import AppCatalogFilterItem from './AppFilterCheckboxes.vue'

const productsStore = useProductsStore()

const optionsWeight = {
  title: 'Вес упаковки',
  name: 'weight',
  options: [500, 750, 1000, 1500, 2000],
}

const handlerFilter = (type: string) => {
  productsStore.addOrRemoveFilteringType(type)
}
</script>

<template>
  <div class="catalog-filter">
    <app-catalog-filter-item :data="optionsWeight" @onChange="handlerFilter" />
  </div>
</template>

<style lang="scss" scoped></style>
