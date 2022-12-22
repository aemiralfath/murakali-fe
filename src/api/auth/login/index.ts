import { unauthorizedClient } from '@/api/apiClient'
import { useMutation } from '@tanstack/react-query'
import moment from 'moment'

import type { AccessTokenData } from '@/types/api/auth'
import type { APIResponse } from '@/types/api/response'
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
        const now = new Date()

        if (data.data.data) {
          setCookie('access_token', data.data.data.access_token, {
            expires: moment(now).add(5, 'm').toDate(),
          })
        }
      },
    }
  )
}
