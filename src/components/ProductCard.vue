<script setup lang="ts">
import { ref } from 'vue'
import InputNumber from './InputNumber.vue'
import AppButton from './AppButton.vue'
import { isValidPrice, isValidLabel } from '../validators'

const count = ref<number>(0)

defineProps({
  price: {
    type: Number,
    required: true,
    validator: isValidPrice,
  },
  title: {
    type: String,
    required: true,
    validator: isValidLabel,
  },
  descr: {
    type: String,
    required: false,
    validator: isValidLabel,
  },
  img: {
    type: String,
    required: true,
    validator: isValidLabel,
  },
})
</script>

<template>
  <article class="product">
    <img class="product__img" :src="`/img/products/${img}`" aria-hidden="true" />
    <p class="product__price">{{ price }} руб.</p>
    <h3 class="product__title">{{ title }}</h3>
    <p class="product__descr">{{ descr }}</p>
    <div class="product__actions">
      <InputNumber v-model="count" :min="1" :max="100" />
      <AppButton label="Заказать" />
    </div>
  </article>
</template>

<style scoped lang="scss">
.product {
  padding: 5px;
  max-width: 310px;

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
    font-size: 32px;
    line-height: 130%;
  }

  &__descr {
    margin-bottom: 30px;
    line-height: 160%;
    opacity: 0.6;
  }

  &__actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
