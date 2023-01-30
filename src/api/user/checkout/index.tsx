import { authorizedClient, unauthorizedClient } from '@/api/apiClient'
import type { APIResponse, PaginationData } from '@/types/api/response'
import type { VoucherData } from '@/types/api/voucher'

import { useQuery } from '@tanstack/react-query'

const voucherShop = 'voucher-shop'
const voucherMarketplace = 'voucher-marketplace'

const getVoucherShopCheckout = async (id: string) => {
  const response = await unauthorizedClient.get<
    APIResponse<PaginationData<VoucherData>>
  >('/cart/voucher/' + id + '?limit=100')
  return response.data
}

export const useGetVoucherShopCheckout = (id: string) => {
  return useQuery(
    [voucherShop, id],
    async () => await getVoucherShopCheckout(id)
  )
}

const getVoucherMarketplaceCheckout = async () => {
  const response = await authorizedClient.get<
    APIResponse<PaginationData<VoucherData>>
  >('/cart/voucher?limit=100')
  return response.data
}

export const useGetVoucherMarketplaceCheckout = () => {
  return useQuery(
    [voucherMarketplace],
    async () => await getVoucherMarketplaceCheckout()
  )
}
