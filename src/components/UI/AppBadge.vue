<script setup lang="ts">
import { isNumber } from '@/validators'

defineProps({
  count: {
    type: Number,
    required: true,
    validator: isNumber,
  },
})
</script>

<template>
  <div class="badge-wrapper">
    <slot></slot>
    <div v-show="count > 0" class="badge">{{ count }}</div>
  </div>
</template>

<style scoped lang="scss">
.badge-wrapper {
  position: relative;
}
.badge {
  position: absolute;
  top: -7px;
  right: -7px;

  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;

  font-size: 12px;
  color: white;
  background-color: var(--color-prime);
  border-radius: 100%;
}
</style>
