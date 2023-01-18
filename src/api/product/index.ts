import { unauthorizedClient } from '@/api/apiClient'
import { useQuery } from '@tanstack/react-query'
import qs from 'qs'

import type { Product, ProductImages } from '@/types/api/product'
import type { TotalRating } from '@/types/api/review'
import type { APIResponse, PaginationData } from '@/types/api/response'
import type { BriefProduct } from '@/types/api/product'

const profileKey = 'seller'
const productKey = 'product'
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
    listed_status: 1,
  }

  tempParams = { ...tempParams, ...params }
  return useQuery({
    queryKey: [
      productKey,
      ...Object.keys(tempParams).map((key) => tempParams[key]),
    ],
    queryFn: async () => await getAllProduct(params),
    enabled: enabled,
  })
}

export const useGetProductById = (id?: string) => {
  return useQuery({
    queryKey: [productKey, id],
    queryFn: async () => await getProductById(id),
    enabled: Boolean(id),
  })
}

const getProductById = async (id?: string) => {
  const response = await unauthorizedClient.get<APIResponse<Product>>(
    '/product/' + id
  )
  return response.data
}

export const useGetTotalReview = (id: string) => {
  return useQuery(['review', id], async () => await getTotalReview(id))
}

const getTotalReview = async (id: string) => {
  const response = await unauthorizedClient.get<APIResponse<TotalRating>>(
    `/product/${id}/review/rating`
  )
  return response.data
}

export const useGetProductImagesByProductID = (id: string) => {
  return useQuery(
    ['productImage', id],
    async () => await getProductImagesByProductID(id)
  )
}

const getProductImagesByProductID = async (id: string) => {
  const response = await unauthorizedClient.get<APIResponse<ProductImages[]>>(
    `/product/${id}/picture`
  )
  return response.data
}
