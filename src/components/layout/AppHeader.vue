<script setup lang="ts">
import { RouterLink } from 'vue-router'
import AppPopUp from '../AppPopUp.vue'
import AppFormAuth from '../AppFormAuth.vue'
import { computed, onMounted, ref } from 'vue'
import { getScrollbarWidth, addOverflowHidden } from '@/functions'
import { useAuthStore } from '@/stores/authStore'
import { useUserProductsStore } from '@/stores/userProductsStore'
import AppBadge from '@/components/UI/AppBadge.vue'

const authStore = useAuthStore()
const productsStore = useUserProductsStore()

const showOverlay = ref(false)

const openAuth = () => {
  showOverlay.value = true
  const width = getScrollbarWidth()
  addOverflowHidden(width)
}

const authImg = computed(() => (authStore.isAuthenticated ? '/logout.svg' : '/auth.svg'))

const authhandler = (): void => {
  if (authStore.isAuthenticated) {
    authStore.logout()
  } else {
    openAuth()
  }
}

onMounted(() => {
  if (!authStore.isAuthenticated) {
    const token = localStorage.getItem('token')
    console.log(token)
    if (typeof token === 'string' && typeof token !== undefined) {
      authStore.loginWithToken(token)
    }
  }
})
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
        <button class="nav-btn" @click="authhandler">
          <img :src="authImg" aria-label="Авторизоваться" title="Авторизоваться" class="nav-img" />
        </button>
        <RouterLink to="/favorites" class="nav-link">
          <app-badge :count="productsStore.userProducts.favorites.length">
            <img
              src="/favorites.svg"
              aria-label="Избранные товары"
              title="Избранные товары"
              class="nav-img"
            />
          </app-badge>
        </RouterLink>
        <RouterLink to="/cart" class="nav-link">
          <app-badge :count="Object.keys(productsStore.userProducts.cart).length">
            <img src="/cart.svg" aria-label="Корзина" title="Корзина" class="nav-img" />
          </app-badge>
        </RouterLink>
      </nav>
    </div>
    <app-pop-up v-show="showOverlay" @close="showOverlay = false">
      <app-form-auth @close="showOverlay = false" />
    </app-pop-up>
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
