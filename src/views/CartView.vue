<script setup lang="ts">
import ProductCardInCart from '@/components/ProductCardInCart.vue'
import { useUserProductsStore } from '@/stores/userProductsStore'

const userProductsStore = useUserProductsStore()
</script>

<template>
  <h1 class="title-h1">Корзина</h1>
  <section class="products">
    <ul class="products__list">
      <li v-for="(item, i) in userProductsStore.cartList" :key="i" class="products__item">
        <ProductCardInCart :data="item" />
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
