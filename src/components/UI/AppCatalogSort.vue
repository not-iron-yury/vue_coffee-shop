<script setup lang="ts">
import { TYPES_OF_SORTING } from '@/constants'

defineProps({
  modelValue: {
    type: String,
  },
})

const emit = defineEmits({
  'update:modelValue': (item) => TYPES_OF_SORTING.includes(item),
})

const handleSelect = (event: Event) => {
  if (event.target instanceof HTMLSelectElement && event.target.value !== null) {
    emit('update:modelValue', event.target.value)
  }
}
</script>

<template>
  <select @change="handleSelect">
    <option disabled selected>Сортировка</option>
    <option value="price-maxtomin">Цена по убыванию</option>
    <option value="price-mintomax">Цена по возрастанию</option>
    <option value="weight-maxtomin">Вес по убыванию</option>
    <option value="weight-mintomax">Вес по возрастанию</option>
  </select>
</template>

<style lang="scss"></style>
