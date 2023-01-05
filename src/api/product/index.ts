import { unauthorizedClient } from '@/api/apiClient'
import { useQuery } from '@tanstack/react-query'

import type { APIResponse } from '@/types/api/response'
import type { ProductDetail } from '@/types/api/product'

const profileKey = 'seller'

const getSellerProduct = async (
  page: number,
  limit: number,
  search: string,
  category: string,
  shop_id: string,
  sort_by: string,
  sort: string,
  min_price: number,
  max_price: number,
  min_rating: number,
  max_rating: number
) => {
  const response = await unauthorizedClient.get<APIResponse<ProductDetail[]>>(
    '/product/?limit=' +
      String(limit) +
      '&page=' +
      String(page) +
      '&search=' +
      search +
      '&category=' +
      category +
      '&shop_id=' +
      shop_id +
      '&sort_by=' +
      sort_by +
      '&sort=' +
      sort +
      '&min_price=' +
      String(min_price) +
      '&max_price=' +
      String(max_price) +
      '&min_rating=' +
      String(min_rating) +
      '&max_rating=' +
      String(max_rating)
  )
  return response.data
}

export const useGetSellerProduct = (
  page: number,
  limit: number,
  search: string,
  category: string,
  shop_id: string,
  sort_by: string,
  sort: string,
  min_price: number,
  max_price: number,
  min_rating: number,
  max_rating: number
) => {
  return useQuery(
    [
      profileKey,
      page,
      limit,
      search,
      category,
      shop_id,
      sort_by,
      sort,
      min_price,
      max_price,
      min_rating,
      max_rating,
    ],
    async () =>
      await getSellerProduct(
        page,
        limit,
        search,
        category,
        shop_id,
        sort_by,
        sort,
        min_price,
        max_price,
        min_rating,
        max_rating
      )
  )
}
