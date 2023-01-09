import { authorizedClient } from '@/api/apiClient'
import type { APIResponse } from '@/types/api/response'
import type { SLPUser } from '@/types/api/slp'
import { useQuery } from '@tanstack/react-query'

const slpKey = ['slp']

const getUserSLP = async () => {
  const response = await authorizedClient.get<APIResponse<SLPUser[]>>(
    '/user/sealab-pay'
  )
  return response.data
}

export const useGetUserSLP = () => useQuery(slpKey, getUserSLP)
