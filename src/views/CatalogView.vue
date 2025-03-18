<script setup lang="ts">
import { onMounted } from 'vue'
import ProductCard from '@/components/ProductCard.vue'
import AppSortSector from '@/components/UI/AppSortSector.vue'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import { useProductsStore } from '@/stores/productsStore'
import type { TSortingType } from '@/inretfaces'

const productsStore = useProductsStore()

onMounted(async () => {
  if (productsStore.items.length === 0) {
    await productsStore.loadProducts(null)
  }
})

const handleSort = (type: TSortingType) => {
  productsStore.queryParams.sorting = type
}
</script>

<template>
  <section class="top">
    <h1 class="title-h1">Каталог</h1>
    <app-sort-sector @sortingType="handleSort" />
  </section>
  <div class="content">
    <app-sidebar />
    <section class="products">
      <ul class="products__list">
        <li v-for="item in productsStore.items" :key="item.id" class="products__item">
          <ProductCard :data="item" />
        </li>
      </ul>
    </section>
  </div>
</template>

<style scoped lang="scss">
.content {
  display: flex;
}
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
