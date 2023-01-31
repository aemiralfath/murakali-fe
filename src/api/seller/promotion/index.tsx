import { authorizedClient } from '@/api/apiClient'
import type {
  CreatePromotionSellerRequest,
  ProductPromotion,
  promotionDetailData,
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

const getSellerPromotionDetail = async (promotionID: string) => {
  const response = await authorizedClient.get<APIResponse<promotionDetailData>>(
    '/seller/promotion/' + promotionID
  )
  return response.data
}

export const useSellerPromotionDetail = (promotionID: string) => {
  return useQuery(
    [profileKey, promotionID],
    async () => await getSellerPromotionDetail(promotionID)
  )
}

export const useUpdatePromotion = () => {
  const queryClient = useQueryClient()
  return useMutation(
    async (data: SellerPromotion) => {
      return await authorizedClient.put<APIResponse<null>>(
        '/seller/promotion',
        data
        // promotion_id: data.
        // product_id:
        // name:
        // max_quantity:
        // actived_date:
        // expired_date:
        // discount_percentage:
        // discount_fix_price:
        // min_product_price:
        // max_discount_price:
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
