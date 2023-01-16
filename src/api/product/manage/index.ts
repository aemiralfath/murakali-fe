import { authorizedClient } from '@/api/apiClient'
import { useQueryClient, useMutation } from '@tanstack/react-query'

import type { CreateProductReq } from '@/types/api/product'
import type { APIResponse } from '@/types/api/response'

const productKey = 'product'

export const useCreateProduct = () => {
  const queryClient = useQueryClient()

  return useMutation(
    async (data: CreateProductReq) => {
      return await authorizedClient.post<APIResponse<null>>('/product/', {
        ...data,
      })
    },
    {
      onSuccess: () => {
        void queryClient.invalidateQueries([productKey])
      },
    }
  )
}
