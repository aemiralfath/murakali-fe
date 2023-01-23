import { authorizedClient, unauthorizedClient } from '@/api/apiClient'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'

import type { APIResponse } from '@/types/api/response'
import type { SellerDetailInfomation, SellerInfo } from '@/types/api/seller'

const profileKey = 'sellerinfo'

const getSellerInfo = async (shopID: string) => {
  const response = await unauthorizedClient.get<APIResponse<SellerInfo>>(
    '/seller/' + shopID
  )
  return response.data
}

export const useGetSellerInfo = (shopID: string) => {
  return useQuery([profileKey, shopID], async () => await getSellerInfo(shopID))
}

const getSellerInfoByUserID = async (userID: string) => {
  const response = await authorizedClient.get<APIResponse<SellerInfo>>(
    '/seller/user/' + userID
  )
  return response.data
}

export const useGetSellerInfoByUserID = (userID?: string) => {
  return useQuery({
    queryKey: [profileKey, userID],
    queryFn: async () => await getSellerInfoByUserID(userID),
    enabled: !!userID,
  })
}

const getSellerDetailInformation = async () => {
  const response = await authorizedClient.get<
    APIResponse<SellerDetailInfomation>
  >('/seller/information')
  return response.data
}

export const useGetSellerDetailInformation = () => {
  return useQuery({
    queryKey: [profileKey],
    queryFn: async () => await getSellerDetailInformation(),
  })
}

export const useEditSellerDetailInformation = () => {
  const queryClient = useQueryClient()

  return useMutation(
    async (shop_name: string) => {
      return await authorizedClient.patch<APIResponse<null>>(
        '/seller/information',
        {
          shop_name: shop_name,
        }
      )
    },
    {
      onSuccess: () => {
        void queryClient.invalidateQueries([profileKey])
      },
    }
  )
}
