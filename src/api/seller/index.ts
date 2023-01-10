import { unauthorizedClient } from '@/api/apiClient'
import { useQuery } from '@tanstack/react-query'

import type { APIResponse } from '@/types/api/response'
import type { SellerInfo } from '@/types/api/seller'

const profileKey = 'sellerinfo'

const getSellerInfo = async (shopID: string) => {
  const response = await unauthorizedClient.get<APIResponse<SellerInfo>>(
    '/seller/' + shopID
  )
  return response.data
}

export const useGetSellerInfo = (shopID: string) => {
  return useQuery([profileKey, shopID], async () => await getSellerInfo(shopID))
}
