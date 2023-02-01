import { unauthorizedClient } from '@/api/apiClient'
import type { BriefProduct, ProductQuery } from '@/types/api/product'
import type { APIResponse, PaginationData } from '@/types/api/response'

import { useQuery } from '@tanstack/react-query'

const profileKey = ['search']

const getSearchQueryProduct = async (productQuery: ProductQuery) => {
  const response = await unauthorizedClient.get<
    APIResponse<PaginationData<BriefProduct>>
  >(
    '/product/?search=' +
      productQuery.search +
      '&category=' +
      productQuery.category +
      '&limit=' +
      productQuery.limit +
      '&page=' +
      productQuery.page +
      '&sort_by=' +
      productQuery.sort_by +
      '&sort=' +
      productQuery.sort +
      '&min_price=' +
      productQuery.min_price +
      '&max_price=' +
      productQuery.max_price +
      '&min_rating=' +
      productQuery.min_rating +
      '&max_rating=' +
      productQuery.max_rating +
      '&shop_id=' +
      productQuery.shop_id +
      '&province_ids=' +
      productQuery.province_ids
  )
  return response.data
}

export const useSearchQueryProduct = (productQuery: ProductQuery) => {
  return useQuery(
    [profileKey, productQuery],
    async () => await getSearchQueryProduct(productQuery)
  )
}
