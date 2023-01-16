import { authorizedClient } from '@/api/apiClient'
import type { APIResponse, PaginationData } from '@/types/api/response'
import type { Transaction } from '@/types/api/transaction'
import type { TopUpWallet, WalletHistory, WalletUser } from '@/types/api/wallet'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const profileKey = 'wallet'

const getUserWallet = async () => {
  const response = await authorizedClient.get<APIResponse<WalletUser>>(
    '/user/wallet'
  )
  return response.data
}

export const useGetUserWallet = () =>
  useQuery([profileKey, 'wallet'], getUserWallet)

const getUserWalletHistory = async (page: number, sort: string) => {
  const response = await authorizedClient.get<
    APIResponse<PaginationData<WalletHistory>>
  >('/user/wallet/history?limit=10&page=' + page + '&sort=' + sort)
  return response.data
}

export const useGetUserWalletHistory = (page: number, sort: string) =>
  useQuery(
    [profileKey, page, sort],
    async () => await getUserWalletHistory(page, sort)
  )

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
        void queryClient.invalidateQueries([profileKey])
      },
      onError: () => {
        void queryClient.invalidateQueries([profileKey])
      },
    }
  )
}

export const useTopUpWallet = () => {
  const queryClient = useQueryClient()
  return useMutation(
    async (data: TopUpWallet) => {
      return await authorizedClient.patch<APIResponse<Transaction>>(
        '/user/wallet',
        data
      )
    },
    {
      onSuccess: () => {
        void queryClient.invalidateQueries([profileKey])
      },
      onError: () => {
        void queryClient.invalidateQueries([profileKey])
      },
    }
  )
}

export const usePasswordVerification = () => {
  const queryClient = useQueryClient()
  return useMutation(
    async (password: string) => {
      return await authorizedClient.post<APIResponse<null>>('/user/password', {
        password: password,
      })
    },
    {
      onSuccess: () => {
        void queryClient.invalidateQueries([profileKey])
      },
      onError: () => {
        void queryClient.invalidateQueries([profileKey])
      },
    }
  )
}

export const useInputNewPinWallet = () => {
  const queryClient = useQueryClient()
  return useMutation(
    async ({ userId, pin }: { userId: string; pin: string }) => {
      return await authorizedClient.patch<APIResponse<null>>(
        '/user/wallet/step-up/pin',
        {
          user_id: userId,
          pin: pin,
        }
      )
    },
    {
      onSuccess: () => {
        void queryClient.invalidateQueries([profileKey])
      },
      onError: () => {
        void queryClient.invalidateQueries([profileKey])
      },
    }
  )
}
