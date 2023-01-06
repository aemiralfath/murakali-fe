import { authorizedClient } from '@/api/apiClient'
import type { APIResponse } from '@/types/api/response'
import type { WalletUser } from '@/types/api/wallet'
import { useQuery } from '@tanstack/react-query'

const profileKey = ['wallet']

const getUserWallet = async () => {
  const response = await authorizedClient.get<APIResponse<WalletUser>>(
    '/user/wallet'
  )
  return response.data
}

export const useGetUserWallet = () => useQuery(profileKey, getUserWallet)
