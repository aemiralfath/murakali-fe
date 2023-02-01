import { unauthorizedClient } from '@/api/apiClient'
import type { CategoryData } from '@/types/api/category'
import type { APIResponse } from '@/types/api/response'

import { useQuery } from '@tanstack/react-query'

const profileKey = 'sellercategory'

const getSellerCategory = async (shopID: string) => {
  const response = await unauthorizedClient.get<APIResponse<CategoryData[]>>(
    '/seller/' + shopID + '/category'
  )
  return response.data
}

export const useGetSellerCategory = (shopID: string) => {
  return useQuery(
    [profileKey, shopID],
    async () => await getSellerCategory(shopID)
  )
}
