import { unauthorizedClient } from '@/api/apiClient'
import type { AccessTokenData } from '@/types/api/auth'
import type { APIResponse } from '@/types/api/response'

import { useMutation } from '@tanstack/react-query'
import { setCookie } from 'cookies-next'

export const useLogin = () => {
  return useMutation(
    async ({ email, password }: { email: string; password: string }) => {
      return await unauthorizedClient.post<APIResponse<AccessTokenData>>(
        '/auth/login',
        {
          email,
          password,
        }
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
