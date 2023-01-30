import { authorizedClient, unauthorizedClient } from '@/api/apiClient'
import type { BannerData, UpdateBannerData } from '@/types/api/banner'
import type { APIResponse } from '@/types/api/response'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const profileKey = 'banner-admin'

const getAdminBanner = async () => {
  const response = await unauthorizedClient.get<APIResponse<BannerData[]>>(
    '/admin/banner'
  )
  return response.data
}

export const useAdminBanner = () => {
  return useQuery([profileKey], async () => await getAdminBanner())
}

export const useDeleteAdminBanner = () => {
  const queryClient = useQueryClient()

  return useMutation(
    async (id: string) => {
      return await authorizedClient.delete<APIResponse<null>>(
        '/admin/banner/' + id
      )
    },
    {
      onSuccess: () => {
        void queryClient.invalidateQueries([profileKey])
      },
    }
  )
}

export const useCreateAdminBanner = () => {
  const queryClient = useQueryClient()
  return useMutation(
    async (data: BannerData) => {
      return await authorizedClient.post<APIResponse<null>>(
        '/admin/banner',
        data
      )
    },
    {
      onSuccess: () => {
        void queryClient.invalidateQueries([profileKey])
      },
    }
  )
}

export const useUpdateAdminBanner = () => {
  const queryClient = useQueryClient()
  return useMutation(
    async (data: UpdateBannerData) => {
      return await authorizedClient.put<APIResponse<null>>(
        '/admin/banner',
        data
      )
    },
    {
      onSuccess: () => {
        void queryClient.invalidateQueries([profileKey])
      },
    }
  )
}
