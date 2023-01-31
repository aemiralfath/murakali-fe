import type { APIResponse, PaginationData } from '@/types/api/response'
import type { Transaction } from '@/types/api/transaction'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import qs from 'qs'

import { authorizedClient } from '../apiClient'

const key = 'transaction'

const getTransactions = async () => {
  const query = qs.stringify({
    status: 1,
  })
  const response = await authorizedClient.get<
    APIResponse<PaginationData<Transaction>>
  >('/user/transaction?' + query)
  return response.data
}

export const useGetTransactions = () => {
  return useQuery([key], async () => await getTransactions())
}

export const useChangeTransactionPaymentMethod = () => {
  const queryClient = useQueryClient()

  return useMutation(
    async (data: { transaction_id: string; card_number: string }) => {
      return await authorizedClient.put<APIResponse<null>>(
        '/user/transaction',
        data
      )
    },
    {
      onSuccess: () => {
        void queryClient.invalidateQueries([key])
      },
    }
  )
}
