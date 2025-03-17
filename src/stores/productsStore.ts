import { defineStore } from 'pinia'
import { ref } from 'vue'
import { apiProducts } from '@/API/products'
import type { IProduct, TSortingType } from '@/inretfaces'

export const useProductsStore = defineStore('products', () => {
  const items = ref<IProduct[]>([])
  const itemsBest = ref<IProduct[]>([])

  const itemsSortingType = {
    _value: null as TSortingType | null,
    get value() {
      return this._value
    },
    set value(newValue) {
      this._value = newValue
      loadProducts()
    },
  }

  const loadProducts = async (): Promise<void> => {
    try {
      items.value = await apiProducts.get(itemsSortingType.value)
    } catch (error) {
      console.error(error)
    }
  }

  const loadBestProducts = async (): Promise<void> => {
    if (!itemsBest.value.length) {
      try {
        itemsBest.value = await apiProducts.getBest()
      } catch (error) {
        console.error(error)
      }
    }
  }

  return { items, itemsBest, loadProducts, loadBestProducts, itemsSortingType }
})
