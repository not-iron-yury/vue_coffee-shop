import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { url } from '../API'
import type { IProduct } from '../inretfaces'

export const useProductsStore = defineStore('products', () => {
  const items = ref<IProduct[]>([])

  const itemsBest = computed(() => {
    return items.value.filter((product) => product.topSelling)
  })

  const getProducts = async (): Promise<void> => {
    const res = await fetch(url + '/items')
    if (!res.ok) {
      throw new Error('При попытке получить список товаров возникла ошибка.')
    }
    items.value = await res.json()
  }

  return { items, itemsBest, getProducts }
})
