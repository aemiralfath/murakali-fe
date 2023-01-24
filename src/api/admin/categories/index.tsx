import { authorizedClient } from '@/api/apiClient'
import {
  AdminCategoryData,
  CreateUpdateCategory,
} from '@/types/api/admincategory'
import type { APIResponse, PaginationData } from '@/types/api/response'
import type { CreateUpdateVoucher, VoucherData } from '@/types/api/voucher'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const profileKey = 'category-admin'

const getAdminCategories = async () => {
  const response = await authorizedClient.get<APIResponse<AdminCategoryData[]>>(
    '/admin/category'
  )
  return response.data
}

export const useAdminCategories = () => {
  return useQuery([profileKey], async () => await getAdminCategories())
}

export const useDeleteAdminCategories = () => {
  const queryClient = useQueryClient()

  return useMutation(
    async (id: string) => {
      return await authorizedClient.delete<APIResponse<null>>(
        '/admin/category/' + id
      )
    },
    {
      onSuccess: () => {
        void queryClient.invalidateQueries([profileKey])
      },
    }
  )
}

export const useCreateAdminCategories = () => {
  const queryClient = useQueryClient()
  return useMutation(
    async (data: CreateUpdateCategory) => {
      return await authorizedClient.post<APIResponse<null>>(
        '/admin/category',
        data
      )
    },
    {
      onSuccess: () => {
        void queryClient.invalidateQueries([profileKey])
      },
    }
  )
}

export const useUpdateAdminCategories = () => {
  const queryClient = useQueryClient()
  return useMutation(
    async (data: CreateUpdateCategory) => {
      return await authorizedClient.put<APIResponse<null>>(
        '/admin/voucher',
        data
      )
    },
    {
      onSuccess: () => {
        void queryClient.invalidateQueries([profileKey])
      },
    }
  )
}
