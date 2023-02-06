import type { APIResponse, PaginationData } from '@/types/api/response'
import type { Transaction } from '@/types/api/transaction'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import qs from 'qs'

import { authorizedClient } from '../apiClient'

const key = 'transaction'

const getTransactions = async (sort: string, page: number) => {
  const query = qs.stringify({
    status: 1,
    sort: sort,
    page: page,
  })
  const response = await authorizedClient.get<
    APIResponse<PaginationData<Transaction>>
  >('/user/transaction?' + query)
  return response.data
}

export const useGetTransactions = (sort: string, page: number) => {
  return useQuery(
    [key, sort, page],
    async () => await getTransactions(sort, page)
  )
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
