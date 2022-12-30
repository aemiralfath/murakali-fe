import { authorizedClient } from '@/api/apiClient'
import { useQueryClient, useMutation } from '@tanstack/react-query'

import type { APIResponse } from '@/types/api/response'

import type { PostCheckout } from '@/types/api/checkout'

const transactionKey = 'transaction'

export const useCreateTransaction = () => {
  const queryClient = useQueryClient()

  return useMutation(
    async (data: PostCheckout) => {
      return await authorizedClient.post<APIResponse<null>>(
        '/user/transaction',
        data
      )
    },
    {
      onSuccess: () => {
        void queryClient.invalidateQueries([transactionKey])
      },
    }
  )
}
