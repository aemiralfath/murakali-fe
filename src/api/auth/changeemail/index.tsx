import { authorizedClient } from '@/api/apiClient'
import { useQueryClient, useMutation } from '@tanstack/react-query'

import type { APIResponse } from '@/types/api/response'

const profileKey = ['change-email']

export const useSendVerrificationEmail = () => {
  const queryClient = useQueryClient()
  return useMutation(
    async (data: string) => {
      return await authorizedClient.post<APIResponse<null>>('/user/email', {
        email: data,
      })
    },
    {
      onSuccess: () => {
        void queryClient.invalidateQueries(profileKey)
      },
    }
  )
}

export const useGetUserVerifyChangeEmail = (code: string, email: string) => {
  const queryClient = useQueryClient()
  return useMutation(
    async () => {
      return await authorizedClient.get<APIResponse<null>>(
        '/user/email?code=' + code + '&email=' + email
      )
    },
    {
      onSuccess: () => {
        void queryClient.invalidateQueries(profileKey)
      },
    }
  )
}
