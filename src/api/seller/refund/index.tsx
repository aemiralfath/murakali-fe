import { authorizedClient } from '@/api/apiClient'
import type {
  ConversationRefundThread,
  CreateRefundThreadRequest,
} from '@/types/api/refund'
import type { APIResponse } from '@/types/api/response'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const refundKey = 'refund'

const getRefundThreadSeller = async (orderID: string) => {
  const response = await authorizedClient.get<
    APIResponse<ConversationRefundThread>
  >('/seller/refund/' + orderID)
  return response.data
}

export const useGetRefundThreadSeller = (orderID: string) => {
  return useQuery({
    queryKey: [refundKey, 'orderID: ' + orderID],
    queryFn: async () => await getRefundThreadSeller(orderID),
    enabled: Boolean(orderID),
    refetchOnWindowFocus: true,
  })
}

export const useCreateRefundThreadSeller = () => {
  const queryClient = useQueryClient()
  return useMutation(
    async (data: CreateRefundThreadRequest) => {
      return await authorizedClient.post<APIResponse<null>>(
        '/seller/refund-thread',
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

export const useRefundAccept = () => {
  const queryClient = useQueryClient()

  return useMutation(
    async (refund_id: string) => {
      return await authorizedClient.patch<APIResponse<null>>(
        '/seller/refund-accept',
        {
          refund_id,
        }
      )
    },
    {
      onSuccess: () => {
        void queryClient.invalidateQueries([refundKey])
      },
    }
  )
}

export const useRefundReject = () => {
  const queryClient = useQueryClient()

  return useMutation(
    async (refund_id: string) => {
      return await authorizedClient.patch<APIResponse<null>>(
        '/seller/refund-reject',
        {
          refund_id,
        }
      )
    },
    {
      onSuccess: () => {
        void queryClient.invalidateQueries([refundKey])
      },
    }
  )
}
