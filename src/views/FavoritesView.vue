<script setup lang="ts">
import ProductCard from '../components/ProductCard.vue'
import { useUserProductsStore } from '@/stores/userProductsStore'
import AppSortSector from '@/components/UI/AppSortSector.vue'
import type { TSortingType } from '@/inretfaces'

const userProductsStore = useUserProductsStore()

const handleSortSelect = (type: TSortingType) => {
  userProductsStore.favoritesSortingType = type
}
</script>

<template>
  <section class="top">
    <h1 class="title-h1">Избранные товары</h1>
    <app-sort-sector @sortingType="handleSortSelect" />
  </section>

  <section class="products">
    <ul class="products__list">
      <li
        v-for="(item, i) in userProductsStore.sortedFavoritesList"
        :key="i"
        class="products__item"
      >
        <ProductCard :data="item" />
      </li>
    </ul>
  </section>
</template>

<style scoped lang="scss">
.top {
  display: flex;
  justify-content: space-between;
}

.products {
  padding: 100px 0;

  &__list {
    display: flex;
    justify-content: space-between;
    row-gap: 100px;
    column-gap: 15px;
    flex-wrap: wrap;
  }
}
</style>
