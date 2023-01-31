import { authorizedClient } from '@/api/apiClient'
import type { APIResponse } from '@/types/api/response'

import { useQueryClient, useMutation } from '@tanstack/react-query'
import { deleteCookie } from 'cookies-next'

export const useLogout = () => {
  const queryClient = useQueryClient()

  return useMutation(
    async () => {
      return await authorizedClient.get<APIResponse<null>>('auth/logout')
    },
    {
      onSuccess: () => {
        void queryClient.removeQueries(['profile'])
        deleteCookie('access_token')
        deleteCookie('refresh_token')
        if (typeof window !== 'undefined') {
          window.location.reload()
        }
      },
    }
  )
}
