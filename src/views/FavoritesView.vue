<script setup lang="ts">
import { computed } from 'vue'
import ProductCard from '../components/ProductCard.vue'
import { useProductsStore } from '@/stores/productsStore'
import { useUserProductsStore } from '@/stores/userProductsStore'
import type { IProduct } from '@/inretfaces'

const productsStore = useProductsStore()
const userProductsStore = useUserProductsStore()

const favorites = computed<IProduct[]>(() => {
  const productIndexMap = productsStore.productIndexMap // коллекция индексов товаров

  return userProductsStore.userProducts.favorites
    .map((id) => {
      const productIndex = productIndexMap.get(id) // получаем индекс товара по его id
      if (productIndex !== undefined) {
        // если индекс товара найден, возвращаем соответствующий товар
        return productsStore.items[productIndex]
      } else {
        // если индекс не найден, логируем ошибку и возвращаем null
        console.error(`Товар с ID ${id} не найден.`, { id, productIndexMap })
        return null
      }
    })
    .filter((product): product is IProduct => product !== null)
})
</script>

<template>
  <h1 class="title-h1">Избранные товары</h1>
  <section class="products">
    <ul class="products__list">
      <li v-for="(item, i) in favorites" :key="i" class="products__item">
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
