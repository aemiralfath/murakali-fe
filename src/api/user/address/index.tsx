import { authorizedClient } from '@/api/apiClient'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'

import type { APIResponse } from '@/types/api/response'
import type { AddressData, AddressDetail } from '@/types/api/address'

const profileKey = 'address'

const getAllAddress = async (page: number) => {
  const response = await authorizedClient.get<APIResponse<AddressData>>(
    '/user/address?limit=3' + '&page=' + String(page)
  )
  return response.data
}

export const useGetAllAddress = (page: number) => {
  return useQuery([profileKey, page], async () => await getAllAddress(page))
}

const getDefaultAddress = async (
  isDefault: boolean,
  isShopDefault: boolean
) => {
  const response = await authorizedClient.get<APIResponse<AddressData>>(
    '/user/address?limit=3' +
      '&is_default=' +
      String(isDefault) +
      '&is_shop_default=' +
      String(isShopDefault)
  )
  return response.data
}

export const useGetDefaultAddress = (
  isDefault: boolean,
  isShopDefault: boolean
) => {
  return useQuery({
    queryKey: [profileKey],
    queryFn: async () => await getDefaultAddress(isDefault, isShopDefault),
    retry: false,
  })
}

export const useCreateAddress = () => {
  const queryClient = useQueryClient()

  return useMutation(
    async (data: AddressDetail) => {
      return await authorizedClient.post<APIResponse<null>>('/user/address', {
        name: data.name,
        province_id: data.province_id,
        city_id: data.city_id,
        province: data.province,
        city: data.city,
        district: data.district,
        sub_district: data.sub_district,
        zip_code: data.zip_code,
        address_detail: data.address_detail,
        is_default: data.is_default,
        is_shop_default: data.is_shop_default,
      })
    },
    {
      onSuccess: () => {
        void queryClient.invalidateQueries([profileKey])
      },
    }
  )
}

export const useEditAddress = (id: string) => {
  const queryClient = useQueryClient()
  return useMutation(
    async (data: AddressDetail) => {
      return await authorizedClient.put<APIResponse<null>>(
        '/user/address/' + id,
        {
          name: data.name,
          province_id: data.province_id,
          city_id: data.city_id,
          province: data.province,
          city: data.city,
          district: data.district,
          sub_district: data.sub_district,
          zip_code: data.zip_code,
          address_detail: data.address_detail,
          is_default: data.is_default,
          is_shop_default: data.is_shop_default,
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

export const useDeleteAddress = () => {
  const queryClient = useQueryClient()

  return useMutation(
    async (id: string) => {
      return await authorizedClient.delete<APIResponse<null>>(
        '/user/address/' + id
      )
    },
    {
      onSuccess: () => {
        void queryClient.invalidateQueries([profileKey])
      },
    }
  )
}
