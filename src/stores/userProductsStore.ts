import { defineStore } from 'pinia'
import { reactive } from 'vue'
import { url } from '@/API'
import type { IUserProducts, TlistName } from '@/inretfaces'
import { useAuthStore } from './authStore'
import { useProductsStore } from '@/stores/productsStore'
import { LIST_FAVORITES } from '@/constants'

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
    toggleFavoriteStatusProduct(productId, true)
  }

  // УДАЛЕНИЕ товара из избранных
  const removeProductFromFavoriteList = (productId: number): void => {
    const index = userProducts.favorites.indexOf(productId)
    userProducts.favorites.splice(index, 1)
    toggleFavoriteStatusProduct(productId, false)
  }

  // ИЗМЕНЕНИЕ СТАТУСА товара (свойство inFavorites)
  const toggleFavoriteStatusProduct = (productId: number, value: boolean): void => {
    const index = productsStore.productIndexMap.get(productId) // получаем индекс из кеша
    if (typeof index === 'number') {
      productsStore.items[index].inFavorites = value // меняем статус товара
    } else {
      console.error(`Товар с ID ${productId} не найден.`)
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

  // ПОЛУЧЕНИЕ ДАННЫХ О ТОВАРАХ пользователя с бэка при авторизации
  const getUserProductsData = async (userId: number): Promise<void> => {
    try {
      const res = await fetch(url + '/userproducts?user_id=' + userId)
      if (!res.ok) {
        throw new Error('Ошибка при попытке получить данные о товарах пользователя.')
      }

      const response = await res.json()
      const data: IUserProducts = response[0]

      synchUserProductLists(data)
    } catch (err) {
      console.error(err)
    }
  }

  // СИНХРОНИЗАЦИЯ локальных данных с бэком при авторизации
  const synchUserProductLists = (data: IUserProducts) => {
    userProducts.id = data.id
    userProducts.user_id = data.user_id

    // если локальный список favorites пустой, то просто меняем его на полученный с бэка
    if (!userProducts.favorites.length) {
      userProducts.favorites = data.favorites
    } else {
      // если пользователь натыкал что-то до авторизации, то объединяем данные бэка с локальными, и обновляем список на бэке
      data.favorites.forEach((id) => {
        if (!userProducts.favorites.includes(id)) {
          addProductToFavoriteList(id)
        }
      })

      setUserProductsData(LIST_FAVORITES, userProducts.favorites) // обновляем список favorites на бэке
    }
  }

  // ОБНОВЛЕНИЕ ДАННЫХ о товарах пользователя на бэке
  const setUserProductsData = async (listName: TlistName, newList: number[]): Promise<void> => {
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

  return {
    userProducts,
    toggleFavoritesInUserProducts,
    createUserProductsData,
    getUserProductsData,
    setUserProductsData,
  }
})
