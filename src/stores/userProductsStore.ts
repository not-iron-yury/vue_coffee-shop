import { defineStore } from 'pinia'
import { ref, reactive, computed, watch } from 'vue'
import type { IProduct, IUserProducts, TlistName, TCart } from '@/inretfaces'
import { useAuthStore } from './authStore'
import { LIST_FAVORITES, LIST_CART } from '@/constants'
import { apiUserProducts } from '@/API/userProducts'

export const useUserProductsStore = defineStore('userProducts', () => {
  const authStore = useAuthStore()

  const userProducts = reactive<IUserProducts>({
    id: 0,
    user_id: 0,
    favorites: [],
    cart: {},
  })
  const favoritesList = ref<IProduct[] | null>(null)
  const cartList = ref<IProduct[] | null>(null)

  watch(userProducts.favorites, async () => {
    try {
      const queryTail = userProducts.favorites.map((item) => `id[]=${item}`).join('&')
      favoritesList.value = await apiUserProducts.getProducts(queryTail)
    } catch (error) {
      handleError(error)
    }
  })

  watch(userProducts.cart, async () => {
    try {
      const queryTail = Object.keys(userProducts.cart)
        .map((item) => `id[]=${item}`)
        .join('&')
      cartList.value = await apiUserProducts.getProducts(queryTail)
    } catch (error) {
      handleError(error)
    }
  })

  /* ------------------------------------------------------------------------------- */

  // создаем на бэке объект для хранения данных товарах пользователя (после успешной регистрации !!)
  const createUserProductsData = async (userId: number): Promise<void> => {
    try {
      await apiUserProducts.createData(userId, userProducts.favorites, userProducts.cart)
    } catch (error) {
      handleError(error)
    }
  }

  /* ------------------------------------------------------------------------------- */

  // ПОЛУЧЕНИЕ ДАННЫХ О ТОВАРАХ пользователя с бэка при авторизации
  const getUserProductsData = async (userId: number): Promise<void> => {
    try {
      const response: IUserProducts = await apiUserProducts.getData(userId)
      synchUserProductLists(response) //  синхронизируем локальные и полученные данные
    } catch (error) {
      handleError(error)
    }
  }

  /* ------------------------------------------------------------------------------- */

  // СИНХРОНИЗАЦИЯ локальных данных о товарах пользователя, с бэком при авторизации
  const synchUserProductLists = (data: IUserProducts) => {
    userProducts.id = data.id
    userProducts.user_id = data.user_id
    synchUserFavorites(data.favorites)
    synchUserCart(data.cart)
  }

  /* ------------------------------------------------------------------------------- */

  // СИНХРОНИЗАЦИЯ favorites
  const synchUserFavorites = (data: number[]) => {
    const isLocalDataFavorites = userProducts.favorites.length !== 0 ? true : false // наличие локальных данных favorites до авторизации

    // объединяем локальные и внешние данные
    if (data.length !== 0) {
      data.forEach((id) => {
        if (!userProducts.favorites.includes(id)) {
          addProductToFavoriteList(id)
        }
      })
    }
    // обновляем список cart на бэке, если были натыканы товары до авторизации
    if (isLocalDataFavorites) {
      setUserProductsData(LIST_FAVORITES, userProducts.favorites)
    }
  }

  /* ------------------------------------------------------------------------------- */

  // СИНХРОНИЗАЦИЯ cart
  const synchUserCart = (data: TCart) => {
    const isLocalDataCart = Object.keys(userProducts.cart).length !== 0 ? true : false // наличие локальных данных cart до авторизации

    // объединяем локальные и внешние данные
    const cartKeys: string[] = Object.keys(data)
    if (cartKeys.length !== 0) {
      cartKeys.forEach((id: string) => {
        addProductToCart(+id, data[id], false) // добавляем товар без синхронизации
      })
    }
    // обновляем список cart на бэке, если были натыканы товары до авторизации
    if (isLocalDataCart) {
      setUserProductsData(LIST_CART, userProducts.cart)
    }
  }

  /* ------------------------------------------------------------------------------- */

  // ОБНОВЛЕНИЕ ДАННЫХ о товарах пользователя на бэке
  const setUserProductsData = async (listName: TlistName, newList: number[] | TCart) => {
    try {
      if (authStore.user) {
        await apiUserProducts.setData(authStore.user, listName, newList)
      }
    } catch (error) {
      handleError(error)
    }
  }

  /* ------------------------------------------------------------------------------- */

  // ГЕТТЕР КОЛИЧЕСТВА товара в корзине, для связи карточек товаров с userProducts
  const getProductCountInCart = computed(() => (id: number) => userProducts.cart[id] || 1)

  // ГЕТТЕР СТАТУСА товара inFavorite
  const getStatusProductInFavoIrites = computed(
    () => (id: number) => userProducts.favorites.includes(id),
  )

  // ГЕТТЕР СТАТУСА товара inCart
  const getStatusProductInCart = computed(
    () => (id: number) => Object.keys(userProducts.cart).includes(String(id)),
  )

  /* ------------------------------------------------------------------------------- */

  // ДОБАВЛЕНИЕ товара в корзину
  const addProductToCart = (
    productId: number,
    quantity: number = 1,
    sendToServer: boolean = true,
  ) => {
    if (!userProducts.cart.hasOwnProperty(productId)) {
      userProducts.cart[productId] = quantity // добавляем товар в cart

      if (sendToServer) {
        setUserProductsData(LIST_CART, userProducts.cart) // отправляем данные на сервер
      }
    }
  }

  /* ------------------------------------------------------------------------------- */

  // УДАЛЕНИЕ товара из корзины
  const removeProductFromCart = (productId: number) => {
    if (userProducts.cart.hasOwnProperty(productId)) {
      delete userProducts.cart[productId] // удаляем id товара из коллекции cart

      setUserProductsData(LIST_CART, userProducts.cart) // отправляем данные на сервер
    }
  }

  //ИЗМЕНЕНИЕ КОЛИЧЕСТВА товарной позиции
  const changeProductQuantityInCart = (productId: number, quantity: number) => {
    if (userProducts.cart.hasOwnProperty(productId)) {
      userProducts.cart[productId] = quantity
    }
    setUserProductsData(LIST_CART, userProducts.cart) // отправляем данные на сервер
  }

  /* ------------------------------------------------------------------------------- */

  // ТОГЛЕР избранных товаров
  const toggleFavoritesInUserProducts = (productId: number): void => {
    if (userProducts.favorites.includes(productId)) {
      removeProductFromFavoriteList(productId) // удаляем, если товар уже есть в списке
    } else {
      addProductToFavoriteList(productId) // добавляем, если товара нет в списке
    }
    setUserProductsData(LIST_FAVORITES, userProducts.favorites)
  }

  // ДОБАВЛЕНИЕ товара в избранные (часть логики toggleFavoritesInUserProducts)
  const addProductToFavoriteList = (productId: number): void => {
    userProducts.favorites.push(productId)
  }

  // УДАЛЕНИЕ товара из избранных (часть логики toggleFavoritesInUserProducts)
  const removeProductFromFavoriteList = (productId: number): void => {
    const index = userProducts.favorites.indexOf(productId)
    userProducts.favorites.splice(index, 1)
  }

  /* ------------------------------------------------------------------------------- */

  // Обработчик ошибок
  const handleError = (error: unknown) => {
    console.log(error)
  }

  /* ------------------------------------------------------------------------------- */

  return {
    userProducts,
    favoritesList,
    cartList,
    toggleFavoritesInUserProducts,
    createUserProductsData,
    getUserProductsData,
    setUserProductsData,
    addProductToCart,
    removeProductFromCart,
    changeProductQuantityInCart,
    getProductCountInCart,
    getStatusProductInFavoIrites,
    getStatusProductInCart,
  }
})
