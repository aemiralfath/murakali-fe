import { authorizedClient } from '@/api/apiClient'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'

import type { APIResponse } from '@/types/api/response'
import type { UserDetail } from '@/types/api/user'

const profileKey = ['profile']

const getUserProfile = async () => {
  const response = await authorizedClient.get<APIResponse<UserDetail>>(
    '/user/profile'
  )
  return response.data
}

export const useGetUserProfile = () => useQuery(profileKey, getUserProfile)

export const useEditUserProfile = () => {
  const queryClient = useQueryClient()

  return useMutation(
    async (data: UserDetail) => {
      return await authorizedClient.put<APIResponse<null>>('/user/profile', {
        email: data.email,
        full_name: data.full_name,
        user_name: data.user_name,
        phone_number: data.phone_number,
        gender: data.gender,
        birth_date: data.birth_date,
      })
    },
    {
      onSuccess: () => {
        void queryClient.invalidateQueries(profileKey)
      },
    }
  )
}

export const useEditProfilePicture = () => {
  const queryClient = useQueryClient()

  return useMutation(
    async (photo?: File) => {
      const form = new FormData()
      if (photo) {
        form.append('photo_url', photo)
      }

      return await authorizedClient.put<APIResponse<null>>(
        '/user/profile',
        form
      )
    },
    {
      onSuccess: () => {
        void queryClient.invalidateQueries(profileKey)
      },
    }
  )
}
