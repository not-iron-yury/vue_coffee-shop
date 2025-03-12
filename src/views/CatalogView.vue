<script setup lang="ts">
import { ref } from 'vue'
import ProductCard from '../components/ProductCard.vue'
import AppCatalogSort from '@/components/UI/AppCatalogSort.vue'
import { useProductsStore } from '@/stores/productsStore'

const productsStore = useProductsStore()

const typeOfSorting = ref<string>('')
</script>

<template>
  <section class="top">
    <h1 class="title-h1">Каталог</h1>
    <app-catalog-sort v-model="typeOfSorting" />
  </section>
  <section class="products">
    <ul class="products__list">
      <li v-for="(item, i) in productsStore.items" :key="i" class="products__item">
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
