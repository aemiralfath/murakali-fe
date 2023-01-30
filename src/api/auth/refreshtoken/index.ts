import { unauthorizedClient } from '@/api/apiClient'
import { useMutation } from '@tanstack/react-query'

import type { AccessTokenData } from '@/types/api/auth'
import type { APIResponse } from '@/types/api/response'
import { setCookie } from 'cookies-next'

export const useRefreshToken = () => {
  return useMutation(
    async () => {
      return await unauthorizedClient.get<APIResponse<AccessTokenData>>(
        '/auth/refresh'
      )
    },
    {
      onSuccess: (data) => {
        if (data.data.data) {
          setCookie('access_token', data.data.data.access_token, {
            expires: new Date(data.data.data.expired_at),
          })
        }
      },
    }
  )
}
