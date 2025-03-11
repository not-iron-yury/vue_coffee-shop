import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomeView.vue'),
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/AboutView.vue'),
  },
  {
    path: '/cart',
    name: 'Cart',
    component: () => import('../views/CartView.vue'),
  },
  {
    path: '/favorites',
    name: 'Favorites',
    component: () => import('../views/FavoritesView.vue'),
  },
  {
    path: '/catalog',
    name: 'Catalog',
    component: () => import('../views/CatalogView.vue'),
  },
  {
    path: '/product:id',
    name: 'ProductItem',
    component: () => import('../views/ProductItemView.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFoundView.vue'),
  },
  // {
  //   path: '/dashboard',
  //   component: () => import('../views/ProfileView.vue'),
  //   meta: { requiresAuth: true }, // Метаданные маршрута
  // },
  // {
  //   path: '/admin',
  //   component: () => import('../views/AdminView.vue'),
  //   meta: { requiresAuth: true },
  // },
]

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
})

router.beforeEach(async (to) => {
  const authStore = useAuthStore()

  // Если маршрут требует аутентификации
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (authStore.isAuthenticated) {
      // Пользователь аутентифицирован, разрешаем доступ
      return true
    } else {
      // Пользователь не аутентифицирован, перенаправляем на страницу входа
      return { name: 'Login' } // Переход на страницу входа
    }
  }

  // Маршрут не требует аутентификации, разрешаем доступ
  return true
})

export default router
