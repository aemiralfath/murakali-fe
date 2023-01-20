import { authorizedClient } from '@/api/apiClient'
import type { APIResponse } from '@/types/api/response'
import type { SLPUser } from '@/types/api/slp'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import moment from 'moment'

const slpKey = 'slp'

const getUserSLP = async () => {
  const response = await authorizedClient.get<APIResponse<SLPUser[]>>(
    '/user/sealab-pay'
  )
  return response.data
}

export const useGetUserSLP = () => useQuery([slpKey], getUserSLP)

export const useRegisterSealabsPay = () => {
  const queryClient = useQueryClient()

  return useMutation(
    async (data: SLPUser) => {
      return await authorizedClient.post<APIResponse<null>>(
        '/user/sealab-pay',
        {
          card_number: data.card_number,
          name: data.name,
          is_default: data.is_default,
          active_date: moment(data.active_date).format('DD-MM-YYYY HH:mm:ss'),
        }
      )
    },
    {
      onSuccess: () => {
        void queryClient.invalidateQueries([slpKey])
      },
    }
  )
}

export const useDeleteSealabsPay = () => {
  const queryClient = useQueryClient()

  return useMutation(
    async (card_number: string) => {
      return await authorizedClient.delete<APIResponse<null>>(
        `/user/sealab-pay/${card_number}`
      )
    },
    {
      onSuccess: () => {
        void queryClient.invalidateQueries([slpKey])
      },
    }
  )
}

export const useSetDefaultSealabsPay = () => {
  const queryClient = useQueryClient()

  return useMutation(
    async (card_number: string) => {
      return await authorizedClient.patch<APIResponse<null>>(
        `/user/sealab-pay/${card_number}`
      )
    },
    {
      onSuccess: () => {
        void queryClient.invalidateQueries([slpKey])
      },
    }
  )
}
