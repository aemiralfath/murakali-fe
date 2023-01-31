import { authorizedClient } from '@/api/apiClient'
import type { APIResponse, PaginationData } from '@/types/api/response'
import type { ProductReview } from '@/types/api/review'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useGetReviewByUserID = (
  productId: string,
  userId?: string,
  enabled?: boolean
) => {
  return useQuery({
    queryKey: ['review', productId, userId],
    queryFn: async () => await getProductReview(productId, userId),
    enabled: enabled && Boolean(userId),
  })
}

const getProductReview = async (productId: string, userId?: string) => {
  const response = await authorizedClient.get<
    APIResponse<PaginationData<ProductReview>>
  >(`/product/${productId}/review?user_id=` + userId)
  return response.data
}

export const useCreateProductReview = () => {
  const queryClient = useQueryClient()

  return useMutation(
    async (p: {
      product_id: string
      rating: number
      comment?: string
      photo_url?: string
    }) => {
      return await authorizedClient.post<APIResponse<null>>(
        `/product/${p.product_id}/review`,
        p
      )
    },
    {
      onSuccess: () => {
        void queryClient.invalidateQueries(['review'])
      },
    }
  )
}

export const useDeleteProductReview = () => {
  const queryClient = useQueryClient()

  return useMutation(
    async (review_id: string) => {
      return await authorizedClient.delete<APIResponse<null>>(
        `/product/review/${review_id}`
      )
    },
    {
      onSuccess: () => {
        void queryClient.invalidateQueries(['review'])
      },
    }
  )
}
