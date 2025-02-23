<script setup lang="ts">
import ProductCard from '../components/ProductCard.vue'
import { getBestProducts } from '../API'
import { onMounted, ref } from 'vue'
import type { IProduct } from '@/inretfaces'

const products = ref<IProduct[]>()

onMounted(async (): Promise<void> => {
  try {
    products.value = await getBestProducts()
  } catch (error) {
    console.error(error)
  }
})
</script>

<template>
  <!-- <h1 class="title-h1">Главная страница</h1> -->

  <section class="products">
    <h2 class="title-h2 products__title">Это Наше Лучшее Предложение</h2>
    <p class="products__descr">Кофе поможет рассказать вашей аудитории о вашем бизнесе.</p>
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
  padding: 140px 0;

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
    gap: 10px;
  }
}
</style>
