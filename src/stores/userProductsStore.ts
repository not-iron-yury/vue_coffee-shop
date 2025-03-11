import { defineStore } from 'pinia'
import { reactive, computed } from 'vue'
import type { IUserProducts, TlistName, TProductStatusProp, TCart } from '@/inretfaces'
import { useAuthStore } from './authStore'
import { useProductsStore } from '@/stores/productsStore'
import { LIST_FAVORITES, LIST_CART } from '@/constants'
import { apiUserProducts } from '@/API/userProducts'

export const useUserProductsStore = defineStore('userProducts', () => {
  const authStore = useAuthStore()
  const productsStore = useProductsStore()
  const userProducts = reactive<IUserProducts>({
    id: 0,
    user_id: 0,
    favorites: [],
    cart: {},
  })

  const handleError = (error: unknown) => {
    console.log(error)
  }

  /* ------------------------------------------------------------------------------- */

  // ДОБАВЛЕНИЕ товара в корзину
  const addProductToCart = (
    productId: number,
    quantity: number = 1,
    sendToServer: boolean = true,
  ) => {
    if (!userProducts.cart.hasOwnProperty(productId)) {
      userProducts.cart[productId] = quantity // добавляем товар в cart

      const index = productsStore.productIndexMap.get(productId) // получаем индекс из кеша
      if (typeof index === 'number') {
        productsStore.items[index]['count'] = quantity // меняем количество товара
      }

      toggleStatusProduct(productId, true, 'inCart') // меняем статус inCart
      if (sendToServer) {
        setUserProductsData(LIST_CART, userProducts.cart) // отправляем данные на сервер
      }
    }
  }

  // УДАЛЕНИЕ товара из корзины
  const removeProductFromCart = (productId: number) => {
    if (userProducts.cart.hasOwnProperty(productId)) {
      delete userProducts.cart[productId] // удаляем id товара из коллекции cart

      toggleStatusProduct(productId, false, 'inCart') // меняем статус inCart
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

  // ГЕТТЕР количества товара в корзине, для связи карточек товаров с userProducts
  const getProductCountInCart = computed(() => (id: number) => userProducts.cart[id] || 1)
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
    toggleStatusProduct(productId, true, 'inFavorites')
  }

  // УДАЛЕНИЕ товара из избранных (часть логики toggleFavoritesInUserProducts)
  const removeProductFromFavoriteList = (productId: number): void => {
    const index = userProducts.favorites.indexOf(productId)
    userProducts.favorites.splice(index, 1)
    toggleStatusProduct(productId, false, 'inFavorites')
  }
  /* ------------------------------------------------------------------------------- */

  // ИЗМЕНЕНИЕ СТАТУСА товара (свойство inFavorites)
  const toggleStatusProduct = (
    productId: number,
    value: boolean,
    statusProp: TProductStatusProp,
  ): void => {
    const index = productsStore.productIndexMap.get(productId) // получаем индекс из кеша
    if (typeof index === 'number') {
      productsStore.items[index][statusProp] = value // меняем статус товара
    }
  }

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
        addProductToCart(+id, data[id], false)
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

  return {
    userProducts,
    toggleFavoritesInUserProducts,
    createUserProductsData,
    getUserProductsData,
    setUserProductsData,
    addProductToCart,
    removeProductFromCart,
    changeProductQuantityInCart,
    getProductCountInCart,
  }
})
