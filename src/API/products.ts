import { url } from '@/API/url'
export const apiProducts = {
  get: async (params: string | null) => {
    const queryParams = params ? params : ''

    const res = await fetch(url + '/items' + queryParams)
    if (!res.ok) {
      throw new Error('При попытке получить список товаров возникла ошибка.')
    }

    return res.json()
  },

  getBest: async () => {
    const res = await fetch(url + '/items?topSelling=true')
    if (!res.ok) {
      throw new Error('При попытке получить список товаров возникла ошибка.')
    }

    return res.json()
  },
}
