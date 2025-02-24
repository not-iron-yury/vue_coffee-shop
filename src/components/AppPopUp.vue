<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import { removeOverflowHidden } from '../functions'

defineProps({
  showOverlay: {
    type: Boolean,
    reqired: true,
  },
})

const emit = defineEmits(['close'])

const closeOverlay = () => {
  emit('close')
  removeOverflowHidden()
}
</script>

<template>
  <div class="overlay" @click.self="closeOverlay">
    <slot></slot>
  </div>
</template>

<style scoped lang="scss">
.overlay {
  position: fixed;
  top: 0;
  left: 0;

  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 100%;

  background-color: rgba(0, 0, 0, 0.7);
  z-index: 9999;
}
</style>
