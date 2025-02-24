<script setup lang="ts">
import { RouterLink } from 'vue-router'
import AppPopupAuth from '../AppPopupAuth.vue'
import { ref } from 'vue'
import { getScrollbarWidth, addOverflowHidden } from '../../functions'

const showOverlay = ref(false)

const openAuth = () => {
  showOverlay.value = true

  const width = getScrollbarWidth()
  addOverflowHidden(width)
}
</script>

<template>
  <header class="header">
    <div class="container header__container">
      <div class="logo">
        <img src="/img/logo.png" alt="йобни кофе" />
      </div>
      <nav class="nav header__nav">
        <RouterLink to="/">Главная</RouterLink>
        <RouterLink to="/about">О нас</RouterLink>
        <RouterLink to="/catalog">Каталог</RouterLink>
        <button class="nav-btn" @click="openAuth">
          <img src="/auth.svg" aria-label="Авторизоваться" title="Авторизоваться" class="nav-img" />
        </button>
        <RouterLink to="/cart" class="nav-link">
          <img src="/cart.svg" aria-label="Корзина" title="Корзина" class="nav-img" />
        </RouterLink>
      </nav>
    </div>
    <app-popup-auth v-show="showOverlay" @close="showOverlay = false" />
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
.logo {
  max-width: 135px;
}
.nav {
  display: flex;
  gap: 30px;
  margin-top: 50px;

  font-weight: 700;
  font-size: 18px;
  line-height: 160%;
  &-link {
    padding: 5px;
  }
  &-btn {
    display: flex;
    padding: 5px;
  }
  &-img {
    width: 25px;
  }
}
</style>
