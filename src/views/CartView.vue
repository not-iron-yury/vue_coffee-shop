<script setup lang="ts">
import { computed } from 'vue'
import ProductCardInCart from '@/components/ProductCardInCart.vue'
import { useProductsStore } from '@/stores/productsStore'
import { useUserProductsStore } from '@/stores/userProductsStore'
import type { IProduct } from '@/inretfaces'

const productsStore = useProductsStore()
const userProductsStore = useUserProductsStore()

const cartItems = computed<IProduct[]>(() => {
  const productIndexMap: Map<number, number> = productsStore.productIndexMap // коллекция индексов товаров

  return Object.keys(userProductsStore.userProducts.cart)
    .map((id) => {
      const productIndex = productIndexMap.get(+id) // получаем индекс товара по его id
      if (productIndex !== undefined) {
        return productsStore.items[productIndex]
      } else {
        console.error(`Товар с ID ${id} не найден.`, { id, productIndexMap })
        return null
      }
    })
    .filter((product) => product !== null)
})
</script>

<template>
  <h1 class="title-h1">Корзина</h1>
  <section class="products">
    <ul class="products__list">
      <li v-for="(item, i) in cartItems" :key="i" class="products__item">
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
