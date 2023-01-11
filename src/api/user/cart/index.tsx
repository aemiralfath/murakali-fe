import { authorizedClient } from '@/api/apiClient'
import type { Cart, HoverCartData, UpdateCart } from '@/types/api/cart'
import type { APIResponse } from '@/types/api/response'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const cartKey = 'cart'

const getCart = async () => {
  const response = await authorizedClient.get<APIResponse<Cart>>('/cart/items')
  return response.data
}

export const useGetCart = () => {
  return useQuery([cartKey, 1], async () => await getCart())
}

const getHoverCart = async () => {
  const response = await authorizedClient.get<APIResponse<HoverCartData>>(
    '/cart/hover-home?limit=5'
  )
  return response.data
}

export const useGetHoverCart = () => {
  return useQuery([cartKey, 2], async () => await getHoverCart())
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
        void queryClient.invalidateQueries([cartKey])
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
        void queryClient.invalidateQueries([cartKey])
      },
    }
  )
}

export const useAddToCart = () => {
  const queryClient = useQueryClient()

  return useMutation(
    async (data: UpdateCart) => {
      return await authorizedClient.post<APIResponse<null>>('/cart/items', {
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
