import { defineStore } from 'pinia'
import { ref } from 'vue'
import { apiProducts } from '@/API/products'
import type { IProduct } from '@/inretfaces'

export const useProductsStore = defineStore('products', () => {
  const items = ref<IProduct[]>([])
  const itemsBest = ref<IProduct[]>([])

  const loadProducts = async (): Promise<void> => {
    if (!items.value.length) {
      try {
        items.value = await apiProducts.get()
      } catch (error) {
        console.error(error)
      }
    }
  }
  const loadBestProducts = async (): Promise<void> => {
    if (!items.value.length) {
      try {
        itemsBest.value = await apiProducts.get()
      } catch (error) {
        console.error(error)
      }
    }
  }

  return { items, itemsBest, loadProducts, loadBestProducts }
})
