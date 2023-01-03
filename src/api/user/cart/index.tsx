import { authorizedClient } from '@/api/apiClient'
import type { Cart, UpdateCart } from '@/types/api/cart'
import type { APIResponse } from '@/types/api/response'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const cartKey = ['cart']

const getCart = async () => {
  const response = await authorizedClient.get<APIResponse<Cart>>(
    '/cart/items?limit=100'
  )
  return response.data
}

export const useGetCart = () => {
  return useQuery(cartKey, async () => await getCart())
}

export const useUpdateCart = () => {
  const queryClient = useQueryClient()

  return useMutation(
    async (data: UpdateCart) => {
      return await authorizedClient.put<APIResponse<null>>('/cart/items', {
        product_detail_id: data.id,
        quantity: data.quantity,
      })
    },
    {
      onSuccess: () => {
        void queryClient.invalidateQueries(cartKey)
      },
    }
  )
}

export const useDeleteCart = () => {
  const queryClient = useQueryClient()

  return useMutation(
    async (id: string) => {
      return await authorizedClient.delete<APIResponse<null>>(
        '/cart/items/' + id
      )
    },
    {
      onSuccess: () => {
        void queryClient.invalidateQueries(cartKey)
      },
    }
  )
}
