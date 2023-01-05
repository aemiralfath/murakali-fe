import { authorizedClient } from '@/api/apiClient'
import { useQuery } from '@tanstack/react-query'

import type { APIResponse, PaginationData } from '@/types/api/response'
import type { OrderData } from '@/types/api/order'

const profileKey = ['order']

const getSellerOrders = async (orderStatusID: string) => {
  const response = await authorizedClient.get<
    APIResponse<PaginationData<OrderData>>
  >('/seller/order?order_status=' + orderStatusID)
  return response.data
}

export const useSellerOrders = (orderStatusID: string) => {
  return useQuery(profileKey, async () => await getSellerOrders(orderStatusID))
}
