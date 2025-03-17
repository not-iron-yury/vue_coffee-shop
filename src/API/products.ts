import { url } from '@/API/url'
import type { TSortingType } from '@/inretfaces'

const getSortParams = (type: TSortingType) => {
  const [prop, value] = type.split('-')
  const direction = value === 'maxtomin' ? '-' : ''
  return `?sortBy=${direction}${prop}`
}

export const apiProducts = {
  get: async (type: TSortingType | null) => {
    const queryParams = type ? getSortParams(type) : ''

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
