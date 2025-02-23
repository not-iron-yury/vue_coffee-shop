<script setup lang="ts">
import ProductCard from '../components/ProductCard.vue'
import { getProducts } from '../API'
import { onMounted, ref } from 'vue'
import type { IProduct } from '@/inretfaces'

const products = ref<IProduct[]>()

onMounted(async (): Promise<void> => {
  try {
    products.value = await getProducts()
  } catch (error) {
    console.error(error)
  }
})
</script>

<template>
  <h1 class="title-h1">Каталог</h1>
  <section class="products">
    <ul class="products__list">
      <li v-for="(item, i) in products" :key="i" class="products__item">
        <ProductCard
          :price="item.price"
          :title="item.title"
          :weight="item.weight"
          :img="item.img"
        />
      </li>
    </ul>
  </section>
</template>

<style scoped lang="scss">
.products {
  padding: 100px 0;

  &__title {
    margin-bottom: 20px;
  }
  &__descr {
    margin-bottom: 60px;
    font-size: 18px;
    line-height: 160%;
    opacity: 0.7;
  }

  &__list {
    display: flex;
    justify-content: space-between;
    row-gap: 100px;
    column-gap: 15px;
    flex-wrap: wrap;
  }
}
</style>
