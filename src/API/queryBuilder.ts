import type { TSortingType } from '@/inretfaces'

type TQueryParams = {
  filters: string
  sortBy: string
}

class QueryBuilder {
  constructor(public params: TQueryParams) {}

  addFilters(filters: string[]) {
    if (filters.length > 0) {
      this.params.filters = filters.join('&')
    }
    return this
  }

  addSorting(sorting: TSortingType) {
    if (sorting) {
      const [prop, value] = sorting.split('-')
      const direction = value === 'maxtomin' ? '-' : ''
      this.params.sortBy = `${direction}${prop}`
    }
    return this
  }

  // addPagination(pagination) {
  //   if (pagination) {
  //     this.params.page = pagination
  //   }
  //   return this
  // }

  build() {
    return [this.params.filters, this.params.sortBy].join('&')
  }
}

const queryBuilder = new QueryBuilder()

// const queryParams = computed(() => {
//   return queryBuilder
//     .addFilters(state.filteringParams)
//     .addSorting(state.sortingParam)
//     .addPagination(state.paginationParam)
//     .build();
// });
