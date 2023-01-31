import { authorizedClient } from '@/api/apiClient'
import type { APIResponse, PaginationData } from '@/types/api/response'
import type { CreateUpdateVoucher, VoucherData } from '@/types/api/voucher'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const profileKey = 'voucher-seller'

const getSellerVouchers = async (
  voucherStatus: string,
  page: number,
  sort: string
) => {
  const response = await authorizedClient.get<
    APIResponse<PaginationData<VoucherData>>
  >(
    '/seller/voucher?voucher_status=' +
      voucherStatus +
      '&limit=5&page=' +
      page +
      '&sort=' +
      sort
  )
  return response.data
}

export const useSellerVouchers = (
  voucherStatus: string,
  page: number,
  sort: string
) => {
  return useQuery(
    [profileKey, voucherStatus, page, sort],
    async () => await getSellerVouchers(voucherStatus, page, sort)
  )
}

const getSellerVoucherDetail = async (id?: string) => {
  const response = await authorizedClient.get<APIResponse<VoucherData>>(
    '/seller/voucher/' + id
  )
  return response.data
}

export const useSellerVoucherDetail = (id?: string) => {
  return useQuery({
    queryKey: [profileKey, 'detail', id],
    queryFn: async () => await getSellerVoucherDetail(id),
    enabled: Boolean(id),
  })
}

export const useDeleteSellerVouchers = () => {
  const queryClient = useQueryClient()

  return useMutation(
    async (id: string) => {
      return await authorizedClient.delete<APIResponse<null>>(
        '/seller/voucher/' + id
      )
    },
    {
      onSuccess: () => {
        void queryClient.invalidateQueries([profileKey])
      },
    }
  )
}

export const useCreateVouchers = () => {
  const queryClient = useQueryClient()
  return useMutation(
    async (data: CreateUpdateVoucher) => {
      return await authorizedClient.post<APIResponse<null>>(
        '/seller/voucher',
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

export const useUpdateVouchers = (id?: string) => {
  const queryClient = useQueryClient()
  return useMutation(
    async (data: CreateUpdateVoucher) => {
      return await authorizedClient.put<APIResponse<null>>('/seller/voucher', {
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
