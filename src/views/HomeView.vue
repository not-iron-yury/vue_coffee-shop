<script setup lang="ts">
import ProductCard from '../components/ProductCard.vue'

const items = [
  {
    price: 500,
    title: 'Бразильские зерна',
    descr: 'Кофе, который ты всегда готовишь сам так, как тебе нравится.',
    img: '1.jpg',
  },
  {
    price: 600,
    title: 'Вьетнамские зерна',
    descr: 'Кофе, который ты всегда готовишь сам так, как тебе нравится.',
    img: '1.jpg',
  },
  {
    price: 700,
    title: 'Африканские зерна',
    descr: 'Кофе, который ты всегда готовишь сам так, как тебе нравится.',
    img: '1.jpg',
  },
]
</script>

<template>
  <!-- <h1 class="title-h1">Главная страница</h1> -->

  <section class="products">
    <h2 class="title-h2 products__title">Это Наше Лучшее Предложение</h2>
    <p class="products__descr">Кофейня поможет вам рассказать аудитории о вашем бизнесе.</p>
    <ul class="products__list">
      <li v-for="(item, i) in items" :key="i" class="products__item">
        <ProductCard :price="item.price" :title="item.title" :descr="item.descr" :img="item.img" />
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
