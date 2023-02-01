import { unauthorizedClient } from '@/api/apiClient'
import type { APIResponse } from '@/types/api/response'

import { useQueryClient, useMutation } from '@tanstack/react-query'

const profileKey = ['auth']

export const useGetUserVerify = (code: string) => {
  const queryClient = useQueryClient()
  return useMutation(
    async () => {
      return await unauthorizedClient.get<APIResponse<null>>(
        '/auth/verify?code=' + code
      )
    },
    {
      onSuccess: () => {
        void queryClient.invalidateQueries(profileKey)
      },
    }
  )
}

export const useResetPassword = () => {
  const queryClient = useQueryClient()
  return useMutation(
    async (data: string) => {
      return await unauthorizedClient.post<APIResponse<null>>(
        '/auth/reset-password',
        {
          email: data,
        }
      )
    },
    {
      onSuccess: () => {
        void queryClient.invalidateQueries(profileKey)
      },
    }
  )
}

export const useUpdatePassword = () => {
  const queryClient = useQueryClient()
  return useMutation(
    async (data: string) => {
      return await unauthorizedClient.patch<APIResponse<null>>(
        '/auth/reset-password',
        {
          password: data,
        }
      )
    },
    {
      onSuccess: () => {
        void queryClient.invalidateQueries(profileKey)
      },
    }
  )
}
