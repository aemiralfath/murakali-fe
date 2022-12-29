import { authorizedClient } from '@/api/apiClient'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'

import type { APIResponse } from '@/types/api/response'
import type { AddressData, AddressDetail } from '@/types/api/address'

const profileKey = ['address']

const getAllAddress = async () => {
  const response = await authorizedClient.get<APIResponse<AddressData>>(
    '/user/address'
  )
  return response.data
}

export const useGetAllAddress = () => useQuery(profileKey, getAllAddress)

export const useCreateAddress = () => {
  const queryClient = useQueryClient()
  return useMutation(
    async (data: AddressDetail) => {
      return await authorizedClient.put<APIResponse<null>>('/user/address', {
        name: data.name,
        province_id: data.province_id,
        city_id: data.city_id,
        provinve: data.province,
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
        void queryClient.invalidateQueries(profileKey)
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
          provinve: data.province,
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
        void queryClient.invalidateQueries(profileKey)
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
        void queryClient.invalidateQueries(profileKey)
      },
    }
  )
}
