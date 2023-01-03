import { authorizedClient } from '@/api/apiClient'
import { useQuery } from '@tanstack/react-query'

import type { APIResponse } from '@/types/api/response'
import type { ProductDetail } from '@/types/api/product'

const profileKey = 'seller'

const getSellerProduct = async (
  page: number,
  limit: number,
  search: string
  //   categoryName: string,
  //   shop_id: string,
  //   sort_by: string,
  //   sort_order: string
) => {
  const response = await authorizedClient.get<APIResponse<ProductDetail>>(
    '/product/?limit=' +
      String(limit) +
      '&page=' +
      String(page) +
      '&search=' +
      search
    //   +
    //   '&category=' +
    //   categoryName +
    //   '&shopid=' +
    //   shop_id +
    //   '&sort_by=' +
    //   sort_by +
    //   '&sort_order=' +
    //   sort_order
  )
  return response.data
}

export const useGetSellerProduct = (
  page: number,
  limit: number,
  search: string
  //   categoryName: string,
  //   shop_id: string,
  //   sort_by: string,
  //   sort_order: string
) => {
  return useQuery(
    [
      profileKey,
      page,
      limit,
      search,
      //   categoryName,
      //   shop_id,
      //   sort_by,
      //   sort_order,
    ],
    async () =>
      await getSellerProduct(
        page,
        limit,
        search
        // categoryName,
        // shop_id,
        // sort_by,
        // sort_order
      )
  )
}
