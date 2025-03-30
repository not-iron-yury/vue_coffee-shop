<script setup lang="ts">
import { computed } from 'vue'
import AppInputNumber from './UI/AppInputNumber.vue'
import AppFavoriteStatus from './UI/AppFavoriteStatus.vue'
import AppRemoveButton from './UI/AppRemoveButton.vue'
import { useUserProductsStore } from '@/stores/userProductsStore'
import type { IProduct } from '@/inretfaces'
import type { PropType } from 'vue'

const userProductsStore = useUserProductsStore()

const props = defineProps({
  data: {
    type: Object as PropType<IProduct>,
    required: true,
  },
})

const count = computed({
  get: () => userProductsStore.getProductCountInCart(props.data.id), // связывает карточку со своим значением в userProductsStore
  set: (value) => {
    if (value > 0) {
      userProductsStore.changeProductQuantityInCart(props.data, value)
    } else {
      userProductsStore.removeProductFromCart(props.data.id)
    }
  },
})

const inFavorite = computed(() => userProductsStore.getStatusProductInFavoIrites(props.data.id))
</script>

<template>
  <article class="product" v-cloak>
    <div class="product__btn-wrapper">
      <app-favorite-status
        :isFavorite="inFavorite"
        class="product__btn"
        @click="userProductsStore.toggleFavoritesInUserProducts(data.id)"
      />
      <app-remove-button
        class="product__btn"
        @click="userProductsStore.removeProductFromCart(data.id)"
      />
    </div>
    <img class="product__img" :src="`/img/products/${data.img}`" aria-hidden="true" />
    <h3 class="product__title">{{ data.title }}, {{ data.weight }} г</h3>
    <div class="product__prices">
      <p class="product__price-sum">{{ count * data.price }} руб.</p>
      <p class="product__price-one">{{ data.price }} руб. / 1шт</p>
    </div>
    <div class="product__actions">
      <app-input-number v-model="count" :min="1" :max="100" />
    </div>
  </article>
</template>

<style scoped lang="scss">
.product {
  display: grid;
  grid-template-columns: 40px 120px 1fr 150px 160px;
  align-items: center;

  &__btn-wrapper {
    display: flex;
    flex-direction: column;
    gap: 30px;
    opacity: 0.5;
  }

  &__btn {
    padding: 3px;
    height: 30px;
  }

  &__img {
    max-width: 120px;
  }

  &__prices {
    position: relative;
    text-align: center;
  }

  &__price-sum {
    font-weight: 400;
    font-size: 20px;
    color: var(--color-dark);
  }
  &__price-one {
    position: absolute;
    top: 25px;
    left: 50%;
    width: 100%;
    transform: translateX(-50%);
    font-size: 15px;
    color: rgb(158, 158, 158);
  }

  &__title {
    padding-left: 20px;
    font-weight: 400;
    font-size: 22px;
    line-height: 130%;
  }
  &__actions {
    display: flex;
    flex-direction: column;
    align-items: center;

    max-width: 275px;
    gap: 15px;
  }
}
</style>
