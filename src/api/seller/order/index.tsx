import { authorizedClient } from '@/api/apiClient'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import type { APIResponse, PaginationData } from '@/types/api/response'
import type { OrderData } from '@/types/api/order'
import type {
  SellerOrderStatus,
  UpdateNoResiSellerOrder,
} from '@/types/api/seller'
import moment from 'moment'

const profileKey = 'order'

const getSellerOrders = async (orderStatusID: string) => {
  const response = await authorizedClient.get<
    APIResponse<PaginationData<OrderData>>
  >('/seller/order?order_status=' + orderStatusID)
  return response.data
}

export const useSellerOrders = (orderStatusID: string) => {
  return useQuery(
    [profileKey, orderStatusID],
    async () => await getSellerOrders(orderStatusID)
  )
}

const getSellerOrderDetail = async (orderID: string) => {
  const response = await authorizedClient.get<APIResponse<OrderData>>(
    '/seller/order/' + orderID
  )
  return response.data
}

export const useSellerOrderDetail = (orderID: string) => {
  return useQuery(
    [profileKey, orderID],
    async () => await getSellerOrderDetail(orderID)
  )
}

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient()

  return useMutation(
    async (data: SellerOrderStatus) => {
      return await authorizedClient.patch<APIResponse<null>>(
        '/seller/order-status',
        {
          order_id: data.order_id,
          order_status_id: data.order_status_id.toString(),
        }
      )
    },
    {
      onSuccess: () => {
        void queryClient.invalidateQueries([profileKey])
      },
    }
  )
}

export const useUpdateResiSellerOrder = () => {
  const queryClient = useQueryClient()

  return useMutation(
    async (data: UpdateNoResiSellerOrder) => {
      return await authorizedClient.patch<APIResponse<null>>(
        '/seller/order-resi/' + data.order_id,
        {
          resi_no: data.resi_no,
          estimate_arrive_at:
            moment(data.courier_etd).format('DD-MM-YYYY').toString() +
            ' ' +
            moment(Date.now()).format('HH:mm:ss').toString(),
        }
      )
    },
    {
      onSuccess: () => {
        void queryClient.invalidateQueries([profileKey])
      },
    }
  )
}
