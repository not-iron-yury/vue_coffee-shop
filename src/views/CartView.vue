<script setup lang="ts">
import ProductCardInCart from '@/components/ProductCardInCart.vue'
import { useUserProductsStore } from '@/stores/userProductsStore'
import AppSortSector from '@/components/UI/AppSortSector.vue'
import type { TSortingType } from '@/inretfaces'

const userProductsStore = useUserProductsStore()

const handleSortSelect = (type: TSortingType) => {
  userProductsStore.cartSortingType = type
}
</script>

<template>
  <section class="top">
    <h1 class="title-h1">Корзина</h1>
    <app-sort-sector @sortingType="handleSortSelect" />
  </section>

  <section class="products">
    <ul class="products__list">
      <li v-for="(item, i) in userProductsStore.sortedCartList" :key="i" class="products__item">
        <ProductCardInCart :data="item" />
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
    // row-gap: 30px;
    flex-wrap: wrap;
  }

  &__item {
    padding: 12px;
    width: 100%;
    border-bottom: 1px solid #e0e0e0;
  }
}
</style>
