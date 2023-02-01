import type { BuyerOrder } from '@/types/api/order'
import type { APIResponse, PaginationData } from '@/types/api/response'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import qs from 'qs'

import { authorizedClient } from '../apiClient'

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

export const useReceiveOrder = () => {
  const queryClient = useQueryClient()

  return useMutation(
    async (data: { order_id: string }) => {
      return await authorizedClient.patch<APIResponse<null>>(
        '/user/order-status',
        {
          ...data,
          order_status_id: 6,
        }
      )
    },
    {
      onSuccess: () => {
        void queryClient.invalidateQueries([key])
      },
    }
  )
}

export const useCompleteOrder = () => {
  const queryClient = useQueryClient()

  return useMutation(
    async (data: { order_id: string }) => {
      return await authorizedClient.patch<APIResponse<null>>(
        '/user/order-status',
        {
          ...data,
          order_status_id: 7,
        }
      )
    },
    {
      onSuccess: () => {
        void queryClient.invalidateQueries([key])
      },
    }
  )
}
