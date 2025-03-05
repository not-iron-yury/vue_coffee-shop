<script setup lang="ts">
import { ref } from 'vue'
import AppInputNumber from './UI/AppInputNumber.vue'
import AppButton from './UI/AppButton.vue'
import AppFavoriteStatus from './UI/AppFavoriteStatus.vue'
import { useUserProductsStore } from '@/stores/userProductsStore'
import type { IProduct } from '@/inretfaces'
import type { PropType } from 'vue'

const userProductsStore = useUserProductsStore()
const count = ref<number>(0)

defineProps({
  data: {
    type: Object as PropType<IProduct>,
    required: true,
    description: 'Объект, описывающий товар.',
    // validator: просто не хочу его делать
  },
})
</script>

<template>
  <article class="product">
    <div class="product__favorite-wrapper">
      <app-favorite-status
        :favorite="data.inFavorites"
        class="product__favorite"
        @click="userProductsStore.toggleFavoritesInUserProducts(data.id)"
      />
    </div>
    <img class="product__img" :src="`/img/products/${data.img}`" aria-hidden="true" />
    <p class="product__price">{{ data.price }} руб.</p>
    <h3 class="product__title">{{ data.title }}, {{ data.weight }} г</h3>
    <div class="product__actions">
      <app-input-number v-model="count" :min="1" :max="100" />
      <app-button label="В корзину" />
    </div>
  </article>
</template>

<style scoped lang="scss">
.product {
  padding: 5px;
  max-width: 310px;

  &__favorite-wrapper {
    display: flex;
    justify-content: flex-end;
    width: 100%;
  }
  &__favorite {
    padding: 3px;
    height: 30px;
  }

  &__img {
    margin-bottom: 35px;
  }

  &__price {
    margin-bottom: 10px;
    font-weight: 700;
    font-size: 24px;
    color: var(--color-dark);
  }

  &__title {
    margin-bottom: 15px;
    font-weight: 600;
    font-size: 28px;
    line-height: 130%;
  }
  &__actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
