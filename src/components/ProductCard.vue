<script setup lang="ts">
import { ref } from 'vue'
import InputNumber from './InputNumber.vue'
import AppButton from './AppButton.vue'
import { isValidPrice, isValidLabel, isValidWeight } from '../validators'

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
  weight: {
    type: Number,
    required: false,
    validator: isValidWeight,
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
    <h3 class="product__title">{{ title }}, {{ weight }} г</h3>
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
