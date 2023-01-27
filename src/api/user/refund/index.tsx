import { authorizedClient } from '@/api/apiClient'
import type { CreateRefundUserRequest } from '@/types/api/refund'
import type { APIResponse } from '@/types/api/response'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const refundKey = 'refund'

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
