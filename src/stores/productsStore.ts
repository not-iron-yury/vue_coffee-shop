import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { apiProducts } from '@/API/products'
import type { IProduct } from '@/inretfaces'

export const useProductsStore = defineStore('products', () => {
  const items = ref<IProduct[]>([])
  const productIndexMap = new Map<number, number>() // коллекция индексов товаров, для быстрого доступа в массиве items

  const itemsBest = computed(() => {
    return items.value.filter((product) => product.topSelling)
  })

  const getProducts = async (): Promise<void> => {
    try {
      items.value = await apiProducts.get()
      createProducIndexes()
    } catch (err) {
      console.error(err)
    }
  }

  const createProducIndexes = (): void => {
    for (let i = 0; i < items.value.length; i++) {
      productIndexMap.set(items.value[i].id, i)
    }
  }

  return { items, productIndexMap, itemsBest, getProducts }
})
