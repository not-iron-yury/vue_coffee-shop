<script setup lang="ts">
import { computed } from 'vue'
import AppInputNumber from './UI/AppInputNumber.vue'
import AppButton from './UI/AppButton.vue'
import AppFavoriteStatus from './UI/AppFavoriteStatus.vue'
import { useUserProductsStore } from '@/stores/userProductsStore'
import type { IProduct } from '@/inretfaces'
import type { PropType } from 'vue'

const userProductsStore = useUserProductsStore()

const props = defineProps({
  data: {
    type: Object as PropType<IProduct>,
    required: true,
    description: 'Объект, описывающий товар.',
  },
})

const count = computed({
  get: () => userProductsStore.getProductCountInCart(props.data.id), // связывает карточку со своим значением в userProductsStore
  set: (value) => {
    if (value > 0) {
      userProductsStore.changeProductQuantityInCart(props.data.id, value)
    } else {
      userProductsStore.removeProductFromCart(props.data.id)
    }
  },
})

const inFavorite = computed(() => userProductsStore.getStatusProductInFavoIrites(props.data.id))
const inCart = computed(() => userProductsStore.getStatusProductInCart(props.data.id))
</script>

<template>
  <article class="product" v-cloak>
    <div class="product__icon-wrapper">
      <app-favorite-status
        :isFavorite="inFavorite"
        class="product__favorite"
        @click="userProductsStore.toggleFavoritesInUserProducts(data.id)"
      />
    </div>
    <img class="product__img" :src="`/img/products/${data.img}`" aria-hidden="true" />
    <p class="product__price">{{ data.price }} руб.</p>
    <h3 class="product__title">{{ data.title }}, {{ data.weight }} г</h3>
    <div class="product__actions">
      <app-input-number v-model="count" :min="0" :max="100" v-if="inCart" class="product__input" />
      <app-button :disabled="inCart" @click="userProductsStore.addProductToCart(data.id)">
        <template v-if="inCart"><img src="/cart.svg" /></template>
        <template v-else>В корзину</template>
      </app-button>
    </div>
  </article>
</template>

<style scoped lang="scss">
.product {
  padding: 5px;
  max-width: 310px;

  &__icon-wrapper {
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
    gap: 15px;
  }

  &__input {
    width: 100%;
  }
}
</style>
