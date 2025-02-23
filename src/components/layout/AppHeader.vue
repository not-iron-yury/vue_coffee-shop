<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <header class="header">
    <div class="container header__container">
      <div class="logo">
        <img src="/img/logo.png" alt="" />
      </div>
      <nav class="nav header__nav">
        <RouterLink to="/">Главная</RouterLink>
        <RouterLink to="/about">О нас</RouterLink>
        <RouterLink to="/catalog">Каталог</RouterLink>
        <RouterLink to="/cart">Корзина</RouterLink>
      </nav>
    </div>
  </header>
</template>

<style scoped lang="scss">
.header {
  background-color: var(--color-dark);

  &__container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
  }
}
.nav {
  display: flex;
  gap: 30px;
  margin-top: 50px;

  font-weight: 700;
  font-size: 18px;
  line-height: 160%;
}
.logo {
  max-width: 135px;
}
</style>
