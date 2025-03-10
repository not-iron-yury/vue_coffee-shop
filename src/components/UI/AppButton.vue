<script setup lang="ts"></script>

<template>
  <button class="btn">
    <slot></slot>
  </button>
</template>

<style scoped lang="scss">
.btn {
  display: flex;
  align-items: center;
  justify-content: center;

  padding: 16px;

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
