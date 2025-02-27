import { defineStore } from 'pinia'
import { ref } from 'vue'
import { url } from '../API'
import type { IUserProducts } from '../inretfaces'
//import { useAuthStore } from './authStore'

export const useUserProductsStore = defineStore('userProducts', () => {
  //const authStore = useAuthStore()
  const userProducts = ref<IUserProducts | null>(null)

  // создаем на бэке объект для хранения данных о корзине и избранном
  const createUserProductsData = async (userId: number): Promise<void> => {
    try {
      const res = await fetch(url + '/userproducts', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          favorites: [],
          cart: [],
        }),
      })

      if (!res.ok)
        throw new Error('Ошибка при попытке создать данные о товарах нового пользователя.')
    } catch (error) {
      console.error(error)
    }
  }

  // получаем данные о товарах пользователя после авторизации
  const getUserProductsData = async (userId: number): Promise<void> => {
    try {
      const res = await fetch(url + '/userproducts?user_id=' + userId)
      if (!res.ok) {
        throw new Error('Ошибка при попытке получить данные о товарах пользователя.')
      }

      const response = await res.json()
      userProducts.value = response[0]

      console.log(response[0])
    } catch (err) {
      console.error(err)
    }
  }

  return { userProducts, createUserProductsData, getUserProductsData }
})

/*
1. при регистрации создавать объект в коллекции favorites на бэке
    {
        "id": 1,
        "user_id": 1,
        "list": []
    },

2. при авторизации запрошивать эти данные с бэке, + проверять в localStorage и синхронизировать
3. добавление или удаление через PATCH (мы знаем id самого объекта, см. пункты 1 и 2)

// PATCH https://d774fe2b8f07493b.mokky.dev/favorites/1

{
  "list": [1, 4, 2]
}

4. если в локальном сторе есть данные, то :
  1) их нужно добавить в list
  2) ререндер карточек
  3) отправить данные на бэк

5. в объект описывающий товар добавить свойство userFavorite: boolean
  и менять его значение при обновлении данных в list

6. удаление id из  list


const index = state.array.indexOf(valueToRemove); // Поиск индекса элемента

// Проверка существования элемента
if (index !== -1) {
  state.array.splice(index, 1);   // Удаление элемента по найденному индексу
}


*/
