<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: Number,
    default: 1,
  },
  min: {
    type: Number,
    default: 1,
  },
  max: {
    type: Number,
    default: 100,
  },
})

const emit = defineEmits(['update:modelValue'])

const value = ref<number>(1)

function increment() {
  if (value.value < props.max) {
    value.value++
    emit('update:modelValue', value.value)
  }
}

function decrement() {
  if (value.value > props.min) {
    value.value--
    emit('update:modelValue', value.value)
  }
}
</script>

<template>
  <div class="input-number">
    <span class="input-number__value">{{ value }}</span>
    <div class="input-number__buttons">
      <button @click="increment">+</button>
      <button @click="decrement">-</button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.input-number {
  display: flex;
  align-items: center;
  justify-content: space-between;

  width: 114px;
  height: 56px;

  font-size: 24px;
  background-color: transparent;
  border: 1px solid #ccc;

  &__value {
    text-align: center;
    width: 57px;
    font-weight: 500;
    font-size: 24px;
    line-height: 130%;
  }

  &__buttons {
    display: flex;
    flex-direction: column;

    width: 57px;
    height: 100%;

    & button {
      height: 100%;
      border-left: 1px solid #ccc;

      &:not(:last-child) {
        border-bottom: 1px solid #ccc;
      }
    }
  }
}

// .input-number-vertical button {
//   font-size: 24px;
//   background-color: transparent;
//   border: none;
//   cursor: pointer;
// }

.input-number-vertical span {
  font-weight: 500;
  font-size: 24px;
  text-align: center;
  line-height: 130%;
}
</style>
