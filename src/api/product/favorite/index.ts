import { authorizedClient } from '@/api/apiClient'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import type { APIResponse, PaginationData } from '@/types/api/response'
import type { BriefProduct, ProductQuery } from '@/types/api/product'

const profileKey = ['favorite']

const getFavoriteQueryProduct = async (productQuery: ProductQuery) => {
  const response = await authorizedClient.get<
    APIResponse<PaginationData<BriefProduct>>
  >(
    '/product/favorite?category=' +
      productQuery.category +
      '&limit=' +
      productQuery.limit +
      '&page=' +
      productQuery.page +
      '&sort_by=' +
      productQuery.sort_by +
      '&sort=' +
      productQuery.sort
  )
  return response.data
}

export const useFavoriteQueryProduct = (productQuery: ProductQuery) => {
  return useQuery(
    [profileKey, productQuery],
    async () => await getFavoriteQueryProduct(productQuery)
  )
}

export const useDeleteFavProduct = () => {
  const queryClient = useQueryClient()

  return useMutation(
    async (id: string) => {
      return await authorizedClient.delete<APIResponse<null>>(
        '/product/favorite',
        {
          data: { product_id: id },
        }
      )
    },
    {
      onSuccess: () => {
        void queryClient.invalidateQueries([profileKey])
      },
    }
  )
}

export const useAddFavProduct = () => {
  const queryClient = useQueryClient()

  return useMutation(
    async (id: string) => {
      return await authorizedClient.post<APIResponse<null>>(
        '/product/favorite',
        {
          product_id: id,
        }
      )
    },
    {
      onSuccess: () => {
        void queryClient.invalidateQueries([profileKey])
      },
    }
  )
}

export const useCheckFavoriteProduct = () => {
  const queryClient = useQueryClient()

  return useMutation(
    async (id: string) => {
      return await authorizedClient.post<APIResponse<null>>(
        '/product/favorite/check',
        {
          product_id: id,
        }
      )
    },
    {
      onSuccess: () => {
        void queryClient.invalidateQueries([profileKey, 'check'])
      },
    }
  )
}

export const useCountSpecificFavoriteProduct = () => {
  const queryClient = useQueryClient()

  return useMutation(
    async (id: string) => {
      return await authorizedClient.post<APIResponse<null>>(
        '/product/favorite/count',
        {
          product_id: id,
        }
      )
    },
    {
      onSuccess: () => {
        void queryClient.invalidateQueries([profileKey, 'count'])
      },
    }
  )
}
