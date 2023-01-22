import type { BuyerOrder } from '@/types/api/order'
import type { APIResponse, PaginationData } from '@/types/api/response'
import { useQuery } from '@tanstack/react-query'
import { authorizedClient } from '../apiClient'
import qs from 'qs'

type GetOrderParams = {
  order_status?: number
}
const key = 'order'

const getOrders = async (params: GetOrderParams) => {
  const query = qs.stringify(params)
  const response = await authorizedClient.get<
    APIResponse<PaginationData<BuyerOrder>>
  >('/user/order?' + query)
  return response.data
}

export const useGetOrders = (params: GetOrderParams) => {
  return useQuery([key, params], async () => await getOrders(params))
}

const getOrderByID = async (id: string) => {
  const response = await authorizedClient.get<APIResponse<BuyerOrder>>(
    '/user/order/' + id
  )
  return response.data
}

export const useGetOrderByID = (id: string) => {
  return useQuery({
    queryKey: [key, id],
    queryFn: async () => await getOrderByID(id),
    enabled: Boolean(id),
  })
}
