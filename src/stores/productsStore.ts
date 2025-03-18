import { defineStore } from 'pinia'
import { ref, watch, computed, reactive } from 'vue'
import { apiProducts } from '@/API/products'
import type { IProduct, TSortingType } from '@/inretfaces'

export const useProductsStore = defineStore('products', () => {
  const items = ref<IProduct[]>([])
  const itemsBest = ref<IProduct[]>([])

  const queryParams = reactive({
    filtering: [] as string[],
    sorting: null as TSortingType | null,
    pagination: null,
  })

  const getQueryParams = computed(() => {
    const params = []

    if (queryParams.filtering.length > 0) {
      params.push(createFilterParams(queryParams.filtering))
    }

    if (queryParams.sorting) {
      params.push(createSortParams(queryParams.sorting))
    }

    // if (queryParams.pagination) {
    //   params.push(createPaginationParams(queryParams.pagination))
    // }

    return params.length > 0 ? `?${params.join('&')}` : ''
  })

  const createFilterParams = (params: string[]) => {
    return params.length > 0 ? params.join('&') : ''
  }

  const createSortParams = (type: TSortingType) => {
    if (!type) return ''
    const [prop, value] = type.split('-')
    const direction = value === 'maxtomin' ? '-' : '' //  минус (-) для DESC сортировки, его отсуствие для ACS
    return `sortBy=${direction}${prop}`
  }

  // function createPaginationParams(page, limit) {
  //   return `page=${page}&limit=${limit}`
  // }

  const addOrRemoveFilteringType = (item: string) => {
    if (queryParams.filtering.includes(item)) {
      const index: number = queryParams.filtering.indexOf(item)
      queryParams.filtering.splice(index, 1)
    } else {
      queryParams.filtering.push(item)
    }
  }

  // вызываем loadProducts с новыми queryParams, если queryParams изменились
  watch(getQueryParams, () => {
    if (getQueryParams.value) {
      console.log(getQueryParams.value)
      loadProducts(getQueryParams.value)
    }
  })
  /* ------------------------------------------------------------------------------- */

  const loadProducts = async (params: string | null): Promise<void> => {
    try {
      items.value = await apiProducts.get(params)
    } catch (error) {
      console.error(error)
    }
  }

  /* ------------------------------------------------------------------------------- */

  const loadBestProducts = async (): Promise<void> => {
    if (!itemsBest.value.length) {
      try {
        itemsBest.value = await apiProducts.getBest()
      } catch (error) {
        console.error(error)
      }
    }
  }

  /* ------------------------------------------------------------------------------- */
  return {
    items,
    itemsBest,
    queryParams,
    getQueryParams,
    loadProducts,
    loadBestProducts,
    addOrRemoveFilteringType,
  }
})
