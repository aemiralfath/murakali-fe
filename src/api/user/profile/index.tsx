import { authorizedClient } from '@/api/apiClient'
import type { APIResponse } from '@/types/api/response'
import type { UserDetail } from '@/types/api/user'

import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import moment from 'moment'

const profileKey = ['profile']

const getUserProfile = async () => {
  const response = await authorizedClient.get<APIResponse<UserDetail>>(
    '/user/profile'
  )
  return response.data
}

export const useGetUserProfile = () =>
  useQuery({
    queryKey: profileKey,
    queryFn: getUserProfile,
    retry: false,
    refetchOnWindowFocus: false,
  })

export const useEditUserProfile = () => {
  const queryClient = useQueryClient()

  return useMutation(
    async (data: UserDetail) => {
      return await authorizedClient.put<APIResponse<null>>('/user/profile', {
        email: data.email,
        fullname: data.full_name,
        username: data.user_name,
        phone_no: data.phone_number,
        gender: data.gender,
        birth_date: moment(data.birth_date).format('DD-MM-YYYY'),
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
        form.append('Img', photo as File)
      }

      return await authorizedClient.post<APIResponse<null>>(
        '/user/profile/picture',
        form,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )
    },
    {
      onSuccess: () => {
        void queryClient.invalidateQueries(profileKey)
      },
    }
  )
}
