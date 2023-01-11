import { authorizedClient } from '@/api/apiClient'
import { useQueryClient, useMutation } from '@tanstack/react-query'

import type { APIResponse } from '@/types/api/response'

import type { PostCheckout } from '@/types/api/checkout'
import type { Transaction } from '@/types/api/transaction'
import type { SLPPayment } from '@/types/api/slp'

const transactionKey = 'transaction'

export const useCreateTransaction = () => {
  const queryClient = useQueryClient()

  return useMutation(
    async (data: PostCheckout) => {
      const response = await authorizedClient.post<APIResponse<Transaction>>(
        '/user/transaction',
        data
      )
      return response.data
    },
    {
      onSuccess: () => {
        void queryClient.invalidateQueries([transactionKey])
      },
    }
  )
}

export const useSLPPayment = () => {
  const queryClient = useQueryClient()

  return useMutation(
    async (id: string) => {
      const response = await authorizedClient.post<APIResponse<SLPPayment>>(
        '/user/transaction/slp-payment',
        {
          transaction_id: id,
        }
      )
      return response.data
    },
    {
      onSuccess: () => {
        void queryClient.invalidateQueries([transactionKey])
      },
    }
  )
}
