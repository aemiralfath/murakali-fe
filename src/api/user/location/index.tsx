import { authorizedClient } from '@/api/apiClient'
import type {
  LocationCostRequest,
  LocationCostResponse,
} from '@/types/api/location'
import type { APIResponse } from '@/types/api/response'

import { useQueryClient, useMutation } from '@tanstack/react-query'

const locationKey = 'address'

export const useLocationCost = () => {
  const queryClient = useQueryClient()

  return useMutation(
    async (data: LocationCostRequest) => {
      return await authorizedClient.post<APIResponse<LocationCostResponse>>(
        '/location/cost',
        data
      )
    },
    {
      onSuccess: () => {
        void queryClient.invalidateQueries([locationKey])
      },
    }
  )
}
