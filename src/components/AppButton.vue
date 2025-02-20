<script setup lang="ts">
import { isValidLabel } from '../validators'

defineProps({
  label: {
    type: String,
    default: 'Жмак',
    validator: isValidLabel,
  },
})
</script>

<template>
  <button class="btn">
    {{ label }}
  </button>
</template>

<style scoped lang="scss">
.btn {
  padding: 16px 35px;
  max-height: 57px;
  color: var(--color-light);
  font-weight: 700;
  font-size: 18px;

  background-color: var(--color-prime);
  border-radius: 5px;

  @media (hover: hover) {
    &:hover {
      opacity: 0.8;
    }
  }
  &:active {
    opacity: 0.8;
  }
}
</style>
