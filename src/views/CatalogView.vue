<script setup lang="ts">
import { onMounted } from 'vue'
import ProductCard from '../components/ProductCard.vue'
import { useProductsStore } from '@/stores/productsStore'

const productsStore = useProductsStore()

onMounted(async () => {
  if (!productsStore.items.length) {
    try {
      await productsStore.getProducts()
    } catch (err) {
      console.error(err)
    }
  }
})
</script>

<template>
  <h1 class="title-h1">Каталог</h1>
  <section class="products">
    <ul class="products__list">
      <li v-for="(item, i) in productsStore.items" :key="i" class="products__item">
        <ProductCard
          :id="item.id"
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
