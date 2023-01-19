import { authorizedClient } from '@/api/apiClient'
import type { APIResponse, PaginationData } from '@/types/api/response'
import type { VoucherData } from '@/types/api/voucher'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const profileKey = 'voucher'

const getSellerVouchers = async () => {
  const response = await authorizedClient.get<
    APIResponse<PaginationData<VoucherData>>
  >('/seller/voucher')
  return response.data
}

export const useSellerVouchers = (tab: string) => {
  return useQuery([profileKey, tab], async () => await getSellerVouchers())
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
