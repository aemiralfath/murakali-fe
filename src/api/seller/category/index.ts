import { unauthorizedClient } from '@/api/apiClient'
import { useQuery } from '@tanstack/react-query'

import type { APIResponse } from '@/types/api/response'
import type { CategoryData } from '@/types/api/category'

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
