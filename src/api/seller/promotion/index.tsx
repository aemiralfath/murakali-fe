import { authorizedClient } from '@/api/apiClient'
import type {
  CreatePromotionSellerRequest,
  ProductPromotion,
  SellerPromotion,
} from '@/types/api/promotion'
import type { APIResponse, PaginationData } from '@/types/api/response'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

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

export const useCreatePromotion = () => {
  const queryClient = useQueryClient()
  return useMutation(
    async (data: CreatePromotionSellerRequest) => {
      return await authorizedClient.post<APIResponse<null>>(
        '/seller/promotion',
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

const getProductNoPromotionSeller = async (limit: number, page: number) => {
  const response = await authorizedClient.get<
    APIResponse<PaginationData<ProductPromotion>>
  >('/seller/product/without-promotion?' + '&limit=' + limit + '&page=' + page)
  return response.data
}

export const useProductNoPromotionSeller = (limit: number, page: number) => {
  return useQuery(
    [profileKey, limit, page],
    async () => await getProductNoPromotionSeller(limit, page)
  )
}
