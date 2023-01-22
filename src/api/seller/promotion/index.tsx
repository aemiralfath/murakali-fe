import { authorizedClient } from '@/api/apiClient'
import type { SellerPromotion } from '@/types/api/promotion'
import type { APIResponse, PaginationData } from '@/types/api/response'
import { useQuery } from '@tanstack/react-query'

const profileKey = 'promotion'

const getSellerPromotions = async (promotionStatusID: string) => {
  const response = await authorizedClient.get<
    APIResponse<PaginationData<SellerPromotion>>
  >('/seller/promotion?promo_status=' + promotionStatusID)
  return response.data
}

export const useSellerPromotions = (promotionStatusID: string) => {
  return useQuery(
    [profileKey, promotionStatusID],
    async () => await getSellerPromotions(promotionStatusID)
  )
}
