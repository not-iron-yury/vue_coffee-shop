import { defineStore } from 'pinia'
import { reactive } from 'vue'
import { url } from '@/API'
import type { IUserProducts, TlistName } from '@/inretfaces'
import { useAuthStore } from './authStore'
import { useProductsStore } from '@/stores/productsStore'
import { LIST_CART, LIST_FAVORITES } from '@/constants'

export const useUserProductsStore = defineStore('userProducts', () => {
  const authStore = useAuthStore()
  const productsStore = useProductsStore()
  const userProducts = reactive<IUserProducts>({
    id: 0,
    user_id: 0,
    favorites: [],
    cart: [],
  })

  const toggleFavoriteStatusProduct = (productId: number, value: boolean): void => {
    const index = productsStore.productIndexMap.get(productId) // получаем индекс из кеша
    if (typeof index === 'number') {
      productsStore.items[index].inFavorites = value // меняем статус товара
    } else {
      console.error(`Товар с ID ${productId} не найден.`)
    }
  }

  const toggleProductInUserProducts = (listName: TlistName, productId: number): void => {
    if (userProducts![listName].includes(productId)) {
      const index = userProducts![listName].indexOf(productId)
      userProducts![listName].splice(index, 1) // удаляем, если товар уже есть в списке
      toggleFavoriteStatusProduct(productId, false)
    } else {
      userProducts![listName].push(productId) // добавляем, если товара нет в списке
      toggleFavoriteStatusProduct(productId, true)
    }

    setUserProductsData(listName, userProducts![listName])
  }

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

  // получаем данные о товарах пользователя с бэка  / сразу же! после авторизации!!
  const getUserProductsData = async (userId: number): Promise<void> => {
    try {
      const res = await fetch(url + '/userproducts?user_id=' + userId)
      if (!res.ok) {
        throw new Error('Ошибка при попытке получить данные о товарах пользователя.')
      }

      const response = await res.json()
      const data: IUserProducts = response[0]
      // --------------------------------------------- //
      // синхронизация локальных данных с бэком
      userProducts.id = data.id
      userProducts.user_id = data.user_id

      if (userProducts.favorites.length) {
        // если пользователь натыкал что-то до авторизации, то объединяем данные бэка с локальными, и отправляем обновленный список на бэк
        userProducts.favorites = [...new Set(userProducts.favorites.concat(data.favorites))]
        setUserProductsData(LIST_FAVORITES, userProducts.favorites)
      } else {
        // если локальный список пустой, то просто подменяем его
        userProducts.favorites = data.favorites
      }

      // переделать!!!!!!!!!!!!!!!!!!!1
      if (userProducts.cart.length) {
        userProducts.cart.push(...data.cart)
        setUserProductsData(LIST_CART, userProducts.cart)
      } else {
        userProducts.cart = data.cart
      }
      // --------------------------------------------- //
    } catch (err) {
      console.error(err)
    }
  }

  // обновляем данные о товарах пользователя на бэке
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
    toggleProductInUserProducts,
    createUserProductsData,
    getUserProductsData,
    setUserProductsData,
  }
})
