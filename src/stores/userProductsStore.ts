import { defineStore } from 'pinia'
import { reactive } from 'vue'
import { url } from '@/API'
import type { IUserProducts, TlistName, TProductStatusProp, TCart } from '@/inretfaces'
import { useAuthStore } from './authStore'
import { useProductsStore } from '@/stores/productsStore'
import { LIST_FAVORITES, LIST_CART } from '@/constants'

export const useUserProductsStore = defineStore('userProducts', () => {
  const authStore = useAuthStore()
  const productsStore = useProductsStore()
  const userProducts = reactive<IUserProducts>({
    id: 0,
    user_id: 0,
    favorites: [],
    cart: {},
  })

  /* ------------------------------------------------------------------------------- */

  // ДОБАВЛЕНИЕ товара в корзину
  const addProductToCart = (productId: number, quantity: number = 1) => {
    if (!userProducts.cart.hasOwnProperty(productId)) {
      userProducts.cart[productId] = quantity // добавляем товар в cart

      // --------------------- //

      const index = productsStore.productIndexMap.get(productId) // получаем индекс из кеша
      if (typeof index === 'number') {
        productsStore.items[index]['count'] = quantity // меняем статус товара
      }

      // --------------------- //

      toggleStatusProduct(productId, true, 'inCart') // меняем статус inCart
      setUserProductsData(LIST_CART, userProducts.cart) // отправляем данные на сервер
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

  // ДОБАВЛЕНИЕ товара в избранные
  const addProductToFavoriteList = (productId: number): void => {
    userProducts.favorites.push(productId) // добавляем, если товара нет в списке
    toggleStatusProduct(productId, true, 'inFavorites')
  }

  // УДАЛЕНИЕ товара из избранных
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
      const res = await fetch(url + '/userproducts', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        // все что пользователь натыкал до регистрации, будет сохранено на бэке после успешной регистрации
        body: JSON.stringify({
          user_id: userId,
          favorites: userProducts.favorites,
          cart: userProducts.cart,
        }),
      })

      if (!res.ok)
        throw new Error('Ошибка при попытке создать данные о товарах нового пользователя.')
    } catch (error) {
      console.error(error)
    }
  }

  /* ------------------------------------------------------------------------------- */

  // ПОЛУЧЕНИЕ ДАННЫХ О ТОВАРАХ пользователя с бэка при авторизации
  const getUserProductsData = async (userId: number): Promise<void> => {
    try {
      const res = await fetch(url + '/userproducts?user_id=' + userId)
      if (!res.ok) {
        throw new Error('Ошибка при попытке получить данные о товарах пользователя.')
      }

      const response = await res.json()
      const data: IUserProducts = response[0]

      synchUserProductLists(data) //  синхронизируем локальные и полученные данные
    } catch (err) {
      console.error(err)
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

  // СИНХРОНИЗАЦИЯ favorites
  const synchUserFavorites = (favorites: number[]) => {
    // наличие локальных данных favorites до авторизации
    const isLocalData = favorites.length !== 0 ? true : false

    // объединяем локальные и внешние данные
    if (favorites.length !== 0) {
      favorites.forEach((id) => {
        if (!userProducts.favorites.includes(id)) {
          addProductToFavoriteList(id)
        }
      })
    }
    // обновляем список cart на бэке, если были натыканы товары до авторизации
    if (isLocalData) {
      setUserProductsData(LIST_FAVORITES, userProducts.favorites)
    }
  }

  // СИНХРОНИЗАЦИЯ cart
  const synchUserCart = (cart: TCart) => {
    // наличие локальных данных cart до авторизации
    const isLocalData = Object.keys(userProducts.cart).length === 0 ? true : false

    // объединяем локальные и внешние данные
    const dataCartKeys: string[] = Object.keys(cart)
    if (dataCartKeys.length !== 0) {
      dataCartKeys.forEach((id: string) => {
        addProductToCart(+id, cart[id])
      })
    }
    // обновляем список cart на бэке, если были натыканы товары до авторизации
    if (!isLocalData) {
      setUserProductsData(LIST_CART, userProducts.cart)
    }
  }

  /* ------------------------------------------------------------------------------- */

  // ОБНОВЛЕНИЕ ДАННЫХ о товарах пользователя на бэке
  const setUserProductsData = async (listName: TlistName, newList: number[] | TCart) => {
    try {
      if (authStore.user) {
        const res = await fetch(`${url}/userproducts/${authStore.user.id}`, {
          method: 'PATCH',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            [listName]: newList,
          }),
        })

        if (!res.ok) throw new Error('В процессе регистрации возникла ошибка.')
      }
    } catch (error) {
      console.error(error)
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
  }
})
