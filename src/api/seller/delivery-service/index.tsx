import { authorizedClient } from '@/api/apiClient'
import type { CourierList } from '@/types/api/courier'
import type { APIResponse } from '@/types/api/response'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const profileKey = 'delivery-service'

const getDeliveryServiceSeller = async () => {
  const response = await authorizedClient.get<APIResponse<CourierList>>(
    '/seller/courier'
  )
  return response.data
}

export const useDeliveryServiceSeller = () => {
  return useQuery([profileKey], async () => await getDeliveryServiceSeller())
}

export const useCreateDeliverySeller = () => {
  const queryClient = useQueryClient()

  return useMutation(
    async (courier_id: string) => {
      return await authorizedClient.post<APIResponse<null>>('/seller/courier', {
        courier_id: courier_id,
      })
    },
    {
      onSuccess: () => {
        void queryClient.invalidateQueries([profileKey])
      },
    }
  )
}

export const useDeleteDeliverySeller = () => {
  const queryClient = useQueryClient()

  return useMutation(
    async (id: string) => {
      return await authorizedClient.delete<APIResponse<null>>(
        '/seller/courier/' + id
      )
    },
    {
      onSuccess: () => {
        void queryClient.invalidateQueries([profileKey])
      },
    }
  )
}
