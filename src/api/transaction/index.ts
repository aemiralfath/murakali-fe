import type { APIResponse, PaginationData } from '@/types/api/response'
import type { Transaction } from '@/types/api/transaction'
import { useQuery } from '@tanstack/react-query'
import { authorizedClient } from '../apiClient'

const key = 'transaction'

const getTransactions = async () => {
  const response = await authorizedClient.get<
    APIResponse<PaginationData<Transaction>>
  >('/user/transaction')
  return response.data
}

export const useGetTransactions = () => {
  return useQuery([key], async () => await getTransactions())
}
