import { url } from '@/API/url'
import type { IUser, IUserProducts, TCart, TlistName } from '@/inretfaces'

export const apiUserProducts = {
  createData: async (userId: number, favorites: number[], cart: TCart) => {
    const res = await fetch(url + '/userproducts', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId,
        favorites,
        cart,
      }),
    })

    if (!res.ok) {
      throw new Error('Ошибка при попытке создать данные о товарах нового пользователя.')
    }
  },

  getData: async (userId: number) => {
    const res = await fetch(url + '/userproducts?user_id=' + userId)
    if (!res.ok) {
      throw new Error('Ошибка при попытке получить данные о товарах пользователя.')
    }

    const response: IUserProducts[] = await res.json()
    return response[0]
  },

  setData: async (user: IUser, listName: TlistName, data: number[] | TCart) => {
    const res = await fetch(`${url}/userproducts/${user.id}`, {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        [listName]: data,
      }),
    })

    if (!res.ok) throw new Error('В процессе регистрации возникла ошибка.')
  },
}
