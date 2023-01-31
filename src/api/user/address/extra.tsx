import { unauthorizedClient } from '@/api/apiClient'
import type {
  City,
  FetchParamInfo,
  Province,
  SubDistrict,
  Urban,
} from '@/types/api/address'
import type { APIResponse } from '@/types/api/response'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const profileKey = ['province']

const getAllProvince = async () => {
  const response = await unauthorizedClient.get<APIResponse<Province>>(
    '/location/province'
  )
  return response.data
}

export const useGetAllProvince = () => {
  return useQuery(profileKey, getAllProvince)
}

export const useGetAllCity = () => {
  const queryClient = useQueryClient()
  return useMutation(
    async (id: string) => {
      return await unauthorizedClient.get<APIResponse<City>>(
        '/location/province/city?province_id=' + id
      )
    },
    {
      onSuccess: () => {
        void queryClient.invalidateQueries(profileKey)
      },
    }
  )
}

export const useGetAllSubDistrict = () => {
  const queryClient = useQueryClient()
  return useMutation(
    async (data: FetchParamInfo) => {
      return await unauthorizedClient.get<APIResponse<SubDistrict>>(
        '/location/province/city/subdistrict?province=' +
          data.province +
          '&city=' +
          data.city
      )
    },
    {
      onSuccess: () => {
        void queryClient.invalidateQueries(profileKey)
      },
    }
  )
}

export const useGetAllUrban = () => {
  const queryClient = useQueryClient()
  return useMutation(
    async (data: FetchParamInfo) => {
      return await unauthorizedClient.get<APIResponse<Urban>>(
        '/location/province/city/subdistrict/urban?province=' +
          data.province +
          '&city=' +
          data.city +
          '&subdistrict=' +
          data.sub_district
      )
    },
    {
      onSuccess: () => {
        void queryClient.invalidateQueries(profileKey)
      },
    }
  )
}
