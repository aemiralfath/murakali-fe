import { authorizedClient } from '@/api/apiClient'
import type { OrderData } from '@/types/api/order'
import type { APIResponse, PaginationData } from '@/types/api/response'
import type {
  CancelOrderStatus,
  SellerOrderStatus,
  UpdateNoResiSellerOrder,
} from '@/types/api/seller'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import moment from 'moment'

const profileKey = 'order'

const getSellerOrders = async (
  orderStatusID: string,
  voucherShop: string,
  page: number,
  sortBy: string,
  sort: string
) => {
  const response = await authorizedClient.get<
    APIResponse<PaginationData<OrderData>>
  >(
    '/seller/order?order_status=' +
      orderStatusID +
      '&voucher_shop=' +
      voucherShop +
      '&page=' +
      page +
      '&sort_by=' +
      sortBy +
      '&sort=' +
      sort
  )
  return response.data
}

export const useSellerOrders = (
  orderStatusID: string,
  voucherShop: string,
  page: number,
  sortBy: string,
  sort: string
) => {
  return useQuery(
    [profileKey, orderStatusID, voucherShop, page, sortBy, sort],
    async () =>
      await getSellerOrders(orderStatusID, voucherShop, page, sortBy, sort)
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

export const useWithdrawOrderBalance = () => {
  const queryClient = useQueryClient()

  return useMutation(
    async (orderID: string) => {
      return await authorizedClient.post<APIResponse<null>>(
        '/seller/withdrawal/' + orderID
      )
    },
    {
      onSuccess: () => {
        void queryClient.invalidateQueries([profileKey])
      },
    }
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

export const useCancelOrderStatus = () => {
  const queryClient = useQueryClient()

  return useMutation(
    async (data: CancelOrderStatus) => {
      return await authorizedClient.patch<APIResponse<null>>(
        '/seller/order-cancel',
        {
          order_id: data.order_id,
          cancel_notes: data.cancel_notes,
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
