import { authorizedClient } from '@/api/apiClient'
import { useMutation } from '@tanstack/react-query'
import type { AccessTokenData } from '@/types/api/auth'
import type { APIResponse } from '@/types/api/response'

export const useRegistrationMerchant = () => {
  return useMutation(async ({ shopName }: { shopName: string }) => {
    const data = {
      shop_name: shopName,
    }
    return await authorizedClient.post<APIResponse<AccessTokenData>>(
      '/user/register-merchant',
      data
    )
  })
}