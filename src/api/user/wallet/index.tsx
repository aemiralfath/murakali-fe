import { authorizedClient } from '@/api/apiClient'
import type { APIResponse } from '@/types/api/response'
import type { WalletUser } from '@/types/api/wallet'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const profileKey = ['wallet']

const getUserWallet = async () => {
  const response = await authorizedClient.get<APIResponse<WalletUser>>(
    '/user/wallet'
  )
  return response.data
}

export const useGetUserWallet = () => useQuery(profileKey, getUserWallet)

export const useVerifyPIN = () => {
  const queryClient = useQueryClient()
  return useMutation(
    async ({ pin, amount }: { pin: string; amount: number }) => {
      return await authorizedClient.post<APIResponse<null>>(
        '/user/wallet/step-up/pin',
        {
          pin: pin,
          amount: amount,
        }
      )
    },
    {
      onSuccess: () => {
        void queryClient.invalidateQueries(profileKey)
      },
      onError: () => {
        void queryClient.invalidateQueries(profileKey)
      },
    }
  )
}
