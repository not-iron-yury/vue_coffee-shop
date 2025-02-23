import type { IProduct } from '../inretfaces'

export const getProducts = async (): Promise<IProduct[]> => {
  const res = await fetch('https://72457144f952c2f0.mokky.dev/items')
  if (!res.ok) throw new Error('При попытке получить список товаров возникла ошибка.')

  return await res.json()
}
