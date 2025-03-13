<script setup lang="ts">
import ProductCard from '../components/ProductCard.vue'
import { useUserProductsStore } from '@/stores/userProductsStore'

const userProductsStore = useUserProductsStore()
</script>

<template>
  <h1 class="title-h1">Избранные товары</h1>
  <section class="products">
    <ul class="products__list">
      <li v-for="(item, i) in userProductsStore.favoritesList" :key="i" class="products__item">
        <ProductCard :data="item" />
      </li>
    </ul>
  </section>
</template>

<style scoped lang="scss">
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
