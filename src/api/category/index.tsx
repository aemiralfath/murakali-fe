import type { CategoryData } from '@/types/api/category'
import type { APIResponse } from '@/types/api/response'

import { useQuery } from '@tanstack/react-query'

import { authorizedClient } from '../apiClient'

const profileKey = 'category'

export const useGetAllCategory = () => {
  return useQuery([profileKey], async () => await getAllCategory())
}

const getAllCategory = async () => {
  const response = await authorizedClient.get<APIResponse<Array<CategoryData>>>(
    '/product/category'
  )
  return response.data
}
