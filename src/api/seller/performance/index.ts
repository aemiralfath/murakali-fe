import { authorizedClient } from '@/api/apiClient'
import type { APIResponse } from '@/types/api/response'
import type { PerformanceData } from '@/types/api/sellerperformance'
import { useQuery } from '@tanstack/react-query'

const getSellerPerformance = async (update: boolean) => {
  const response = await authorizedClient.get<APIResponse<PerformanceData>>(
    '/seller/performance' + (update ? '?update=true' : '')
  )
  return response.data
}

export const useGetSellerPerformance = (update: boolean) => {
  return useQuery({
    queryKey: ['seller-performance'],
    queryFn: async () => await getSellerPerformance(update),
  })
}
