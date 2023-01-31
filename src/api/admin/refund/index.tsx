import { authorizedClient } from '@/api/apiClient'
import type { RefundOrderData } from '@/types/api/refund'
import type { APIResponse, PaginationData } from '@/types/api/response'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const refundKey = 'refund-admin'

const getAdminRefunds = async (page: number, sort: string) => {
  const response = await authorizedClient.get<
    APIResponse<PaginationData<RefundOrderData>>
  >('/admin/refund?page=' + page + '&sort=' + sort)

  return response.data
}

export const useAdminRefund = (page: number, sort: string) => {
  return useQuery(
    [refundKey, page, sort],
    async () => await getAdminRefunds(page, sort)
  )
}

export const useConfirmRefundAdmin = () => {
  const queryClient = useQueryClient()

  return useMutation(
    async (id: string) => {
      return await authorizedClient.post<APIResponse<null>>(
        '/admin/refund/' + id
      )
    },
    {
      onSuccess: () => {
        void queryClient.invalidateQueries([refundKey])
      },
    }
  )
}
