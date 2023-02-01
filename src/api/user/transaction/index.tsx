import { authorizedClient } from '@/api/apiClient'
import type { PostCheckout } from '@/types/api/checkout'
import type { APIResponse } from '@/types/api/response'
import type { SLPPayment } from '@/types/api/slp'
import type { TransactionID } from '@/types/api/transaction'

import { useQueryClient, useMutation } from '@tanstack/react-query'

const transactionKey = 'transaction'

export const useCreateTransaction = () => {
  const queryClient = useQueryClient()

  return useMutation(
    async (data: PostCheckout) => {
      const response = await authorizedClient.post<APIResponse<TransactionID>>(
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

export const useWalletPayment = () => {
  const queryClient = useQueryClient()

  return useMutation(
    async (id: string) => {
      const response = await authorizedClient.post<APIResponse<SLPPayment>>(
        '/user/transaction/wallet-payment',
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
