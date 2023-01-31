import { authorizedClient } from '@/api/apiClient'
import type {
  ConversationRefundThread,
  CreateRefundThreadRequest,
  CreateRefundUserRequest,
} from '@/types/api/refund'
import type { APIResponse } from '@/types/api/response'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const refundKey = 'refund'

const getRefundThread = async (orderID: string) => {
  const response = await authorizedClient.get<
    APIResponse<ConversationRefundThread>
  >('/user/refund/' + orderID)
  return response.data
}

export const useGetRefundThread = (orderID: string) => {
  return useQuery({
    queryKey: [refundKey, 'orderID: ' + orderID],
    queryFn: async () => await getRefundThread(orderID),
    enabled: Boolean(orderID),
    refetchOnWindowFocus: true,
  })
}

export const useCreateRefund = () => {
  const queryClient = useQueryClient()
  return useMutation(
    async (data: CreateRefundUserRequest) => {
      return await authorizedClient.post<APIResponse<null>>(
        '/user/refund',
        data
      )
    },
    {
      onSuccess: () => {
        void queryClient.invalidateQueries([refundKey])
      },
    }
  )
}

export const useCreateRefundThreadUser = () => {
  const queryClient = useQueryClient()
  return useMutation(
    async (data: CreateRefundThreadRequest) => {
      return await authorizedClient.post<APIResponse<null>>(
        '/user/refund-thread',
        data
      )
    },
    {
      onSuccess: () => {
        void queryClient.invalidateQueries([refundKey])
      },
    }
  )
}
