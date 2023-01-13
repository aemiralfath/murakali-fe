import { unauthorizedClient } from '@/api/apiClient'
import { useQuery } from '@tanstack/react-query'

import type { APIResponse } from '@/types/api/response'
import type { Product, ProductDetail, ProductImages } from '@/types/api/product'
import type { TotalRating } from '@/types/api/review'

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

export const useGetProductById = (id: string) => {
  return useQuery([profileKey, id], async () => await getProductById(id))
}

const getProductById = async (id: string) => {
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
