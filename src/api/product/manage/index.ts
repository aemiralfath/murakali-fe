import { authorizedClient } from '@/api/apiClient'
import type { CreateProductReq, EditProductReq } from '@/types/api/product'
import type { APIResponse } from '@/types/api/response'

import { useQueryClient, useMutation } from '@tanstack/react-query'

const productKey = 'product'

export const useCreateProduct = () => {
  const queryClient = useQueryClient()

  return useMutation(
    async (data: CreateProductReq) => {
      const tempData: CreateProductReq = {
        ...data,
        products_detail: data.products_detail.map((prev) => {
          return {
            ...prev,
            variant_detail: prev.variant_detail.map((prev_var_detail) => {
              return {
                name: prev_var_detail.type,
                type: prev_var_detail.name,
              }
            }),
          }
        }),
      }
      return await authorizedClient.post<APIResponse<null>>(
        '/product/',
        tempData
      )
    },
    {
      onSuccess: () => {
        void queryClient.invalidateQueries([productKey])
      },
    }
  )
}

export const useEditProduct = () => {
  const queryClient = useQueryClient()

  return useMutation(
    async (data: { id: string; data: EditProductReq }) => {
      return await authorizedClient.put<APIResponse<null>>(
        '/product/' + data.id,
        {
          ...data.data,
        }
      )
    },
    {
      onSuccess: () => {
        void queryClient.invalidateQueries([productKey])
      },
    }
  )
}

export const useEditStatus = () => {
  const queryClient = useQueryClient()

  return useMutation(
    async (product_id: string) => {
      return await authorizedClient.put<APIResponse<null>>(
        '/product/status/' + product_id
      )
    },
    {
      onSuccess: () => {
        void queryClient.invalidateQueries([productKey])
      },
    }
  )
}

export const useBulkEditStatus = () => {
  const queryClient = useQueryClient()

  return useMutation(
    async (data: { products_ids: string[]; listed_status: boolean }) => {
      return await authorizedClient.patch<APIResponse<null>>(
        '/product/bulk-status',
        {
          ...data,
        }
      )
    },
    {
      onSuccess: () => {
        void queryClient.invalidateQueries([productKey])
      },
    }
  )
}
