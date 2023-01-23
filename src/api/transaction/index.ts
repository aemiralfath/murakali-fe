import type { APIResponse, PaginationData } from '@/types/api/response'
import type { Transaction } from '@/types/api/transaction'
import { useQuery } from '@tanstack/react-query'
import { authorizedClient } from '../apiClient'
import qs from 'qs'

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
