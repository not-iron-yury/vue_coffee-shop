import type { IProduct } from '../inretfaces'

const url = 'https://72457144f952c2f0.mokky.dev/items'

export const getProducts = async (): Promise<IProduct[]> => {
  const res = await fetch(url)
  if (!res.ok) throw new Error('При попытке получить список товаров возникла ошибка.')

  return await res.json()
}

export const getBestProducts = async (): Promise<IProduct[]> => {
  const res = await fetch(url + '?topSelling=true')
  if (!res.ok) throw new Error('При попытке получить список товаров возникла ошибка.')

  return await res.json()
}
