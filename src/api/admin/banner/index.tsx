import { unauthorizedClient } from '@/api/apiClient'
import type { BannerResponse } from '@/types/api/banner'
import type { APIResponse } from '@/types/api/response'
import { useQuery } from '@tanstack/react-query'

const profileKey = 'banner'

const getBanner = async () => {
  const response = await unauthorizedClient.get<APIResponse<BannerResponse[]>>(
    '/admin/banner'
  )
  return response.data
}

export const useBanner = () => {
  return useQuery([profileKey], async () => await getBanner())
}
