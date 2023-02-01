import { unauthorizedClient } from '@/api/apiClient'
import type { Product, ProductImages } from '@/types/api/product'
import type { BriefProduct } from '@/types/api/product'
import type { APIResponse, PaginationData } from '@/types/api/response'
import type { ProductReview, TotalRating } from '@/types/api/review'

import { useQuery } from '@tanstack/react-query'
import qs from 'qs'

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
export type SellerProductParams = {
  page?: number
  limit?: number
  search?: string
  category?: string
  sort_by?: string
  sort?: string
  min_price?: number
  max_price?: number
  min_rating?: number
  max_rating?: number
  shop_id?: string
}

const getSellerProduct = async (p: SellerProductParams) => {
  const query = qs.stringify(p)
  const response = await unauthorizedClient.get<
    APIResponse<PaginationData<BriefProduct>>
  >('/product/?' + query)
  return response.data
}

export const useGetSellerProduct = (
  params: SellerProductParams,
  enabled?: boolean
) => {
  return useQuery({
    queryKey: [profileKey, params],
    queryFn: async () => await getSellerProduct(params),
    enabled: enabled,
  })
}

export const useGetProductReview = (
  id: string,
  rating: number,
  show_comment: boolean,
  show_image: boolean,
  sort: string,
  limit: number,
  page: number
) => {
  return useQuery(
    ['review', id, rating, show_comment, show_image, sort, limit, page],
    async () =>
      await getProductReview(
        id,
        rating,
        show_comment,
        show_image,
        sort,
        limit,
        page
      )
  )
}

const getProductReview = async (
  id: string,
  rating: number,
  show_comment: boolean,
  show_image: boolean,
  sort: string,
  limit: number,
  page: number
) => {
  const response = await unauthorizedClient.get<
    APIResponse<PaginationData<ProductReview>>
  >(
    `/product/${id}/review?rating=` +
      rating +
      '&show_comment=' +
      show_comment +
      '&show_image=' +
      show_image +
      '&sort=' +
      sort +
      '&limit=' +
      limit +
      '&page=' +
      page
  )
  return response.data
}

const getAllProduct = async (params?: ProductPaginationParams) => {
  const query = qs.stringify(params)
  const response = await unauthorizedClient.get<
    APIResponse<PaginationData<BriefProduct>>
  >('/product/?' + query)
  return response.data
}

export const useGetAllProduct = (
  params?: ProductPaginationParams,
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
    enabled: enabled && params !== undefined,
  })
}

export const useGetProductById = (id?: string) => {
  return useQuery({
    queryKey: [productKey, id],
    queryFn: async () => await getProductById(id),
    enabled: Boolean(id),
  })
}

export const getProductById = async (id?: string) => {
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

export const useGetProductImagesByProductID = (id?: string) => {
  return useQuery({
    queryKey: ['productImage', id],
    queryFn: async () => await getProductImagesByProductID(id),
    enabled: Boolean(id),
  })
}

const getProductImagesByProductID = async (id?: string) => {
  const response = await unauthorizedClient.get<APIResponse<ProductImages[]>>(
    `/product/${id}/picture`
  )
  return response.data
}
