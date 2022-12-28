import { authorizedClient } from '@/api/apiClient'
import { useQueryClient, useMutation } from '@tanstack/react-query'

import type { APIResponse } from '@/types/api/response'

const profileKey = ['change-password']

export const useSendEmailChangePassword = () => {
  const queryClient = useQueryClient()
  return useMutation(
    async () => {
      return await authorizedClient.post<APIResponse<null>>(
        '/user/password',
        {}
      )
    },
    {
      onSuccess: () => {
        void queryClient.invalidateQueries(profileKey)
      },
    }
  )
}

export const useVerifyOTPChangePassword = () => {
  const queryClient = useQueryClient()
  return useMutation(
    async (data: string) => {
      return await authorizedClient.post<APIResponse<null>>('/user/verify', {
        otp: data,
      })
    },
    {
      onSuccess: () => {
        void queryClient.invalidateQueries(profileKey)
      },
    }
  )
}

export const useUpdatePasswordAfterLogin = () => {
  const queryClient = useQueryClient()
  return useMutation(
    async (data: string) => {
      return await authorizedClient.patch<APIResponse<null>>('/user/password', {
        password: data,
      })
    },
    {
      onSuccess: () => {
        void queryClient.invalidateQueries(profileKey)
      },
    }
  )
}
