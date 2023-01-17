import { unauthorizedClient } from '@/api/apiClient'
import { useQuery } from '@tanstack/react-query'
import qs from 'qs'

import type { APIResponse, PaginationData } from '@/types/api/response'
import type { BriefProduct } from '@/types/api/product'

const profileKey = 'seller'
export type ProductPaginationParams = {
  page?: number
  limit?: number
  search?: string
  category?: string
  shop_id?: string
  sort_by?: string
  sort?: string
  min_price?: number
  max_price?: number
  min_rating?: number
  max_rating?: number
  listed_status?: 0 | 1 | 2
}

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
  const response = await unauthorizedClient.get<
    APIResponse<PaginationData<BriefProduct>>
  >(
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

const getAllProduct = async (params: ProductPaginationParams) => {
  const query = qs.stringify(params)
  const response = await unauthorizedClient.get<
    APIResponse<PaginationData<BriefProduct>>
  >('/product/?' + query)
  return response.data
}

export const useGetAllProduct = (
  params: ProductPaginationParams,
  enabled?: boolean
) => {
  let tempParams: ProductPaginationParams = {
    page: 1,
    limit: 1,
    search: '',
    category: '',
    shop_id: '',
    sort_by: '',
    sort: '',
    min_price: 0,
    max_price: 1000000,
    min_rating: 0,
    max_rating: 5,
    listed_status: 0,
  }

  tempParams = { ...tempParams, ...params }
  return useQuery({
    queryKey: [
      'products',
      ...Object.keys(tempParams).map((key) => tempParams[key]),
    ],
    queryFn: async () => await getAllProduct(params),
    enabled: enabled === undefined ? true : enabled,
  })
}
