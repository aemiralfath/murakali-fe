import { authorizedClient } from '@/api/apiClient'
import { useQuery } from '@tanstack/react-query'

import type { APIResponse, PaginationData } from '@/types/api/response'
import type { OrderData } from '@/types/api/order'

const profileKey = 'delivery-service'

const getDeliveryServiceSeller = async () => {
  const response = await authorizedClient.get<
    APIResponse<PaginationData<OrderData>>
  >('/seller/delivery-service')
  return response.data
}

export const useDeliveryServiceSeller = () => {
  return useQuery([profileKey], async () => await getDeliveryServiceSeller())
}
