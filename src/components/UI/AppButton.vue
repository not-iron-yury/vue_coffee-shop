<script setup lang="ts">
import { isValidLabel } from '../../validators'

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
  width: 100%;
  max-height: 57px;
  color: var(--color-light);
  font-weight: 700;
  font-size: 18px;

  background-color: var(--color-prime);
  border-radius: 5px;

  opacity: 1;
  transition: opacity 0.25s ease;

  @media (hover: hover) {
    &:not([disabled]):hover {
      opacity: 0.8;
    }
  }

  &:not([disabled]):active {
    opacity: 0.8;
  }

  &:disabled {
    background-color: rgba(255, 74, 50, 0.5);
  }
}
</style>
