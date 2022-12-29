import { unauthorizedClient } from '@/api/apiClient'
import { useQuery } from '@tanstack/react-query'

import type { APIResponse, PaginationData } from '@/types/api/response'
import type { ProductDetail } from '@/types/api/product'

const profileKey = ['recommended']

const getRecommendedProduct = async () => {
  const response = await unauthorizedClient.get<
    APIResponse<PaginationData<ProductDetail>>
  >('/product/recommended')
  return response.data
}

export const useRecommendedProduct = () => {
  return useQuery(profileKey, async () => await getRecommendedProduct())
}
