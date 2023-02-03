import { unauthorizedClient } from '@/api/apiClient'
import type { BriefProduct, ProductQuery } from '@/types/api/product'
import type { APIResponse, PaginationData } from '@/types/api/response'

import { useQuery } from '@tanstack/react-query'
import qs from 'qs'

const key = ['search']
const INF = 1000000000

const getSearchQueryProduct = async (productQuery: ProductQuery) => {
  const query = qs.stringify({
    ...productQuery,
    max_price:
      productQuery.max_price === undefined ? INF : productQuery.max_price,
    max_rating: 5,
  })
  const response = await unauthorizedClient.get<
    APIResponse<PaginationData<BriefProduct>>
  >('/product/?' + query)
  return response.data
}

export const useSearchQueryProduct = (productQuery: ProductQuery) => {
  return useQuery(
    [key, productQuery],
    async () => await getSearchQueryProduct(productQuery)
  )
}
