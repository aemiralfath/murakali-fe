import { unauthorizedClient } from '@/api/apiClient'
import type { AccessTokenData } from '@/types/api/auth'
import type { APIResponse } from '@/types/api/response'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { setCookie } from 'cookies-next'

const profileKey = ['google-auth']

export const useGoogleAuth = () => {
  const queryClient = useQueryClient()
  return useMutation(
    async ({ code, state }: { code: string; state: string }) => {
      return await unauthorizedClient.get<APIResponse<AccessTokenData | null>>(
        '/auth/google-oauth?code=' + code + '&state=' + state
      )
    },
    {
      onSuccess: (data) => {
        if (data.data.data) {
          setCookie('access_token', data.data.data.access_token, {
            expires: new Date(data.data.data.expired_at),
          })
        }

        void queryClient.invalidateQueries(profileKey)
      },
    }
  )
}
