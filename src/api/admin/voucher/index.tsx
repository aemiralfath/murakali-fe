import { authorizedClient } from '@/api/apiClient'
import type { APIResponse, PaginationData } from '@/types/api/response'
import type { CreateUpdateVoucher, VoucherData } from '@/types/api/voucher'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const profileKey = 'voucher-admin'

const getAdminVouchers = async (
  voucherStatus: string,
  page: number,
  sort: string
) => {
  const response = await authorizedClient.get<
    APIResponse<PaginationData<VoucherData>>
  >(
    '/admin/voucher?voucher_status=' +
      voucherStatus +
      '&limit=5&page=' +
      page +
      '&sort=' +
      sort
  )
  return response.data
}

export const useAdminVouchers = (
  voucherStatus: string,
  page: number,
  sort: string
) => {
  return useQuery(
    [profileKey, voucherStatus, page, sort],
    async () => await getAdminVouchers(voucherStatus, page, sort)
  )
}

const getAdminVoucherDetail = async (id?: string) => {
  const response = await authorizedClient.get<APIResponse<VoucherData>>(
    '/admin/voucher/' + id
  )
  return response.data
}

export const useAdminVoucherDetail = (id?: string) => {
  return useQuery({
    queryKey: [profileKey, 'detail', id],
    queryFn: async () => await getAdminVoucherDetail(id),
    enabled: Boolean(id),
  })
}

export const useDeleteAdminVouchers = () => {
  const queryClient = useQueryClient()

  return useMutation(
    async (id: string) => {
      return await authorizedClient.delete<APIResponse<null>>(
        '/admin/voucher/' + id
      )
    },
    {
      onSuccess: () => {
        void queryClient.invalidateQueries([profileKey])
      },
    }
  )
}

export const useCreateAdminVouchers = () => {
  const queryClient = useQueryClient()
  return useMutation(
    async (data: CreateUpdateVoucher) => {
      return await authorizedClient.post<APIResponse<null>>(
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

export const useUpdateAdminVouchers = (id: string) => {
  const queryClient = useQueryClient()
  return useMutation(
    async (data: CreateUpdateVoucher) => {
      return await authorizedClient.put<APIResponse<null>>('/admin/voucher', {
        voucher_id: id,
        quota: data.quota,
        actived_date: data.actived_date,
        expired_date: data.expired_date,
        discount_percentage: data.discount_percentage,
        discount_fix_price: data.discount_fix_price,
        min_product_price: data.min_product_price,
        max_discount_price: data.max_discount_price,
      })
    },
    {
      onSuccess: () => {
        void queryClient.invalidateQueries([profileKey])
      },
    }
  )
}
