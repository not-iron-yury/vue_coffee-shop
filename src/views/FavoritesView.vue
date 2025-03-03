<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ProductCard from '../components/ProductCard.vue'
import { useProductsStore } from '@/stores/productsStore'
import { useUserProductsStore } from '@/stores/userProductsStore'
import type { IProduct } from '@/inretfaces'

const productsStore = useProductsStore()
const userProductsStore = useUserProductsStore()
const favorites = ref<IProduct[]>([])

onMounted(async () => {
  if (productsStore.items.length === 0) {
    await productsStore.getProducts()
  }
  favorites.value = getFavorites()
})

const getFavorites = (): IProduct[] => {
  const favoritesId: number[] = userProductsStore.userProducts.favorites // список id избранных товаров
  const productIndexMap: Map<number, number> = productsStore.productIndexMap // коллекция для получения индексов товаров

  return favoritesId.map((productId: number) => {
    const productIndex: number = productIndexMap.get(productId) as number // получение индекса товара в коллекции items
    return productsStore.items[productIndex] // искомый избранный товар
  })
}
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
